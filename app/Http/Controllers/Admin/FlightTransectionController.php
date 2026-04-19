<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Bank;
use App\Models\Flight;
use App\Models\FlightTransection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FlightTransectionController extends Controller
{
    private function formData(): array
    {
        return [
            'flights' => Flight::where('isDeleted', 0)->orderBy('name')->get(['id', 'name']),
            'banks'   => Bank::orderBy('name')->get(['id', 'name']),
        ];
    }

    // ── Index ──────────────────────────────────────────────────────────────────

    public function index(Request $request): Response
    {
        $query = FlightTransection::where('isDeleted', 0);

        if ($flightId = $request->input('flight_id')) {
            $query->where('flight_id', $flightId);
        }

        if ($paymentType = $request->input('payment_type')) {
            $query->where('payment_type', $paymentType);
        }

        if ($date = $request->input('date')) {
            $query->whereDate('date', $date);
        }

        if ($search = $request->input('search')) {
            $query->where('detail', 'like', "%{$search}%");
        }

        $records = $query->with(['flight:id,name', 'bank:id,name'])
                         ->orderByDesc('id')
                         ->paginate(25)
                         ->withQueryString();

        // Running balance
        $totalCr = FlightTransection::where('isDeleted', 0)->where('payment_type', 'cr')->sum('amount');
        $totalDr = FlightTransection::where('isDeleted', 0)->where('payment_type', 'dr')->sum('amount');

        return Inertia::render('admin/flight-transections/index', [
            'records'   => $records,
            'flights'   => Flight::where('isDeleted', 0)->orderBy('name')->get(['id', 'name']),
            'filters'   => $request->only(['search', 'flight_id', 'payment_type', 'date']),
            'totalCr'   => $totalCr,
            'totalDr'   => $totalDr,
            'balance'   => $totalCr - $totalDr,
        ]);
    }

    // ── Create / Store ─────────────────────────────────────────────────────────

    public function create(): Response
    {
        return Inertia::render('admin/flight-transections/create', $this->formData());
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'flight_id'    => ['nullable', 'integer', 'exists:flights,id'],
            'amount'       => ['required', 'integer', 'min:1'],
            'payment_type' => ['required', 'in:cr,dr'],
            'date'         => ['required', 'date'],
            'detail'       => ['required', 'string', 'max:100'],
            'bank_id'      => ['nullable', 'integer', 'exists:banks,id'],
        ]);

        FlightTransection::create($validated);

        return redirect()->route('admin.flight-transections.index')->with('success', 'Transaction added successfully.');
    }

    // ── Edit / Update ──────────────────────────────────────────────────────────

    public function edit(FlightTransection $flightTransection): Response
    {
        return Inertia::render('admin/flight-transections/edit', array_merge($this->formData(), [
            'record' => $flightTransection,
        ]));
    }

    public function update(Request $request, FlightTransection $flightTransection): RedirectResponse
    {
        $validated = $request->validate([
            'flight_id'    => ['nullable', 'integer', 'exists:flights,id'],
            'amount'       => ['required', 'integer', 'min:1'],
            'payment_type' => ['required', 'in:cr,dr'],
            'date'         => ['required', 'date'],
            'detail'       => ['required', 'string', 'max:100'],
            'bank_id'      => ['nullable', 'integer', 'exists:banks,id'],
        ]);

        $flightTransection->update($validated);

        return redirect()->route('admin.flight-transections.index')->with('success', 'Transaction updated successfully.');
    }

    // ── Delete ─────────────────────────────────────────────────────────────────

    public function destroy(FlightTransection $flightTransection): RedirectResponse
    {
        $flightTransection->update(['isDeleted' => 1]);

        return back()->with('success', 'Transaction deleted.');
    }
}
