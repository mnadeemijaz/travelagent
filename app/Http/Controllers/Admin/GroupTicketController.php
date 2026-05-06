<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GroupTicket;
use App\Models\GroupTicketBooking;
use App\Models\GroupTicketCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class GroupTicketController extends Controller
{
    // ── Tickets CRUD ───────────────────────────────────────────────────────────

    public function index(Request $request): Response
    {
        $query = GroupTicket::where('isDeleted', 0);

        if ($cat = $request->input('category')) {
            $query->where('category', $cat);
        }

        return Inertia::render('admin/group-tickets/index', [
            'tickets'    => $query->withCount('bookings')->orderByDesc('id')->paginate(25)->withQueryString(),
            'categories' => GroupTicketCategory::orderBy('name')->get(['id', 'name']),
            'filters'    => $request->only(['category']),
            'flash'      => session()->only(['success', 'error']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/group-tickets/create', [
            'categories' => GroupTicketCategory::orderBy('name')->pluck('name'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'category'        => ['required', 'string', 'max:50'],
            'airline'         => ['required', 'string', 'max:100'],
            'from_city'       => ['required', 'string', 'max:100'],
            'to_city'         => ['required', 'string', 'max:100'],
            'booking_code'    => ['nullable', 'string', 'max:50'],
            'dep_date'        => ['required', 'date'],
            'dep_time'        => ['required'],
            'arr_time'        => ['required'],
            'flight_no'       => ['nullable', 'string', 'max:30'],
            'meal'            => ['required', 'in:yes,no'],
            'baggage'         => ['nullable', 'string', 'max:50'],
            'price'           => ['required', 'integer', 'min:0'],
            'seats_available' => ['required', 'integer', 'min:0'],
            'is_active'       => ['boolean'],
        ]);

        GroupTicket::create($validated);

        return redirect()->route('admin.group-tickets.index')->with('success', 'Group ticket created.');
    }

    public function edit(GroupTicket $groupTicket): Response
    {
        return Inertia::render('admin/group-tickets/edit', [
            'ticket'     => $groupTicket,
            'categories' => GroupTicketCategory::orderBy('name')->pluck('name'),
        ]);
    }

    public function update(Request $request, GroupTicket $groupTicket): RedirectResponse
    {
        $validated = $request->validate([
            'category'        => ['required', 'string', 'max:50'],
            'airline'         => ['required', 'string', 'max:100'],
            'from_city'       => ['required', 'string', 'max:100'],
            'to_city'         => ['required', 'string', 'max:100'],
            'booking_code'    => ['nullable', 'string', 'max:50'],
            'dep_date'        => ['required', 'date'],
            'dep_time'        => ['required'],
            'arr_time'        => ['required'],
            'flight_no'       => ['nullable', 'string', 'max:30'],
            'meal'            => ['required', 'in:yes,no'],
            'baggage'         => ['nullable', 'string', 'max:50'],
            'price'           => ['required', 'integer', 'min:0'],
            'seats_available' => ['required', 'integer', 'min:0'],
            'is_active'       => ['boolean'],
        ]);

        $groupTicket->update($validated);

        return redirect()->route('admin.group-tickets.index')->with('success', 'Group ticket updated.');
    }

    public function destroy(GroupTicket $groupTicket): RedirectResponse
    {
        $groupTicket->update(['isDeleted' => 1]);
        return back()->with('success', 'Group ticket deleted.');
    }

    // ── Category Management ────────────────────────────────────────────────────

    public function storeCategory(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:50', 'unique:group_ticket_categories,name'],
        ]);

        GroupTicketCategory::create(['name' => strtolower(trim($request->name))]);

        return back()->with('success', "Category '{$request->name}' added.");
    }

    public function destroyCategory(GroupTicketCategory $groupTicketCategory): RedirectResponse
    {
        $inUse = GroupTicket::where('isDeleted', 0)
            ->where('category', $groupTicketCategory->name)
            ->exists();

        if ($inUse) {
            return back()->with('error', "Cannot delete '{$groupTicketCategory->name}' — it has active tickets.");
        }

        $groupTicketCategory->delete();

        return back()->with('success', "Category '{$groupTicketCategory->name}' deleted.");
    }

    // ── Bookings management ────────────────────────────────────────────────────

    public function bookings(Request $request): Response
    {
        $user    = $request->user();
        $isAdmin = $user->hasRole('admin');

        $query = GroupTicketBooking::with(['ticket', 'user']);

        if (! $isAdmin) {
            $query->where('user_id', $user->id);
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        if ($cat = $request->input('category')) {
            $query->whereHas('ticket', fn ($q) => $q->where('category', $cat));
        }

        return Inertia::render('admin/group-tickets/bookings', [
            'bookings'   => $query->orderByDesc('id')->paginate(25)->withQueryString(),
            'categories' => GroupTicketCategory::orderBy('name')->pluck('name'),
            'filters'    => $request->only(['status', 'category']),
            'flash'      => session()->only(['success']),
            'isAdmin'    => $isAdmin,
        ]);
    }

    public function approveBooking(GroupTicketBooking $booking): RedirectResponse
    {
        if ($booking->status === 'cancelled') {
            return back()->withErrors(['error' => 'This booking has already been cancelled due to payment timeout.']);
        }

        $booking->update(['status' => 'approved', 'expires_at' => null]);
        return back()->with('success', 'Booking approved.');
    }

    public function rejectBooking(GroupTicketBooking $booking): RedirectResponse
    {
        $booking->update(['status' => 'rejected']);
        return back()->with('success', 'Booking rejected.');
    }

    // ── Admin booking (inline) ─────────────────────────────────────────────────

    public function bookAdmin(Request $request, GroupTicket $groupTicket): RedirectResponse
    {
        $validated = $request->validate([
            'passengers'    => ['required', 'integer', 'min:1'],
            'contact_phone' => ['required', 'string', 'max:30'],
            'notes'         => ['nullable', 'string', 'max:500'],
        ]);

        $booked = GroupTicketBooking::where('group_ticket_id', $groupTicket->id)
            ->whereIn('status', ['pending', 'approved'])
            ->where(fn ($q) => $q->whereNull('expires_at')->orWhere('expires_at', '>', now()))
            ->sum('passengers');

        $remaining = $groupTicket->seats_available - (int) $booked;

        if ($validated['passengers'] > $remaining) {
            throw ValidationException::withMessages([
                'passengers' => "Only {$remaining} seat(s) remaining.",
            ]);
        }

        GroupTicketBooking::create([
            'group_ticket_id' => $groupTicket->id,
            'user_id'         => auth()->id(),
            'passengers'      => $validated['passengers'],
            'contact_phone'   => $validated['contact_phone'],
            'notes'           => $validated['notes'] ?? null,
            'status'          => 'pending',
            'expires_at'      => now()->addHour(),
        ]);

        return back()->with('success', 'Booking created successfully.');
    }
}
