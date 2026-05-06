<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Flight;
use App\Models\TicketSale;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TicketSaleController extends Controller
{
    private function formData(): array
    {
        return [
            'flights' => Flight::where('isDeleted', 0)->orderBy('name')->get(['id', 'name']),
            'agents'  => User::whereHas('roles', fn($q) => $q->where('name', 'agent'))->orderBy('name')->get(['id', 'name']),
        ];
    }

    // ── Index ──────────────────────────────────────────────────────────────────

    public function index(Request $request): Response
    {
        $user  = auth()->user();
        $query = TicketSale::where('isDeleted', 0);

        // Agents only see their own tickets
        if ($user->hasRole('agent')) {
            $query->where('agent_id', $user->id);
        }

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('ticket_no', 'like', "%{$search}%")
                  ->orWhere('pnr', 'like', "%{$search}%");
            });
        }

        if ($agentId = $request->input('agent_id')) {
            $query->where('agent_id', $agentId);
        }

        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('date', [$request->input('start_date'), $request->input('end_date')]);
        } elseif ($request->filled('start_date')) {
            $query->whereDate('date', '>=', $request->input('start_date'));
        } elseif ($request->filled('end_date')) {
            $query->whereDate('date', '<=', $request->input('end_date'));
        }

        if ($flightId = $request->input('flight_id')) {
            $query->where('flight_id', $flightId);
        }

        if ($bsp = $request->input('bsp')) {
            $query->where('bps_sale', $bsp);
        }

        $tickets = $query->with(['flight:id,name', 'agent:id,name'])
                         ->orderByDesc('id')
                         ->paginate(25)
                         ->withQueryString();

        return Inertia::render('admin/ticket-sales/index', [
            'tickets' => $tickets,
            'agents'  => User::whereHas('roles', fn($q) => $q->where('name', 'agent'))->orderBy('name')->get(['id', 'name']),
            'flights' => Flight::where('isDeleted', 0)->orderBy('name')->get(['id', 'name']),
            'filters' => $request->only(['search', 'agent_id', 'start_date', 'end_date', 'flight_id', 'bsp']),
            'isAgent' => $user->hasRole('agent'),
        ]);
    }

    // ── Create / Store ─────────────────────────────────────────────────────────

    public function create(): Response
    {
        return Inertia::render('admin/ticket-sales/create', $this->formData());
    }

    public function store(Request $request): RedirectResponse
    {
        if (auth()->user()->hasRole('agent')) {
            $request->merge(['agent_id' => auth()->id()]);
        }

        $validated = $request->validate([
            'date'           => ['required', 'date'],
            'name'           => ['required', 'string', 'max:120'],
            'phone'          => ['nullable', 'string', 'max:100'],
            'ticket_no'      => ['required', 'string', 'max:100'],
            'pnr'            => ['required', 'string', 'max:100'],
            'flight_id'      => ['required', 'integer', 'exists:flights,id'],
            'agent_id'       => ['required', 'integer'],
            'ticket_from_to' => ['required', 'string', 'max:120'],
            'category'       => ['required', 'string', 'max:110'],
            'purchase'       => ['required', 'integer', 'min:0'],
            'sale'           => ['required', 'integer', 'min:0'],
            'bps_sale'       => ['in:no,yes'],
            'payment_status' => ['nullable', 'in:partial,full'],
            'paid_amount'    => ['nullable', 'integer', 'min:0'],
        ]);

        TicketSale::create($validated);

        return redirect()->route('admin.ticket-sales.index')->with('success', 'Ticket sale added successfully.');
    }

    // ── Edit / Update ──────────────────────────────────────────────────────────

    public function edit(TicketSale $ticketSale): Response
    {
        return Inertia::render('admin/ticket-sales/edit', array_merge($this->formData(), [
            'ticket' => $ticketSale,
        ]));
    }

    public function update(Request $request, TicketSale $ticketSale): RedirectResponse
    {
        if (auth()->user()->hasRole('agent')) {
            $request->merge(['agent_id' => auth()->id()]);
        }

        $validated = $request->validate([
            'date'           => ['required', 'date'],
            'name'           => ['required', 'string', 'max:120'],
            'phone'          => ['nullable', 'string', 'max:100'],
            'ticket_no'      => ['required', 'string', 'max:100'],
            'pnr'            => ['required', 'string', 'max:100'],
            'flight_id'      => ['required', 'integer', 'exists:flights,id'],
            'agent_id'       => ['required', 'integer'],
            'ticket_from_to' => ['required', 'string', 'max:120'],
            'category'       => ['required', 'string', 'max:110'],
            'purchase'       => ['required', 'integer', 'min:0'],
            'sale'           => ['required', 'integer', 'min:0'],
            'bps_sale'       => ['in:no,yes'],
            'payment_status' => ['nullable', 'in:partial,full'],
            'paid_amount'    => ['nullable', 'integer', 'min:0'],
        ]);

        $ticketSale->update($validated);

        return redirect()->route('admin.ticket-sales.index')->with('success', 'Ticket sale updated successfully.');
    }

    // ── Delete ─────────────────────────────────────────────────────────────────

    public function destroy(TicketSale $ticketSale): RedirectResponse
    {
        $ticketSale->update(['isDeleted' => 1]);

        return back()->with('success', 'Ticket sale deleted.');
    }
}
