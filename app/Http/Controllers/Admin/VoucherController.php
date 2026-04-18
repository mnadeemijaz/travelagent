<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Flight;
use App\Models\Hotel;
use App\Models\Sector;
use App\Models\TourPackage;
use App\Models\Trip;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\Voucher;
use App\Models\VoucherHotel;
use App\Models\Ziarat;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class VoucherController extends Controller
{
    private function sharedData(): array
    {
        return [
            'agents'       => User::whereHas('roles', fn($q) => $q->where('name', 'agent'))->orderBy('name')->get(['id', 'name']),
            'flights'      => Flight::where('isDeleted', 0)->orderBy('name')->get(['id', 'name']),
            'sectors'      => Sector::where('isDeleted', 0)->orderBy('name')->get(['id', 'name']),
            'vehicles'     => Vehicle::where('isDeleted', 0)->orderBy('name')->get(['id', 'name', 'sharing']),
            'trips'        => Trip::where('isDeleted', 0)->orderBy('name')->get(['id', 'name', 'vehicle_id']),
            'hotels'       => Hotel::where('isDeleted', 0)->orderBy('name')->get(['id', 'name']),
            'tourPackages' => TourPackage::where('isDeleted', 0)->orderBy('name')->get(['id', 'name']),
            'ziarats'      => Ziarat::where('isDeleted', 0)->orderBy('name')->get(['id', 'name']),
        ];
    }

    // ── Index ──────────────────────────────────────────────────────────────────

    public function index(Request $request): Response
    {
        $user = auth()->user();
        $query = Voucher::where('isDeleted', 0);

        if ($user->hasRole('agent')) {
            $query->where('agent_id', $user->id);
        } elseif ($agentId = $request->input('agent_id')) {
            $query->where('agent_id', $agentId);
        }

        if ($date = $request->input('date')) {
            $query->whereDate('date', $date);
        }

        if ($status = $request->input('v_status')) {
            $query->where('approved', $status === 'yes' ? 1 : 0);
        }

        if ($search = $request->input('searchText')) {
            $query->where('id', 'like', "%{$search}%");
        }

        $vouchers = $query
            ->with(['agent', 'departureFlight', 'returnFlight', 'vehicle', 'trip', 'hotels.hotel'])
            ->orderByDesc('id')
            ->paginate(30)
            ->withQueryString();

        return Inertia::render('admin/vouchers/index', [
            'vouchers' => $vouchers,
            'agents'   => User::whereHas('roles', fn($q) => $q->where('name', 'agent'))->orderBy('name')->get(['id', 'name']),
            'filters'  => $request->only(['searchText', 'agent_id', 'date', 'v_status']),
        ]);
    }

    // ── Create / Store ─────────────────────────────────────────────────────────

    public function create(): Response
    {
        return Inertia::render('admin/vouchers/create', $this->sharedData());
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'agent_id'       => ['required', 'integer'],
            'date'           => ['required', 'date'],
            'dep_date'       => ['nullable', 'date'],
            'dep_time'       => ['nullable', 'string'],
            'arv_date'       => ['nullable', 'date'],
            'arv_time'       => ['nullable', 'string'],
            'ret_date'       => ['nullable', 'date'],
            'ret_time'       => ['nullable', 'string'],
            'dep_flight'     => ['nullable', 'integer'],
            'dep_flight_no'  => ['nullable', 'string', 'max:50'],
            'dep_pnr_no'     => ['nullable', 'string', 'max:50'],
            'dep_sector1'    => ['nullable', 'integer'],
            'dep_sector2'    => ['nullable', 'string', 'max:10'],
            'ret_flight'     => ['nullable', 'integer'],
            'ret_flight_no'  => ['nullable', 'string', 'max:50'],
            'ret_pnr_no'     => ['nullable', 'string', 'max:50'],
            'ret_sector1'    => ['nullable', 'string', 'max:10'],
            'ret_sector2'    => ['nullable', 'integer'],
            'vehicle_id'     => ['nullable', 'integer'],
            'trip_id'        => ['nullable', 'integer'],
            'pkg_type'       => ['nullable', 'integer'],
            'total_nights'   => ['nullable', 'integer'],
            'gp_hd_no'       => ['nullable', 'string', 'max:30'],
            'remarks'        => ['nullable', 'string'],
            'contact'        => ['nullable', 'string', 'max:50'],
            'client_ids'     => ['nullable', 'array'],
            'client_ids.*'   => ['integer'],
            'hotels'         => ['nullable', 'array'],
            'hotels.*.city_name'   => ['nullable', 'string'],
            'hotels.*.city_nights' => ['nullable', 'integer'],
            'hotels.*.check_in'    => ['nullable', 'date'],
            'hotels.*.check_out'   => ['nullable', 'date'],
            'hotels.*.hotel_id'    => ['nullable', 'integer'],
            'hotels.*.room_type'   => ['nullable', 'string'],
            'ziarat_ids'     => ['nullable', 'array'],
            'ziarat_ids.*'   => ['integer'],
        ]);

        DB::transaction(function () use ($validated) {
            $clientIds   = $validated['client_ids'] ?? [];
            $hotelRows   = $validated['hotels'] ?? [];
            $ziaratIds   = $validated['ziarat_ids'] ?? [];

            // Count pax from clients
            $clients = Client::whereIn('id', $clientIds)->get(['id', 'age_group']);
            $tAdult  = $clients->where('age_group', 'adult')->count();
            $tChild  = $clients->where('age_group', 'child')->count();
            $tInfant = $clients->where('age_group', 'infant')->count();

            $voucher = Voucher::create(array_merge(
                collect($validated)->except(['client_ids', 'hotels', 'ziarat_ids'])->toArray(),
                ['t_adult' => $tAdult, 't_child' => $tChild, 't_infant' => $tInfant]
            ));

            // Attach clients — mark voucher_issue = yes
            if ($clientIds) {
                $voucher->clients()->sync($clientIds);
                Client::whereIn('id', $clientIds)->update(['voucher_issue' => 'yes']);
            }

            // Hotel rows
            foreach ($hotelRows as $row) {
                if (!empty($row['city_name'])) {
                    VoucherHotel::create(array_merge($row, ['voucher_id' => $voucher->id]));
                }
            }

            // Ziarats
            if ($ziaratIds) {
                $voucher->ziarats()->sync($ziaratIds);
            }
        });

        return redirect()->route('admin.vouchers.index')->with('success', 'Voucher created successfully.');
    }

    // ── Edit / Update ──────────────────────────────────────────────────────────

    public function edit(Voucher $voucher): Response
    {
        $voucher->load(['clients', 'hotels', 'ziarats']);

        return Inertia::render('admin/vouchers/edit', array_merge($this->sharedData(), [
            'voucher'      => $voucher,
            'selectedClients' => $voucher->clients->pluck('id')->toArray(),
            'selectedZiarats' => $voucher->ziarats->pluck('id')->toArray(),
        ]));
    }

    public function update(Request $request, Voucher $voucher): RedirectResponse
    {
        $validated = $request->validate([
            'agent_id'       => ['required', 'integer'],
            'date'           => ['required', 'date'],
            'dep_date'       => ['nullable', 'date'],
            'dep_time'       => ['nullable', 'string'],
            'arv_date'       => ['nullable', 'date'],
            'arv_time'       => ['nullable', 'string'],
            'ret_date'       => ['nullable', 'date'],
            'ret_time'       => ['nullable', 'string'],
            'dep_flight'     => ['nullable', 'integer'],
            'dep_flight_no'  => ['nullable', 'string', 'max:50'],
            'dep_pnr_no'     => ['nullable', 'string', 'max:50'],
            'dep_sector1'    => ['nullable', 'integer'],
            'dep_sector2'    => ['nullable', 'string', 'max:10'],
            'ret_flight'     => ['nullable', 'integer'],
            'ret_flight_no'  => ['nullable', 'string', 'max:50'],
            'ret_pnr_no'     => ['nullable', 'string', 'max:50'],
            'ret_sector1'    => ['nullable', 'string', 'max:10'],
            'ret_sector2'    => ['nullable', 'integer'],
            'vehicle_id'     => ['nullable', 'integer'],
            'trip_id'        => ['nullable', 'integer'],
            'pkg_type'       => ['nullable', 'integer'],
            'total_nights'   => ['nullable', 'integer'],
            'gp_hd_no'       => ['nullable', 'string', 'max:30'],
            'remarks'        => ['nullable', 'string'],
            'contact'        => ['nullable', 'string', 'max:50'],
            'client_ids'     => ['nullable', 'array'],
            'hotels'         => ['nullable', 'array'],
            'ziarat_ids'     => ['nullable', 'array'],
        ]);

        DB::transaction(function () use ($validated, $voucher) {
            $clientIds = $validated['client_ids'] ?? [];
            $hotelRows = $validated['hotels'] ?? [];
            $ziaratIds = $validated['ziarat_ids'] ?? [];

            $clients = Client::whereIn('id', $clientIds)->get(['id', 'age_group']);
            $voucher->update(array_merge(
                collect($validated)->except(['client_ids', 'hotels', 'ziarat_ids'])->toArray(),
                [
                    't_adult'  => $clients->where('age_group', 'adult')->count(),
                    't_child'  => $clients->where('age_group', 'child')->count(),
                    't_infant' => $clients->where('age_group', 'infant')->count(),
                ]
            ));

            // Re-sync clients
            $removedIds = $voucher->clients->pluck('id')->diff($clientIds);
            Client::whereIn('id', $removedIds)->update(['voucher_issue' => 'no']);
            $voucher->clients()->sync($clientIds);
            if ($clientIds) {
                Client::whereIn('id', $clientIds)->update(['voucher_issue' => 'yes']);
            }

            // Replace hotels
            $voucher->hotels()->delete();
            foreach ($hotelRows as $row) {
                if (!empty($row['city_name'])) {
                    VoucherHotel::create(array_merge($row, ['voucher_id' => $voucher->id]));
                }
            }

            $voucher->ziarats()->sync($ziaratIds);
        });

        return redirect()->route('admin.vouchers.index')->with('success', 'Voucher updated successfully.');
    }

    // ── Delete / Cancel ────────────────────────────────────────────────────────

    public function destroy(Voucher $voucher): JsonResponse
    {
        $voucher->clients()->each(fn($c) => $c->update(['voucher_issue' => 'no']));
        $voucher->update(['isDeleted' => 1]);
        return response()->json(['status' => true]);
    }

    // ── Approve / Reject ───────────────────────────────────────────────────────

    public function approve(Request $request): JsonResponse
    {
        $request->validate(['id' => ['required', 'integer']]);
        Voucher::where('id', $request->id)->update(['approved' => 1]);
        return response()->json(['status' => true]);
    }

    public function reject(Request $request): JsonResponse
    {
        $request->validate(['id' => ['required', 'integer']]);
        Voucher::where('id', $request->id)->update(['approved' => 0]);
        return response()->json(['status' => true]);
    }

    // ── Eligible clients for a voucher (AJAX) ─────────────────────────────────

    public function eligibleClients(Request $request): JsonResponse
    {
        $agentId = $request->input('agent_id');
        $clients = Client::where('voucher_issue', 'no')
            ->where('visa_approve', 'yes')
            ->where('isDeleted', 0)
            ->when($agentId, fn($q) => $q->where('agent_id', $agentId))
            ->with('visaCompany')
            ->get(['id', 'sr_name', 'name', 'last_name', 'ppno', 'dob', 'age_group',
                   'account_pkg', 'group_code', 'group_name', 'visa_company_id', 'agent_id']);
        return response()->json($clients);
    }
}
