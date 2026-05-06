<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AgentHotel;
use App\Models\Client;
use App\Models\CompanyConfiguration;
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
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class VoucherController extends Controller
{
    private function sharedData(): array
    {
        $user = auth()->user();

        // Agents only see themselves in the agent dropdown
        $agents = $user->hasRole('agent')
            ? collect([['id' => $user->id, 'name' => $user->name]])
            : User::whereHas('roles', fn($q) => $q->where('name', 'agent'))->orderBy('name')->get(['id', 'name']);

        // Build agentHotels map: { agentId => [ {id, name, city_name, price}, ... ] }
        $agentIds = $agents->pluck('id')->toArray();
        $agentHotels = AgentHotel::whereIn('agent_id', $agentIds)
            ->with('hotel:id,name,city_name')
            ->get()
            ->groupBy('agent_id')
            ->map(fn($rows) => $rows
                ->filter(fn($ah) => $ah->hotel !== null)
                ->sortBy(fn($ah) => [$ah->hotel->city_name, $ah->hotel->name, $ah->room_type])
                ->values()
                ->map(fn($ah) => [
                    'id'        => $ah->hotel->id,
                    'name'      => $ah->hotel->name,
                    'city_name' => $ah->hotel->city_name,
                    'room_type' => $ah->room_type,
                    'price'     => (float) $ah->price,
                ])
            );

        $config = CompanyConfiguration::instance();

        return [
            'agents'       => $agents,
            'isAgent'      => $user->hasRole('agent'),
            'agentHotels'  => $agentHotels,
            'flights'      => Flight::where('isDeleted', 0)->orderBy('name')->get(['id', 'name']),
            'sectors'      => Sector::where('isDeleted', 0)->orderBy('name')->get(['id', 'name']),
            'vehicles'     => Vehicle::where('isDeleted', 0)->orderBy('name')->get(['id', 'name', 'sharing']),
            'trips'        => Trip::where('isDeleted', 0)->orderBy('name')->get(['id', 'name', 'vehicle_id']),
            'tourPackages' => TourPackage::where('isDeleted', 0)->orderBy('name')->get(['id', 'name']),
            'ziarats'      => Ziarat::where('isDeleted', 0)->orderBy('name')->get(['id', 'name', 'amount']),
            'defaultRates' => [
                'adult_rate'  => (float) ($config->adult_rate  ?? 0),
                'child_rate'  => (float) ($config->child_rate  ?? 0),
                'infant_rate' => (float) ($config->infant_rate ?? 0),
                'sr_rate'     => (float) ($config->sr_rate     ?? 1),
            ],
        ];
    }

    /** Look up an agent's hotel+room_type price from agent_hotels; fallback to 0. */
    private function agentHotelPrice(int $agentId, ?int $hotelId, ?string $roomType = 'sharing'): float
    {
        if (!$hotelId) return 0;
        $ah = AgentHotel::where('agent_id', $agentId)
            ->where('hotel_id', $hotelId)
            ->where('room_type', $roomType ?? 'sharing')
            ->first();
        return $ah ? (float) $ah->price : 0;
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
        // Agents can only create vouchers for themselves
        if (auth()->user()->hasRole('agent')) {
            $request->merge(['agent_id' => auth()->id()]);
        }

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
            'adult_rate'     => ['nullable', 'numeric', 'min:0'],
            'child_rate'     => ['nullable', 'numeric', 'min:0'],
            'infant_rate'    => ['nullable', 'numeric', 'min:0'],
            'sr_rate'        => ['nullable', 'numeric', 'min:0'],
            'client_ids'     => ['nullable', 'array'],
            'client_ids.*'   => ['integer'],
            'hotels'         => ['nullable', 'array'],
            'hotels.*.city_name'   => ['nullable', 'string'],
            'hotels.*.city_nights' => ['nullable', 'integer'],
            'hotels.*.check_in'    => ['nullable', 'date'],
            'hotels.*.check_out'   => ['nullable', 'date'],
            'hotels.*.hotel_id'    => ['nullable', 'integer'],
            'hotels.*.price'       => ['nullable', 'numeric'],
            'hotels.*.room_type'   => ['nullable', 'string'],
            'ziarat_ids'     => ['nullable', 'array'],
            'ziarat_ids.*'   => ['integer'],
        ]);

        DB::transaction(function () use ($validated) {
            $agentId     = (int) $validated['agent_id'];
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

            // Hotel rows — lock in price from agent_hotels
            foreach ($hotelRows as $row) {
                if (!empty($row['city_name'])) {
                    $price = !empty($row['price'])
                        ? (float) $row['price']
                        : $this->agentHotelPrice($agentId, $row['hotel_id'] ?? null, $row['room_type'] ?? 'sharing');
                    VoucherHotel::create(array_merge($row, ['voucher_id' => $voucher->id, 'price' => $price]));
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
        // Agents cannot change the agent on a voucher
        if (auth()->user()->hasRole('agent')) {
            $request->merge(['agent_id' => auth()->id()]);
        }

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
            'adult_rate'     => ['nullable', 'numeric', 'min:0'],
            'child_rate'     => ['nullable', 'numeric', 'min:0'],
            'infant_rate'    => ['nullable', 'numeric', 'min:0'],
            'sr_rate'        => ['nullable', 'numeric', 'min:0'],
            'client_ids'     => ['nullable', 'array'],
            'hotels'         => ['nullable', 'array'],
            'hotels.*.price' => ['nullable', 'numeric'],
            'ziarat_ids'     => ['nullable', 'array'],
        ]);

        DB::transaction(function () use ($validated, $voucher) {
            $agentId   = (int) $validated['agent_id'];
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

            // Replace hotels — lock in price from agent_hotels
            $voucher->hotels()->delete();
            foreach ($hotelRows as $row) {
                if (!empty($row['city_name'])) {
                    $price = !empty($row['price'])
                        ? (float) $row['price']
                        : $this->agentHotelPrice($agentId, $row['hotel_id'] ?? null, $row['room_type'] ?? 'sharing');
                    VoucherHotel::create(array_merge($row, ['voucher_id' => $voucher->id, 'price' => $price]));
                }
            }

            $voucher->ziarats()->sync($ziaratIds);
        });

        return redirect()->route('admin.vouchers.index')->with('success', 'Voucher updated successfully.');
    }

    // ── Delete / Cancel ────────────────────────────────────────────────────────

    public function destroy(Voucher $voucher): RedirectResponse
    {
        $clientIds = $voucher->clients()->pluck('clients.id');
        if ($clientIds->isNotEmpty()) {
            Client::whereIn('id', $clientIds)->update(['voucher_issue' => 'no']);
        }
        $voucher->update(['isDeleted' => 1]);

        return back()->with('success', 'Voucher cancelled.');
    }

    // ── Approve / Reject ───────────────────────────────────────────────────────

    public function approve(Request $request): RedirectResponse
    {
        $request->validate(['id' => ['required', 'integer']]);
        Voucher::where('id', $request->id)->update(['approved' => 1]);

        return back()->with('success', 'Voucher approved.');
    }

    public function reject(Request $request): RedirectResponse
    {
        $request->validate(['id' => ['required', 'integer']]);
        $voucher = Voucher::findOrFail($request->id);

        $clientIds = $voucher->clients()->pluck('clients.id');
        if ($clientIds->isNotEmpty()) {
            Client::whereIn('id', $clientIds)->update(['voucher_issue' => 'no']);
        }

        $voucher->update(['approved' => 0]);

        return back()->with('success', 'Voucher rejected.');
    }

    // ── Voucher View / Invoice (screen) ───────────────────────────────────────

    private function voucherPayload(Voucher $voucher): array
    {
        $voucher->load(['agent', 'departureFlight', 'returnFlight', 'vehicle', 'trip', 'hotels.hotel', 'clients', 'ziarats']);

        $depSector1Name = $voucher->dep_sector1 ? optional(Sector::find($voucher->dep_sector1))->name : null;
        $retSector2Name = $voucher->ret_sector2 ? optional(Sector::find($voucher->ret_sector2))->name : null;
        $config         = CompanyConfiguration::instance();

        return [
            'voucher' => [
                'id'              => $voucher->id,
                'share_url'       => route('voucher.public', $voucher->share_token),
                'date'            => $voucher->date?->format('d/m/Y'),
                'approved'        => (bool) $voucher->approved,
                't_adult'         => $voucher->t_adult,
                't_child'         => $voucher->t_child,
                't_infant'        => $voucher->t_infant,
                'arv_date'        => $voucher->arv_date?->format('d/m/Y'),
                'ret_date'        => $voucher->ret_date?->format('d/m/Y'),
                'dep_date'        => $voucher->dep_date?->format('d/m/Y'),
                'dep_time'        => $voucher->dep_time,
                'arv_time'        => $voucher->arv_time,
                'ret_time'        => $voucher->ret_time,
                'dep_sector1'     => $depSector1Name,
                'dep_sector2'     => $voucher->dep_sector2,
                'ret_sector1'     => $voucher->ret_sector1,
                'ret_sector2'     => $retSector2Name,
                'dep_flight_name' => $voucher->departureFlight?->name,
                'dep_flight_no'   => $voucher->dep_flight_no,
                'dep_pnr_no'      => $voucher->dep_pnr_no,
                'ret_flight_name' => $voucher->returnFlight?->name,
                'ret_flight_no'   => $voucher->ret_flight_no,
                'ret_pnr_no'      => $voucher->ret_pnr_no,
                'vehicle_name'    => $voucher->vehicle?->name,
                'trip_name'       => $voucher->trip?->name,
                'gp_hd_no'        => $voucher->gp_hd_no,
                'remarks'         => $voucher->remarks,
                'contact'         => $voucher->contact,
                'total_nights'    => $voucher->total_nights,
                'adult_rate'      => $voucher->adult_rate,
                'child_rate'      => $voucher->child_rate,
                'infant_rate'     => $voucher->infant_rate,
                'sr_rate'         => $voucher->sr_rate,
                'total'           => $voucher->total,
                'agent_name'      => $voucher->agent?->name,
            ],
            'hotels' => $voucher->hotels->map(fn($h) => [
                'city_name'  => $h->city_name,
                'hotel_name' => $h->hotel?->name,
                'check_in'   => $h->check_in?->format('d/m/Y'),
                'check_out'  => $h->check_out?->format('d/m/Y'),
                'city_nights'=> $h->city_nights,
                'room_type'  => $h->room_type,
                'price'      => (float) $h->price,
            ]),
            'clients' => $voucher->clients->map(fn($c) => [
                'sr_name'    => $c->sr_name,
                'name'       => $c->name,
                'last_name'  => $c->last_name,
                'ppno'       => $c->ppno,
                'dob'        => $c->dob?->format('d/m/Y'),
                'age_group'  => $c->age_group,
                'visa_no'    => $c->visa_no,
                'visa_date'  => $c->visa_date?->format('d/m/Y'),
            ]),
            'ziarats' => $voucher->ziarats->map(fn($z) => ['name' => $z->name, 'amount' => (float) $z->amount]),
            'company' => [
                'name'                  => $config->company_name,
                'address'               => $config->address,
                'phone'                 => $config->phone,
                'email'                 => $config->email,
                'makkah_contact1_name'  => $config->makkah_contact1_name,
                'makkah_contact1_phone' => $config->makkah_contact1_phone,
                'makkah_contact2_name'  => $config->makkah_contact2_name,
                'makkah_contact2_phone' => $config->makkah_contact2_phone,
                'madina_contact1_name'  => $config->madina_contact1_name,
                'madina_contact1_phone' => $config->madina_contact1_phone,
                'madina_contact2_name'  => $config->madina_contact2_name,
                'madina_contact2_phone' => $config->madina_contact2_phone,
                'contact_name'          => $config->contact_name,
                'contact_phone'         => $config->contact_phone,
                // Agent-specific header fields
                'agent_company_name'    => $voucher->agent?->company_name,
                'agent_address'         => $voucher->agent?->address,
                'agent_mobile'          => $voucher->agent?->mobile,
                'agent_logo_url'        => $voucher->agent?->logo_url,
            ],
        ];
    }

    public function voucherView(Voucher $voucher): Response
    {
        return Inertia::render('admin/vouchers/view', $this->voucherPayload($voucher));
    }

    public function voucherInvoice(Voucher $voucher): Response
    {
        return Inertia::render('admin/vouchers/invoice', $this->voucherPayload($voucher));
    }

    // ── Voucher PDF ────────────────────────────────────────────────────────────

    private function qrCodeBase64(string $url): string
    {
        $renderer = new ImageRenderer(
            new RendererStyle(120),
            new SvgImageBackEnd()
        );
        $writer = new Writer($renderer);
        $svg = $writer->writeString($url);
        return 'data:image/svg+xml;base64,' . base64_encode($svg);
    }

    public function voucherPdf(Voucher $voucher): HttpResponse
    {
        $data = $this->voucherPayload($voucher);
        $data['logoPath']         = storage_path('app/public/icon.png');
        $data['instructionsPath'] = storage_path('app/public/al_abrar.jpg');
        $data['qrCodeBase64']     = $this->qrCodeBase64($data['voucher']['share_url']);
        $agentLogo = $voucher->agent?->company_logo;
        $data['agentLogoPath'] = $agentLogo ? storage_path('app/public/' . $agentLogo) : null;
        $pdf = Pdf::loadView('pdf.voucher', $data)->setPaper('a4', 'portrait');
        return $pdf->download("voucher-{$voucher->id}.pdf");
    }

    public function invoicePdf(Voucher $voucher): HttpResponse
    {
        $data = $this->voucherPayload($voucher);
        $data['logoPath']         = storage_path('app/public/icon.png');
        $data['instructionsPath'] = storage_path('app/public/al_abrar.jpg');
        $data['qrCodeBase64']     = $this->qrCodeBase64($data['voucher']['share_url']);
        $agentLogo = $voucher->agent?->company_logo;
        $data['agentLogoPath'] = $agentLogo ? storage_path('app/public/' . $agentLogo) : null;
        $pdf = Pdf::loadView('pdf.voucher-invoice', $data)->setPaper('a4', 'portrait');
        return $pdf->download("invoice-{$voucher->id}.pdf");
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
