<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Flight;
use App\Models\Hotel;
use App\Models\Sector;
use App\Models\Voucher;
use App\Models\TourPackage;
use App\Models\Trip;
use App\Models\Vehicle;
use App\Models\VisaCompany;
use App\Models\Ziarat;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HotelOtherController extends Controller
{
    // ── Dashboard ──────────────────────────────────────────────────────────────

    public function dashboard(): Response
    {
        return Inertia::render('dashboard', [
            'totalClients'        => Client::where('isDeleted', 0)->count(),
            'visaNotApproved'     => Client::where('isDeleted', 0)->where('visa_approve', 'no')->count(),
            'totalVouchers'       => Voucher::where('isDeleted', 0)->count(),
            'approvedVouchers'    => Voucher::where('isDeleted', 0)->where('approved', 1)->count(),
            'notApprovedVouchers' => Voucher::where('isDeleted', 0)->where('approved', 0)->count(),
        ]);
    }

    // ══════════════════════════════════════════════════════════════════════════
    // HOTELS
    // ══════════════════════════════════════════════════════════════════════════

    public function hotelList(Request $request): Response
    {
        $query = Hotel::where('isDeleted', 0);

        if ($search = $request->input('searchText')) {
            $query->where('name', 'like', "%{$search}%");
        }

        if ($agentId = $request->input('agent_id')) {
            $query->where('agent_id', $agentId);
        }

        return Inertia::render('admin/hotels/index', [
            'hotels'  => $query->orderByDesc('id')->paginate(20)->withQueryString(),
            'filters' => $request->only(['searchText', 'agent_id']),
        ]);
    }

    public function addHotel(): Response
    {
        return Inertia::render('admin/hotels/create', [
            'packages' => TourPackage::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function storeHotel(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'      => ['required', 'string', 'max:128'],
            'city_name' => ['required', 'string', 'max:100'],
            'room_type' => ['required', 'string', 'max:50'],
            'pkg_type'  => ['nullable', 'string', 'max:50'],
        ]);

        Hotel::create($validated);

        return redirect()->route('admin.hotels.index')->with('success', 'Hotel added successfully.');
    }

    public function editHotel(Hotel $hotel): Response
    {
        return Inertia::render('admin/hotels/edit', [
            'hotel'    => $hotel,
            'packages' => TourPackage::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function updateHotel(Request $request, Hotel $hotel): RedirectResponse
    {
        $validated = $request->validate([
            'name'      => ['required', 'string', 'max:128'],
            'city_name' => ['required', 'string', 'max:100'],
            'room_type' => ['required', 'string', 'max:50'],
            'pkg_type'  => ['nullable', 'string', 'max:50'],
        ]);

        $hotel->update($validated);

        return redirect()->route('admin.hotels.index')->with('success', 'Hotel updated successfully.');
    }

    public function deleteHotel(Request $request): RedirectResponse
    {
        Hotel::where('id', $request->input('id'))->update(['isDeleted' => 1]);

        return redirect()->route('admin.hotels.index')->with('success', 'Hotel deleted.');
    }

    // ══════════════════════════════════════════════════════════════════════════
    // VEHICLES
    // ══════════════════════════════════════════════════════════════════════════

    public function vehicleList(Request $request): Response
    {
        $query = Vehicle::where('isDeleted', 0);

        if ($search = $request->input('searchText')) {
            $query->where('name', 'like', "%{$search}%");
        }

        return Inertia::render('admin/vehicles/index', [
            'vehicles' => $query->orderByDesc('id')->paginate(20)->withQueryString(),
            'filters'  => $request->only(['searchText']),
        ]);
    }

    public function addVehicle(): Response
    {
        return Inertia::render('admin/vehicles/create');
    }

    public function storeVehicle(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'    => ['required', 'string', 'max:128'],
            'sharing' => ['required', 'integer', 'min:1'],
        ]);

        Vehicle::create($validated);

        return redirect()->route('admin.vehicles.index')->with('success', 'Vehicle added successfully.');
    }

    public function editVehicle(Vehicle $vehicle): Response
    {
        return Inertia::render('admin/vehicles/edit', ['vehicle' => $vehicle]);
    }

    public function updateVehicle(Request $request, Vehicle $vehicle): RedirectResponse
    {
        $validated = $request->validate([
            'name'    => ['required', 'string', 'max:128'],
            'sharing' => ['required', 'integer', 'min:1'],
        ]);

        $vehicle->update($validated);

        return redirect()->route('admin.vehicles.index')->with('success', 'Vehicle updated successfully.');
    }

    public function deleteVehicle(Request $request): RedirectResponse
    {
        Vehicle::where('id', $request->input('id'))->update(['isDeleted' => 1]);

        return redirect()->route('admin.vehicles.index')->with('success', 'Vehicle deleted.');
    }

    // ══════════════════════════════════════════════════════════════════════════
    // TRIPS
    // ══════════════════════════════════════════════════════════════════════════

    public function tripList(Request $request): Response
    {
        $query = Trip::with('vehicle')->where('isDeleted', 0);

        if ($search = $request->input('searchText')) {
            $query->where('name', 'like', "%{$search}%");
        }

        return Inertia::render('admin/trips/index', [
            'trips'   => $query->orderByDesc('id')->paginate(20)->withQueryString(),
            'filters' => $request->only(['searchText']),
        ]);
    }

    public function addTrip(): Response
    {
        return Inertia::render('admin/trips/create', [
            'vehicles' => Vehicle::where('isDeleted', 0)->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function storeTrip(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'       => ['nullable', 'string', 'max:128'],
            'vehicle_id' => ['required', 'integer'],
            'price'      => ['required', 'numeric', 'min:0'],
        ]);

        Trip::create($validated);

        return redirect()->route('admin.trips.index')->with('success', 'Trip added successfully.');
    }

    public function editTrip(Trip $trip): Response
    {
        return Inertia::render('admin/trips/edit', [
            'trip'     => $trip,
            'vehicles' => Vehicle::where('isDeleted', 0)->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function updateTrip(Request $request, Trip $trip): RedirectResponse
    {
        $validated = $request->validate([
            'name'       => ['nullable', 'string', 'max:128'],
            'vehicle_id' => ['required', 'integer'],
            'price'      => ['required', 'numeric', 'min:0'],
        ]);

        $trip->update($validated);

        return redirect()->route('admin.trips.index')->with('success', 'Trip updated successfully.');
    }

    public function deleteTrip(Request $request): RedirectResponse
    {
        Trip::where('id', $request->input('id'))->update(['isDeleted' => 1]);

        return redirect()->route('admin.trips.index')->with('success', 'Trip deleted.');
    }

    // ══════════════════════════════════════════════════════════════════════════
    // ZIARAT
    // ══════════════════════════════════════════════════════════════════════════

    public function ziaratList(Request $request): Response
    {
        $query = Ziarat::where('isDeleted', 0);

        if ($search = $request->input('searchText')) {
            $query->where('name', 'like', "%{$search}%");
        }

        return Inertia::render('admin/ziarat/index', [
            'ziarats' => $query->orderByDesc('id')->paginate(20)->withQueryString(),
            'filters' => $request->only(['searchText']),
        ]);
    }

    public function addZiarat(): Response
    {
        return Inertia::render('admin/ziarat/create');
    }

    public function storeZiarat(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'   => ['required', 'string', 'max:128'],
            'amount' => ['required', 'numeric', 'min:0'],
        ]);

        Ziarat::create($validated);

        return redirect()->route('admin.ziarat.index')->with('success', 'Ziarat added successfully.');
    }

    public function editZiarat(Ziarat $ziarat): Response
    {
        return Inertia::render('admin/ziarat/edit', ['ziarat' => $ziarat]);
    }

    public function updateZiarat(Request $request, Ziarat $ziarat): RedirectResponse
    {
        $validated = $request->validate([
            'name'   => ['required', 'string', 'max:128'],
            'amount' => ['required', 'numeric', 'min:0'],
        ]);

        $ziarat->update($validated);

        return redirect()->route('admin.ziarat.index')->with('success', 'Ziarat updated successfully.');
    }

    public function deleteZiarat(Request $request): RedirectResponse
    {
        Ziarat::where('id', $request->input('id'))->update(['isDeleted' => 1]);

        return redirect()->route('admin.ziarat.index')->with('success', 'Ziarat deleted.');
    }

    // ══════════════════════════════════════════════════════════════════════════
    // FLIGHTS
    // ══════════════════════════════════════════════════════════════════════════

    public function flightList(Request $request): Response
    {
        $query = Flight::where('isDeleted', 0);

        if ($search = $request->input('searchText')) {
            $query->where('name', 'like', "%{$search}%");
        }

        return Inertia::render('admin/flights/index', [
            'flights' => $query->orderByDesc('id')->paginate(20)->withQueryString(),
            'filters' => $request->only(['searchText']),
        ]);
    }

    public function addFlight(): Response
    {
        return Inertia::render('admin/flights/create');
    }

    public function storeFlight(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:128'],
            'bsp'  => ['nullable', 'string', 'max:50'],
        ]);

        Flight::create($validated);

        return redirect()->route('admin.flights.index')->with('success', 'Flight added successfully.');
    }

    public function editFlight(Flight $flight): Response
    {
        return Inertia::render('admin/flights/edit', ['flight' => $flight]);
    }

    public function updateFlight(Request $request, Flight $flight): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:128'],
            'bsp'  => ['nullable', 'string', 'max:50'],
        ]);

        $flight->update($validated);

        return redirect()->route('admin.flights.index')->with('success', 'Flight updated successfully.');
    }

    public function deleteFlight(Request $request): RedirectResponse
    {
        Flight::where('id', $request->input('id'))->update(['isDeleted' => 1]);

        return redirect()->route('admin.flights.index')->with('success', 'Flight deleted.');
    }

    // ══════════════════════════════════════════════════════════════════════════
    // TOUR PACKAGES (packeg in original)
    // ══════════════════════════════════════════════════════════════════════════

    public function tourPackageList(Request $request): Response
    {
        $query = TourPackage::where('isDeleted', 0);

        if ($search = $request->input('searchText')) {
            $query->where('name', 'like', "%{$search}%");
        }

        return Inertia::render('admin/tour-packages/index', [
            'tourPackages' => $query->orderByDesc('id')->paginate(20)->withQueryString(),
            'filters'      => $request->only(['searchText']),
        ]);
    }

    public function addTourPackage(): Response
    {
        return Inertia::render('admin/tour-packages/create');
    }

    public function storeTourPackage(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:128'],
        ]);

        TourPackage::create($validated);

        return redirect()->route('admin.tour-packages.index')->with('success', 'Tour package added successfully.');
    }

    public function editTourPackage(TourPackage $tourPackage): Response
    {
        return Inertia::render('admin/tour-packages/edit', ['tourPackage' => $tourPackage]);
    }

    public function updateTourPackage(Request $request, TourPackage $tourPackage): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:128'],
        ]);

        $tourPackage->update($validated);

        return redirect()->route('admin.tour-packages.index')->with('success', 'Tour package updated successfully.');
    }

    public function deleteTourPackage(Request $request): RedirectResponse
    {
        TourPackage::where('id', $request->input('id'))->update(['isDeleted' => 1]);

        return redirect()->route('admin.tour-packages.index')->with('success', 'Tour package deleted.');
    }

    // ══════════════════════════════════════════════════════════════════════════
    // SECTORS
    // ══════════════════════════════════════════════════════════════════════════

    public function sectorList(Request $request): Response
    {
        $query = Sector::where('isDeleted', 0);

        if ($search = $request->input('searchText')) {
            $query->where('name', 'like', "%{$search}%");
        }

        return Inertia::render('admin/sectors/index', [
            'sectors' => $query->orderByDesc('id')->paginate(20)->withQueryString(),
            'filters' => $request->only(['searchText']),
        ]);
    }

    public function addSector(): Response
    {
        return Inertia::render('admin/sectors/create');
    }

    public function storeSector(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:128'],
        ]);

        Sector::create($validated);

        return redirect()->route('admin.sectors.index')->with('success', 'Sector added successfully.');
    }

    public function editSector(Sector $sector): Response
    {
        return Inertia::render('admin/sectors/edit', ['sector' => $sector]);
    }

    public function updateSector(Request $request, Sector $sector): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:128'],
        ]);

        $sector->update($validated);

        return redirect()->route('admin.sectors.index')->with('success', 'Sector updated successfully.');
    }

    public function deleteSector(Request $request): RedirectResponse
    {
        Sector::where('id', $request->input('id'))->update(['isDeleted' => 1]);

        return redirect()->route('admin.sectors.index')->with('success', 'Sector deleted.');
    }

    // ══════════════════════════════════════════════════════════════════════════
    // VISA COMPANIES
    // ══════════════════════════════════════════════════════════════════════════

    public function visaCompanyList(Request $request): Response
    {
        $query = VisaCompany::where('isDeleted', 0);

        if ($search = $request->input('searchText')) {
            $query->where('name', 'like', "%{$search}%");
        }

        return Inertia::render('admin/visa-companies/index', [
            'visaCompanies' => $query->orderByDesc('id')->paginate(20)->withQueryString(),
            'filters'       => $request->only(['searchText']),
        ]);
    }

    public function addVisaCompany(): Response
    {
        return Inertia::render('admin/visa-companies/create');
    }

    public function storeVisaCompany(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:128'],
        ]);

        VisaCompany::create($validated);

        return redirect()->route('admin.visa-companies.index')->with('success', 'Visa company added successfully.');
    }

    public function editVisaCompany(VisaCompany $visaCompany): Response
    {
        return Inertia::render('admin/visa-companies/edit', ['visaCompany' => $visaCompany]);
    }

    public function updateVisaCompany(Request $request, VisaCompany $visaCompany): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:128'],
        ]);

        $visaCompany->update($validated);

        return redirect()->route('admin.visa-companies.index')->with('success', 'Visa company updated successfully.');
    }

    public function deleteVisaCompany(Request $request): RedirectResponse
    {
        VisaCompany::where('id', $request->input('id'))->update(['isDeleted' => 1]);

        return redirect()->route('admin.visa-companies.index')->with('success', 'Visa company deleted.');
    }
}
