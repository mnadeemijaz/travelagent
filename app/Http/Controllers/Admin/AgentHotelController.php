<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AgentHotel;
use App\Models\Hotel;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AgentHotelController extends Controller
{
    const ROOM_TYPES = ['sharing', 'single_bed', 'double_bed', 'triple_bed', 'quad_bed', 'five_bed', 'six_bed'];

    // ── Index: list all agents with their assigned hotels + room types ──────────

    public function index(): Response
    {
        $agents = User::whereHas('roles', fn($q) => $q->where('name', 'agent'))
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn($agent) => [
                'id'     => $agent->id,
                'name'   => $agent->name,
                'hotels' => AgentHotel::where('agent_id', $agent->id)
                    ->with('hotel:id,name,city_name')
                    ->get()
                    ->filter(fn($ah) => $ah->hotel !== null)
                    ->sortBy(fn($ah) => [$ah->hotel->city_name, $ah->hotel->name, $ah->room_type])
                    ->values()
                    ->map(fn($ah) => [
                        'hotel_id'   => $ah->hotel_id,
                        'hotel_name' => $ah->hotel->name,
                        'city_name'  => $ah->hotel->city_name,
                        'room_type'  => $ah->room_type,
                        'price'      => (float) $ah->price,
                    ]),
            ]);

        return Inertia::render('admin/agent-hotels/index', [
            'agents' => $agents,
        ]);
    }

    // ── Edit: form to assign hotels + room-type prices for one agent ───────────

    public function edit(int $agentId): Response
    {
        $agent = User::whereHas('roles', fn($q) => $q->where('name', 'agent'))
            ->findOrFail($agentId, ['id', 'name']);

        $hotels = Hotel::where('isDeleted', 0)
            ->orderBy('city_name')
            ->orderBy('name')
            ->get(['id', 'name', 'city_name']);

        // assigned: flat list { hotel_id, room_type, price }
        $assigned = AgentHotel::where('agent_id', $agentId)
            ->get()
            ->map(fn($ah) => [
                'hotel_id'  => $ah->hotel_id,
                'room_type' => $ah->room_type,
                'price'     => (float) $ah->price,
            ]);

        return Inertia::render('admin/agent-hotels/edit', [
            'agent'      => ['id' => $agent->id, 'name' => $agent->name],
            'hotels'     => $hotels,
            'assigned'   => $assigned,
            'roomTypes'  => self::ROOM_TYPES,
        ]);
    }

    // ── Update: sync hotel+room_type+price rows for one agent ─────────────────

    public function update(Request $request, int $agentId): RedirectResponse
    {
        User::whereHas('roles', fn($q) => $q->where('name', 'agent'))->findOrFail($agentId);

        $request->validate([
            'hotels'                => ['nullable', 'array'],
            'hotels.*.hotel_id'     => ['required', 'integer', 'exists:hotels,id'],
            'hotels.*.room_type'    => ['required', 'string', 'in:' . implode(',', self::ROOM_TYPES)],
            'hotels.*.price'        => ['required', 'numeric', 'min:0'],
        ]);

        $rows = collect($request->input('hotels', []));

        // Delete removed (hotel_id + room_type) combos
        AgentHotel::where('agent_id', $agentId)
            ->get()
            ->each(function ($ah) use ($rows) {
                $still = $rows->first(fn($r) =>
                    $r['hotel_id'] == $ah->hotel_id && $r['room_type'] === $ah->room_type
                );
                if (!$still) $ah->delete();
            });

        // Upsert each row
        foreach ($rows as $row) {
            AgentHotel::updateOrCreate(
                ['agent_id' => $agentId, 'hotel_id' => $row['hotel_id'], 'room_type' => $row['room_type']],
                ['price' => $row['price']]
            );
        }

        return redirect()->route('admin.agent-hotels.index')->with('success', 'Hotels updated for agent.');
    }
}
