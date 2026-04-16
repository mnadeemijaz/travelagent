<?php

use App\Http\Controllers\Admin\DestinationController;
use App\Http\Controllers\Admin\ExperienceController;
use App\Http\Controllers\Admin\PackageController;
use App\Http\Controllers\UserManagementController;
use App\Models\Destination;
use App\Models\Experience;
use App\Models\Package;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'destinations' => Destination::where('active', true)->orderByDesc('id')->get()
            ->map(fn ($d) => ['id' => $d->id, 'name' => $d->name, 'country' => $d->country, 'price' => $d->price, 'image_url' => $d->image_url]),
        'packages' => Package::where('active', true)->orderByDesc('id')->get()
            ->map(fn ($p) => ['id' => $p->id, 'name' => $p->name, 'price' => $p->price, 'image_url' => $p->image_url]),
        'experiences' => Experience::where('active', true)->orderByDesc('id')->get()
            ->map(fn ($e) => ['id' => $e->id, 'name' => $e->name, 'image_url' => $e->image_url]),
    ]);
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('users', UserManagementController::class)->except(['show']);

    Route::prefix('admin')->name('admin.')->group(function () {
        Route::resource('destinations', DestinationController::class)->except(['show']);
        Route::resource('packages', PackageController::class)->except(['show']);
        Route::resource('experiences', ExperienceController::class)->except(['show']);
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
