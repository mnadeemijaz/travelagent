<?php

namespace App\Http\Controllers;

use App\Models\AgentHotel;
use App\Models\CompanyConfiguration;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UmrahCalculatorController extends Controller
{
    public function index(Request $request): Response
    {
        $agent = $request->user();
        $config = CompanyConfiguration::instance();

        // Load all hotel+room_type rows assigned to this agent, grouped by city
        $rows = AgentHotel::where('agent_id', $agent->id)
            ->with('hotel:id,name,city_name')
            ->get()
            ->filter(fn($ah) => $ah->hotel !== null)
            ->map(fn($ah) => [
                'id'        => $ah->hotel_id,
                'name'      => $ah->hotel->name,
                'city_name' => $ah->hotel->city_name,
                'room_type' => $ah->room_type,
                'price'     => (float) $ah->price,
            ]);

        // Group unique hotels by city (keeping all room_type variants)
        $agentHotels = $rows->groupBy('city_name')->map->values()->toArray();

        return Inertia::render('umrah-calculator', [
            'agentHotels' => $agentHotels,
            'rates'       => [
                'adult_rate'  => (float) $config->adult_rate,
                'child_rate'  => (float) $config->child_rate,
                'infant_rate' => (float) $config->infant_rate,
                'sr_rate'     => (float) $config->sr_rate,
            ],
        ]);
    }
}
