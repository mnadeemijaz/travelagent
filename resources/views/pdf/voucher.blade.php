<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Voucher #{{ $voucher['id'] }}</title>
<style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: DejaVu Sans, sans-serif; font-size: 11px; color: #111; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 2px; }
    th { background: #4b5563; color: #fff; padding: 4px 6px; text-align: left; font-size: 10px; }
    td { padding: 3px 6px; border: 1px solid #9ca3af; font-size: 10px; vertical-align: top; }
    .section-heading { background: #374151; color: #fff; padding: 4px 8px; font-size: 10px; font-weight: bold; margin-top: 8px; margin-bottom: 0; }
    .header-table td { border: none; }
    .meta-bar { background: #e5e7eb; padding: 4px 8px; font-size: 11px; font-weight: bold; display: flex; justify-content: space-between; }
    .not-approved-watermark {
        position: fixed; top: 35%; left: 10%;
        font-size: 72px; font-weight: 900; color: rgba(220,38,38,0.15);
        transform: rotate(-30deg); white-space: nowrap; z-index: 0; text-transform: uppercase;
    }
    .logo { max-height: 60px; }
    .bottom-img { width: 100%; max-height: 100px; object-fit: contain; margin-top: 8px; }
    .remarks-cell { border: 1px solid #9ca3af; padding: 3px 6px; font-size: 10px; }
</style>
</head>
<body>

@if(!$voucher['approved'])
<div class="not-approved-watermark">Not Approved</div>
@endif

{{-- Header --}}
<table class="header-table" style="margin-bottom:6px">
    <tr>
        <td style="width:20%">
            @if(file_exists($logoPath))
            <img src="{{ $logoPath }}" alt="Logo" class="logo">
            @endif
        </td>
        <td style="text-align:center">
            <div style="font-size:15px;font-weight:bold">{{ $company['name'] }}</div>
            <div style="font-size:10px;color:#555">{{ $company['address'] }}</div>
            <div style="font-size:10px;color:#555">{{ $company['phone'] }} | {{ $company['email'] }}</div>
        </td>
        <td style="width:20%;text-align:right;vertical-align:top">
            <img src="{{ $qrCodeBase64 }}" alt="QR" style="width:72px;height:72px;display:block;margin-left:auto">
            <div style="font-size:9px;color:#888;text-align:right;margin-top:2px">Scan to verify</div>
            <div style="font-size:10px;color:#555;text-align:right;margin-top:2px">Agent: {{ $voucher['agent_name'] }}</div>
        </td>
    </tr>
</table>

@if(!$voucher['approved'])
<p style="text-align:center;color:#dc2626;font-weight:bold;font-size:12px;margin-bottom:4px">Voucher Not Approved</p>
@endif

{{-- Meta bar --}}
<table style="margin-bottom:2px">
    <tr>
        <td style="background:#e5e7eb;font-weight:bold;font-size:11px;border:none">Voucher No: {{ $voucher['id'] }}</td>
        <td style="background:#e5e7eb;font-weight:bold;font-size:11px;border:none;text-align:right">Date Created: {{ $voucher['date'] }}</td>
    </tr>
    <tr>
        <td style="border:none;font-size:10px;color:#555">Group Head Phone: {{ $voucher['gp_hd_no'] ?? '—' }}</td>
        <td style="border:none;font-size:10px;color:#555;text-align:right">Party: {{ $voucher['agent_name'] }}</td>
    </tr>
</table>

{{-- General Info --}}
<div class="section-heading">General Information About Service</div>
<table>
    <tr>
        <th>Adults</th><th>Child</th><th>Infant</th>
        <th>Arrival Date</th><th>Dep. Date</th><th>Nights</th>
    </tr>
    <tr>
        <td>{{ $voucher['t_adult'] }}</td>
        <td>{{ $voucher['t_child'] }}</td>
        <td>{{ $voucher['t_infant'] }}</td>
        <td>{{ $voucher['arv_date'] ?? '—' }}</td>
        <td>{{ $voucher['ret_date'] ?? '—' }}</td>
        <td>{{ $voucher['total_nights'] ?? '—' }}</td>
    </tr>
</table>

{{-- KSA Arrival --}}
<div class="section-heading">Departure Information</div>
<table>
    <tr>
        <th>Sector</th><th>Flight No</th><th>Dep Date</th>
        <th>Dep Time</th><th>Arrival Date</th><th>Arrival Time</th><th>PNR</th>
    </tr>
    <tr>
        <td>{{ collect([$voucher['dep_sector1'], $voucher['dep_sector2']])->filter()->implode(' - ') ?: '—' }}</td>
        <td>{{ collect([$voucher['dep_flight_name'], $voucher['dep_flight_no']])->filter()->implode(' - ') ?: '—' }}</td>
        <td>{{ $voucher['dep_date'] ?? '—' }}</td>
        <td>{{ $voucher['dep_time'] ?? '—' }}</td>
        <td>{{ $voucher['arv_date'] ?? '—' }}</td>
        <td>{{ $voucher['arv_time'] ?? '—' }}</td>
        <td>{{ $voucher['dep_pnr_no'] ?? '—' }}</td>
    </tr>
</table>

{{-- Return --}}
<div class="section-heading">Return Information</div>
<table>
    <tr>
        <th>Sector</th><th>Flight No</th><th>Dep Date</th><th>Dep Time</th><th>PNR</th>
    </tr>
    <tr>
        <td>{{ collect([$voucher['ret_sector1'], $voucher['ret_sector2']])->filter()->implode(' - ') ?: '—' }}</td>
        <td>{{ collect([$voucher['ret_flight_name'], $voucher['ret_flight_no']])->filter()->implode(' - ') ?: '—' }}</td>
        <td>{{ $voucher['ret_date'] ?? '—' }}</td>
        <td>{{ $voucher['ret_time'] ?? '—' }}</td>
        <td>{{ $voucher['ret_pnr_no'] ?? '—' }}</td>
    </tr>
</table>

{{-- Accommodation --}}
<div class="section-heading">Accommodation Detail</div>
<table>
    <tr>
        <th>City</th><th>Hotel</th><th>Check In</th><th>Check Out</th><th>Nights</th><th>Room Type</th>
    </tr>
    @forelse($hotels as $h)
    <tr>
        <td>{{ $h['city_name'] }}</td>
        <td>{{ $h['hotel_name'] ?? '—' }}</td>
        <td>{{ $h['check_in'] ?? '—' }}</td>
        <td>{{ $h['check_out'] ?? '—' }}</td>
        <td>{{ $h['city_nights'] ?? '—' }}</td>
        <td>{{ $h['room_type'] ?? '—' }}</td>
    </tr>
    @empty
    <tr><td colspan="6" style="text-align:center">—</td></tr>
    @endforelse
</table>

{{-- Transportation --}}
<div class="section-heading">Transportational Detail</div>
<table>
    <tr><th>Transport Trip</th><th>Transport By</th></tr>
    <tr>
        <td>{{ $voucher['trip_name'] ?? '—' }}</td>
        <td>{{ $voucher['vehicle_name'] ?? '—' }}</td>
    </tr>
</table>

{{-- Pilgrims --}}
<div class="section-heading">Mutamer's (Pilgrims) Detail</div>
<table>
    <tr>
        <th>Sr#</th><th>Pilgrim Name</th><th>Ziarat</th>
        <th>Passport No</th><th>DOB</th><th>Age Group</th><th>Visa No</th><th>Issue Date</th>
    </tr>
    @foreach($clients as $i => $c)
    <tr>
        <td>{{ $i + 1 }}</td>
        <td>{{ trim(($c['sr_name'] ?? '') . ' ' . $c['name'] . ' ' . ($c['last_name'] ?? '')) }}</td>
        <td>{{ collect($ziarats)->pluck('name')->implode(', ') ?: '—' }}</td>
        <td>{{ $c['ppno'] ?? '—' }}</td>
        <td>{{ $c['dob'] ?? '—' }}</td>
        <td>{{ ucfirst($c['age_group'] ?? '—') }}</td>
        <td>{{ $c['visa_no'] ?? '—' }}</td>
        <td>{{ $c['visa_date'] ?? '—' }}</td>
    </tr>
    @endforeach
</table>

{{-- Remarks --}}
<table style="margin-top:4px">
    <tr>
        <td><strong>Remarks:</strong> {{ $voucher['remarks'] ?? '—' }}</td>
    </tr>
</table>

{{-- Bottom image --}}
@if(file_exists($instructionsPath))
<img src="{{ $instructionsPath }}" alt="AL Abrar" class="bottom-img">
@endif

{{-- Helper Contacts --}}
@if($voucher['contact'] === 'only_transport')
    @if($company['contact_name'] || $company['contact_phone'])
    <div class="section-heading" style="margin-top:8px">Helper Contacts</div>
    <table style="margin-top:2px">
        <tr>
            <td>
                @if($company['contact_name'])<span>{{ $company['contact_name'] }}: </span>@endif
                <strong>{{ $company['contact_phone'] }}</strong>
            </td>
        </tr>
    </table>
    @endif
@else
    @if($company['makkah_contact1_name'] || $company['makkah_contact2_name'] || $company['madina_contact1_name'] || $company['madina_contact2_name'])
    <div class="section-heading" style="margin-top:8px">Helper Contacts</div>
    <table style="margin-top:2px">
        <tr>
            <th style="width:50%">Makkah</th>
            <th style="width:50%">Madina</th>
        </tr>
        <tr>
            <td>
                @if($company['makkah_contact1_name'])
                <div>{{ $company['makkah_contact1_name'] }}: <strong>{{ $company['makkah_contact1_phone'] }}</strong></div>
                @endif
                @if($company['makkah_contact2_name'])
                <div>{{ $company['makkah_contact2_name'] }}: <strong>{{ $company['makkah_contact2_phone'] }}</strong></div>
                @endif
            </td>
            <td>
                @if($company['madina_contact1_name'])
                <div>{{ $company['madina_contact1_name'] }}: <strong>{{ $company['madina_contact1_phone'] }}</strong></div>
                @endif
                @if($company['madina_contact2_name'])
                <div>{{ $company['madina_contact2_name'] }}: <strong>{{ $company['madina_contact2_phone'] }}</strong></div>
                @endif
            </td>
        </tr>
    </table>
    @endif
@endif

</body>
</html>
