<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Package;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PackageController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/packages/index', [
            'packages' => Package::orderByDesc('id')->get()->map(fn ($p) => [
                'id'        => $p->id,
                'name'      => $p->name,
                'price'     => $p->price,
                'image_url' => $p->image_url,
                'active'    => $p->active,
            ]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/packages/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'   => ['required', 'string', 'max:150'],
            'price'  => ['required', 'string', 'max:50'],
            'image'  => ['required', 'image', 'max:2048'],
            'active' => ['boolean'],
        ]);

        $file      = $request->file('image');
        $extension = strtolower($file->getClientOriginalExtension() ?: 'jpg');
        $filename  = Str::random(40) . '.' . $extension;
        $savePath  = storage_path('app' . DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR . 'packages');
        $file->move($savePath, $filename);
        $path      = 'packages/' . $filename;

        Package::create([
            'name'   => $validated['name'],
            'price'  => $validated['price'],
            'image'  => $path,
            'active' => $validated['active'] ?? true,
        ]);

        return redirect()->route('admin.packages.index')->with('success', 'Package added.');
    }

    public function edit(Package $package): Response
    {
        return Inertia::render('admin/packages/edit', [
            'package' => [
                'id'        => $package->id,
                'name'      => $package->name,
                'price'     => $package->price,
                'image_url' => $package->image_url,
                'active'    => $package->active,
            ],
        ]);
    }

    public function update(Request $request, Package $package): RedirectResponse
    {
        $validated = $request->validate([
            'name'   => ['required', 'string', 'max:150'],
            'price'  => ['required', 'string', 'max:50'],
            'image'  => ['nullable', 'image', 'max:2048'],
            'active' => ['boolean'],
        ]);

        if ($request->hasFile('image')) {
            Storage::disk('public')->delete($package->image);
            $file      = $request->file('image');
            $extension = strtolower($file->getClientOriginalExtension() ?: 'jpg');
            $filename  = Str::random(40) . '.' . $extension;
            $savePath  = storage_path('app' . DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR . 'packages');
            $file->move($savePath, $filename);
            $package->image = 'packages/' . $filename;
        }

        $package->name   = $validated['name'];
        $package->price  = $validated['price'];
        $package->active = $validated['active'] ?? $package->active;
        $package->save();

        return redirect()->route('admin.packages.index')->with('success', 'Package updated.');
    }

    public function destroy(Package $package): RedirectResponse
    {
        Storage::disk('public')->delete($package->image);
        $package->delete();

        return redirect()->route('admin.packages.index')->with('success', 'Package deleted.');
    }
}
