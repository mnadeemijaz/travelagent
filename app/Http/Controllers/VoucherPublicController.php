<?php

namespace App\Http\Controllers;

use App\Models\CompanyConfiguration;
use App\Models\Sector;
use App\Models\Voucher;
use Inertia\Inertia;
use Inertia\Response;

class VoucherPublicController extends Controller
{
    public function show(string $token): Response
    {
        $voucher = Voucher::where('share_token', $token)->firstOrFail();
        $voucher->load(['agent', 'departureFlight', 'returnFlight', 'vehicle', 'trip', 'hotels.hotel', 'clients', 'ziarats']);

        $depSector1Name = $voucher->dep_sector1 ? optional(Sector::find($voucher->dep_sector1))->name : null;
        $retSector2Name = $voucher->ret_sector2 ? optional(Sector::find($voucher->ret_sector2))->name : null;
        $config         = CompanyConfiguration::instance();

        return Inertia::render('voucher/public', [
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
                'city_name'   => $h->city_name,
                'hotel_name'  => $h->hotel?->name,
                'check_in'    => $h->check_in?->format('d/m/Y'),
                'check_out'   => $h->check_out?->format('d/m/Y'),
                'city_nights' => $h->city_nights,
                'room_type'   => $h->room_type,
                'price'       => (float) $h->price,
            ]),
            'clients' => $voucher->clients->map(fn($c) => [
                'sr_name'   => $c->sr_name,
                'name'      => $c->name,
                'last_name' => $c->last_name,
                'ppno'      => $c->ppno,
                'dob'       => $c->dob?->format('d/m/Y'),
                'age_group' => $c->age_group,
                'visa_no'   => $c->visa_no,
                'visa_date' => $c->visa_date?->format('d/m/Y'),
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
                'agent_company_name'    => $voucher->agent?->company_name,
                'agent_address'         => $voucher->agent?->address,
                'agent_mobile'          => $voucher->agent?->mobile,
                'agent_logo_url'        => $voucher->agent?->logo_url,
            ],
        ]);
    }
}
