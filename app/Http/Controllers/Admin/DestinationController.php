<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class DestinationController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/destinations/index', [
            'destinations' => Destination::orderByDesc('id')->get()->map(fn ($d) => [
                'id'        => $d->id,
                'name'      => $d->name,
                'country'   => $d->country,
                'price'     => $d->price,
                'image_url' => $d->image_url,
                'active'    => $d->active,
            ]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/destinations/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'    => ['required', 'string', 'max:100'],
            'country' => ['nullable', 'string', 'max:100'],
            'price'   => [  'max:50'],
            'image'   => ['required', 'image', 'max:2048'],
            'active'  => ['boolean'],
        ]);

        $file      = $request->file('image');
        $extension = strtolower($file->getClientOriginalExtension() ?: 'jpg');
        $filename  = Str::random(40) . '.' . $extension;
        $savePath  = storage_path('app' . DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR . 'destinations');
        $file->move($savePath, $filename);
        $path      = 'destinations/' . $filename;

        Destination::create([
            'name'    => $validated['name'],
            'country' => $validated['country'] ?? null,
            'price'   => $validated['price'],
            'image'   => $path,
            'active'  => $validated['active'] ?? true,
        ]);

        return redirect()->route('admin.destinations.index')->with('success', 'Destination added.');
    }

    public function edit(Destination $destination): Response
    {
        return Inertia::render('admin/destinations/edit', [
            'destination' => [
                'id'        => $destination->id,
                'name'      => $destination->name,
                'country'   => $destination->country,
                'price'     => $destination->price,
                'image_url' => $destination->image_url,
                'active'    => $destination->active,
            ],
        ]);
    }

    public function update(Request $request, Destination $destination): RedirectResponse
    {
        $validated = $request->validate([
            'name'    => ['required', 'string', 'max:100'],
            'country' => ['nullable', 'string', 'max:100'],
            'price'   => [ 'max:50'],
            'image'   => ['nullable', 'image', 'max:2048'],
            'active'  => ['boolean'],
        ]);

        if ($request->hasFile('image')) {
            Storage::disk('public')->delete($destination->image);
            $file      = $request->file('image');
            $extension = strtolower($file->getClientOriginalExtension() ?: 'jpg');
            $filename  = Str::random(40) . '.' . $extension;
            $savePath  = storage_path('app' . DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR . 'destinations');
            $file->move($savePath, $filename);
            $destination->image = 'destinations/' . $filename;
        }

        $destination->name    = $validated['name'];
        $destination->country = $validated['country'] ?? null;
        $destination->price   = $validated['price'];
        $destination->active  = $validated['active'] ?? $destination->active;
        $destination->save();

        return redirect()->route('admin.destinations.index')->with('success', 'Destination updated.');
    }

    public function destroy(Destination $destination): RedirectResponse
    {
        Storage::disk('public')->delete($destination->image);
        $destination->delete();

        return redirect()->route('admin.destinations.index')->with('success', 'Destination deleted.');
    }
}
