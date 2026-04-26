<?php

namespace App\Http\Controllers;

use App\Models\GroupTicket;
use App\Models\GroupTicketBooking;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class GroupTicketPublicController extends Controller
{
    private const CATEGORIES = ['umrah', 'visit', 'hajj', 'tour', 'other'];

    public function index(Request $request): Response
    {
        $category = $request->input('category', 'umrah');

        $tickets = GroupTicket::where('isDeleted', 0)
            ->where('is_active', true)
            ->where('category', $category)
            ->withSum(
                ['bookings as booked_seats' => fn ($q) => $q->whereIn('status', ['pending', 'approved'])
                    ->where(fn ($q2) => $q2->whereNull('expires_at')->orWhere('expires_at', '>', now()))],
                'passengers'
            )
            ->orderBy('dep_date')
            ->get()
            ->map(function ($t) {
                $t->remaining_seats = max(0, $t->seats_available - (int) $t->booked_seats);
                return $t;
            })
            ->filter(fn ($t) => $t->remaining_seats > 0)   // hide fully booked
            ->values();

        return Inertia::render('group-tickets', [
            'tickets'        => $tickets,
            'categories'     => self::CATEGORIES,
            'activeCategory' => $category,
        ]);
    }

    public function book(Request $request, GroupTicket $groupTicket): RedirectResponse
    {
        $validated = $request->validate([
            'passengers'    => ['required', 'integer', 'min:1'],
            'contact_phone' => ['required', 'string', 'max:30'],
            'notes'         => ['nullable', 'string', 'max:500'],
        ]);

        // Calculate remaining seats at booking time
        $booked = GroupTicketBooking::where('group_ticket_id', $groupTicket->id)
            ->whereIn('status', ['pending', 'approved'])
            ->where(fn ($q) => $q->whereNull('expires_at')->orWhere('expires_at', '>', now()))
            ->sum('passengers');

        $remaining = $groupTicket->seats_available - (int) $booked;

        if ($validated['passengers'] > $remaining) {
            throw ValidationException::withMessages([
                'passengers' => "Only {$remaining} seat(s) remaining. You cannot book {$validated['passengers']}.",
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

        return back()->with('success', 'Booking submitted! Please complete your payment within 1 hour to confirm your seat.');
    }
}
