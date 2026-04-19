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
    // ── Index: list all agents with their assigned hotels ─────────────────────

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
                    ->map(fn($ah) => [
                        'hotel_id'   => $ah->hotel_id,
                        'hotel_name' => $ah->hotel->name ?? '—',
                        'city_name'  => $ah->hotel->city_name ?? '—',
                        'price'      => $ah->price,
                    ]),
            ]);

        return Inertia::render('admin/agent-hotels/index', [
            'agents' => $agents,
        ]);
    }

    // ── Edit: form to assign hotels + prices for one agent ────────────────────

    public function edit(int $agentId): Response
    {
        $agent = User::whereHas('roles', fn($q) => $q->where('name', 'agent'))
            ->findOrFail($agentId, ['id', 'name']);

        $hotels = Hotel::where('isDeleted', 0)->orderBy('name')->get(['id', 'name', 'city_name']);

        $assigned = AgentHotel::where('agent_id', $agentId)
            ->get()
            ->keyBy('hotel_id')
            ->map(fn($ah) => ['hotel_id' => $ah->hotel_id, 'price' => $ah->price]);

        return Inertia::render('admin/agent-hotels/edit', [
            'agent'    => ['id' => $agent->id, 'name' => $agent->name],
            'hotels'   => $hotels,
            'assigned' => $assigned->values(),
        ]);
    }

    // ── Update: sync hotels + prices for one agent ────────────────────────────

    public function update(Request $request, int $agentId): RedirectResponse
    {
        // Ensure agent exists
        User::whereHas('roles', fn($q) => $q->where('name', 'agent'))->findOrFail($agentId);

        $request->validate([
            'hotels'           => ['nullable', 'array'],
            'hotels.*.hotel_id' => ['required', 'integer', 'exists:hotels,id'],
            'hotels.*.price'    => ['required', 'numeric', 'min:0'],
        ]);

        $rows = collect($request->input('hotels', []));

        // Delete removed assignments
        AgentHotel::where('agent_id', $agentId)
            ->whereNotIn('hotel_id', $rows->pluck('hotel_id')->toArray())
            ->delete();

        // Upsert each row
        foreach ($rows as $row) {
            AgentHotel::updateOrCreate(
                ['agent_id' => $agentId, 'hotel_id' => $row['hotel_id']],
                ['price' => $row['price']]
            );
        }

        return redirect()->route('admin.agent-hotels.index')->with('success', 'Hotels updated for agent.');
    }
}
