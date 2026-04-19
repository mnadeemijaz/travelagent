<?php

use App\Http\Controllers\Admin\AgentHotelController;
use App\Http\Controllers\Admin\GroupTicketController;
use App\Http\Controllers\GroupTicketPublicController;
use App\Http\Controllers\Admin\BankTransectionController;
use App\Http\Controllers\Admin\FlightTransectionController;
use App\Http\Controllers\Admin\TicketSaleController;
use App\Http\Controllers\Admin\BankController;
use App\Http\Controllers\Admin\ClientController;
use App\Http\Controllers\Admin\DestinationController;
use App\Http\Controllers\Admin\ExperienceController;
use App\Http\Controllers\Admin\HotelImageController;
use App\Http\Controllers\Admin\HotelOtherController;
use App\Http\Controllers\Admin\PackageController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\TransactionController;
use App\Http\Controllers\Admin\VoucherController;
use App\Http\Controllers\UserManagementController;
use App\Models\Destination;
use App\Models\Experience;
use App\Models\HotelImage;
use App\Models\Package;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ── Public group tickets ───────────────────────────────────────────────────────
Route::get('/group-tickets', [GroupTicketPublicController::class, 'index'])->name('group-tickets.index');
Route::middleware(['auth'])->post('/group-tickets/{groupTicket}/book', [GroupTicketPublicController::class, 'book'])->name('group-tickets.book');

Route::get('/', function () {
    return Inertia::render('welcome', [
        'destinations' => Destination::where('active', true)->orderByDesc('id')->get()
            ->map(fn ($d) => ['id' => $d->id, 'name' => $d->name, 'country' => $d->country, 'price' => $d->price, 'image_url' => $d->image_url]),
        'packages' => Package::where('active', true)->orderByDesc('id')->get()
            ->map(fn ($p) => ['id' => $p->id, 'name' => $p->name, 'price' => $p->price, 'image_url' => $p->image_url]),
        'experiences' => Experience::where('active', true)->orderByDesc('id')->get()
            ->map(fn ($e) => ['id' => $e->id, 'name' => $e->name, 'image_url' => $e->image_url]),
        'hotelImages' => HotelImage::where('active', true)->orderByDesc('id')->get()
            ->map(fn ($h) => ['id' => $h->id, 'name' => $h->name, 'city_name' => $h->city_name, 'price' => $h->price, 'image_url' => $h->image_url]),
    ]);
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [HotelOtherController::class, 'dashboard'])->name('dashboard');

    // ── Agent-accessible routes ───────────────────────────────────────────────
    Route::prefix('admin')->name('admin.')->group(function () {
        // Vouchers
        Route::resource('vouchers', VoucherController::class)->except(['show']);
        Route::post('vouchers/approve', [VoucherController::class, 'approve'])->name('vouchers.approve');
        Route::post('vouchers/reject',  [VoucherController::class, 'reject'])->name('vouchers.reject');
        Route::get ('vouchers/eligible-clients', [VoucherController::class, 'eligibleClients'])->name('vouchers.eligible-clients');

        // Ticket Sales
        Route::resource('ticket-sales', TicketSaleController::class)->except(['show']);

        // Clients (agents can add/edit their own clients and check passport)
        Route::resource('clients', ClientController::class)->except(['show']);
        Route::post('clients/check-passport', [ClientController::class, 'checkPassportNo'])->name('clients.check-passport');
    });

    // ── Admin-only routes (agents get 403) ────────────────────────────────────
    Route::middleware(['not.agent'])->group(function () {
        Route::resource('users', UserManagementController::class)->except(['show']);

        Route::prefix('admin')->name('admin.')->group(function () {
            // ── Website content ──────────────────────────────────────────────
            Route::resource('destinations', DestinationController::class)->except(['show']);
            Route::resource('packages', PackageController::class)->except(['show']);
            Route::resource('experiences', ExperienceController::class)->except(['show']);
            Route::resource('hotel-images', HotelImageController::class)->except(['show']);

            // ── Client visa actions (admin-only) ──────────────────────────────
            Route::post('clients/approve-visa', [ClientController::class, 'approveVisa'])->name('clients.approve-visa');
            Route::post('clients/reject-visa',  [ClientController::class, 'rejectVisa'])->name('clients.reject-visa');
            Route::post('clients/update-visa',  [ClientController::class, 'updateVisa'])->name('clients.update-visa');

            // ── Hotels ───────────────────────────────────────────────────────
            Route::get ('hotels',           [HotelOtherController::class, 'hotelList'])->name('hotels.index');
            Route::get ('hotels/create',    [HotelOtherController::class, 'addHotel'])->name('hotels.create');
            Route::post('hotels',           [HotelOtherController::class, 'storeHotel'])->name('hotels.store');
            Route::get ('hotels/{hotel}/edit',    [HotelOtherController::class, 'editHotel'])->name('hotels.edit');
            Route::put ('hotels/{hotel}',         [HotelOtherController::class, 'updateHotel'])->name('hotels.update');
            Route::post('hotels/delete',          [HotelOtherController::class, 'deleteHotel'])->name('hotels.delete');

            // ── Vehicles ─────────────────────────────────────────────────────
            Route::get ('vehicles',                  [HotelOtherController::class, 'vehicleList'])->name('vehicles.index');
            Route::get ('vehicles/create',           [HotelOtherController::class, 'addVehicle'])->name('vehicles.create');
            Route::post('vehicles',                  [HotelOtherController::class, 'storeVehicle'])->name('vehicles.store');
            Route::get ('vehicles/{vehicle}/edit',   [HotelOtherController::class, 'editVehicle'])->name('vehicles.edit');
            Route::put ('vehicles/{vehicle}',        [HotelOtherController::class, 'updateVehicle'])->name('vehicles.update');
            Route::post('vehicles/delete',           [HotelOtherController::class, 'deleteVehicle'])->name('vehicles.delete');

            // ── Trips ────────────────────────────────────────────────────────
            Route::get ('trips',               [HotelOtherController::class, 'tripList'])->name('trips.index');
            Route::get ('trips/create',        [HotelOtherController::class, 'addTrip'])->name('trips.create');
            Route::post('trips',               [HotelOtherController::class, 'storeTrip'])->name('trips.store');
            Route::get ('trips/{trip}/edit',   [HotelOtherController::class, 'editTrip'])->name('trips.edit');
            Route::put ('trips/{trip}',        [HotelOtherController::class, 'updateTrip'])->name('trips.update');
            Route::post('trips/delete',        [HotelOtherController::class, 'deleteTrip'])->name('trips.delete');

            // ── Ziarat ───────────────────────────────────────────────────────
            Route::get ('ziarat',                  [HotelOtherController::class, 'ziaratList'])->name('ziarat.index');
            Route::get ('ziarat/create',           [HotelOtherController::class, 'addZiarat'])->name('ziarat.create');
            Route::post('ziarat',                  [HotelOtherController::class, 'storeZiarat'])->name('ziarat.store');
            Route::get ('ziarat/{ziarat}/edit',    [HotelOtherController::class, 'editZiarat'])->name('ziarat.edit');
            Route::put ('ziarat/{ziarat}',         [HotelOtherController::class, 'updateZiarat'])->name('ziarat.update');
            Route::post('ziarat/delete',           [HotelOtherController::class, 'deleteZiarat'])->name('ziarat.delete');

            // ── Flights ──────────────────────────────────────────────────────
            Route::get ('flights',                   [HotelOtherController::class, 'flightList'])->name('flights.index');
            Route::get ('flights/create',            [HotelOtherController::class, 'addFlight'])->name('flights.create');
            Route::post('flights',                   [HotelOtherController::class, 'storeFlight'])->name('flights.store');
            Route::get ('flights/{flight}/edit',     [HotelOtherController::class, 'editFlight'])->name('flights.edit');
            Route::put ('flights/{flight}',          [HotelOtherController::class, 'updateFlight'])->name('flights.update');
            Route::post('flights/delete',            [HotelOtherController::class, 'deleteFlight'])->name('flights.delete');

            // ── Tour Packages (operational) ───────────────────────────────────
            Route::get ('tour-packages',                        [HotelOtherController::class, 'tourPackageList'])->name('tour-packages.index');
            Route::get ('tour-packages/create',                 [HotelOtherController::class, 'addTourPackage'])->name('tour-packages.create');
            Route::post('tour-packages',                        [HotelOtherController::class, 'storeTourPackage'])->name('tour-packages.store');
            Route::get ('tour-packages/{tourPackage}/edit',     [HotelOtherController::class, 'editTourPackage'])->name('tour-packages.edit');
            Route::put ('tour-packages/{tourPackage}',          [HotelOtherController::class, 'updateTourPackage'])->name('tour-packages.update');
            Route::post('tour-packages/delete',                 [HotelOtherController::class, 'deleteTourPackage'])->name('tour-packages.delete');

            // ── Sectors ──────────────────────────────────────────────────────
            Route::get ('sectors',                  [HotelOtherController::class, 'sectorList'])->name('sectors.index');
            Route::get ('sectors/create',           [HotelOtherController::class, 'addSector'])->name('sectors.create');
            Route::post('sectors',                  [HotelOtherController::class, 'storeSector'])->name('sectors.store');
            Route::get ('sectors/{sector}/edit',    [HotelOtherController::class, 'editSector'])->name('sectors.edit');
            Route::put ('sectors/{sector}',         [HotelOtherController::class, 'updateSector'])->name('sectors.update');
            Route::post('sectors/delete',           [HotelOtherController::class, 'deleteSector'])->name('sectors.delete');

            // ── Visa Companies ────────────────────────────────────────────────
            Route::get ('visa-companies',                       [HotelOtherController::class, 'visaCompanyList'])->name('visa-companies.index');
            Route::get ('visa-companies/create',                [HotelOtherController::class, 'addVisaCompany'])->name('visa-companies.create');
            Route::post('visa-companies',                       [HotelOtherController::class, 'storeVisaCompany'])->name('visa-companies.store');
            Route::get ('visa-companies/{visaCompany}/edit',    [HotelOtherController::class, 'editVisaCompany'])->name('visa-companies.edit');
            Route::put ('visa-companies/{visaCompany}',         [HotelOtherController::class, 'updateVisaCompany'])->name('visa-companies.update');
            Route::post('visa-companies/delete',                [HotelOtherController::class, 'deleteVisaCompany'])->name('visa-companies.delete');

            // ── Flight Transactions ───────────────────────────────────────────────
            Route::resource('flight-transections', FlightTransectionController::class)->except(['show']);

            // ── Banks ─────────────────────────────────────────────────────────────
            Route::resource('banks', BankController::class)->except(['show']);

            // ── Bank Transactions ──────────────────────────────────────────────────
            Route::resource('bank-transections', BankTransectionController::class)->except(['show']);

            // ── Group Tickets ──────────────────────────────────────────────────────
            Route::resource('group-tickets', GroupTicketController::class)->except(['show']);
            Route::get ('group-ticket-bookings',                [GroupTicketController::class, 'bookings'])->name('group-ticket-bookings.index');
            Route::post('group-ticket-bookings/{booking}/approve', [GroupTicketController::class, 'approveBooking'])->name('group-ticket-bookings.approve');
            Route::post('group-ticket-bookings/{booking}/reject',  [GroupTicketController::class, 'rejectBooking'])->name('group-ticket-bookings.reject');

            // ── Agent Hotels ──────────────────────────────────────────────────────
            Route::get ('agent-hotels',                [AgentHotelController::class, 'index'])->name('agent-hotels.index');
            Route::get ('agent-hotels/{agentId}/edit', [AgentHotelController::class, 'edit'])->name('agent-hotels.edit');
            Route::put ('agent-hotels/{agentId}',      [AgentHotelController::class, 'update'])->name('agent-hotels.update');

            // ── Reports ───────────────────────────────────────────────────────
            Route::get('reports/pilgrim',       [ReportController::class, 'pilgrimReport'])->name('reports.pilgrim');
            Route::get('reports/arrival',       [ReportController::class, 'arrivalReport'])->name('reports.arrival');
            Route::get('reports/departure',     [ReportController::class, 'departureReport'])->name('reports.departure');
            Route::get('reports/visa',          [ReportController::class, 'visaReport'])->name('reports.visa');
            Route::get('reports/pilgrim-wise',   [ReportController::class, 'pilgrimWiseReport'])->name('reports.pilgrim-wise');
            Route::get('reports/agent-balance',            [ReportController::class, 'agentBalanceReport'])->name('reports.agent-balance');
            Route::get('reports/agent-balance/{agentId}',  [ReportController::class, 'agentDetail'])->name('reports.agent-detail');

            // ── Transactions ──────────────────────────────────────────────────
            Route::get('transactions/balance', [TransactionController::class, 'balance'])->name('transactions.balance');
            Route::get('transactions/agent/{agentId}', [TransactionController::class, 'index'])->name('transactions.by-agent');
            Route::resource('transactions', TransactionController::class)->except(['show']);
        });
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
