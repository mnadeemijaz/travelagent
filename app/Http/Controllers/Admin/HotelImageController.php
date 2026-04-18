<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HotelImage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class HotelImageController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/hotel-images/index', [
            'hotelImages' => HotelImage::orderByDesc('id')->get()->map(fn ($h) => [
                'id'        => $h->id,
                'name'      => $h->name,
                'city_name' => $h->city_name,
                'price'     => $h->price,
                'image_url' => $h->image_url,
                'active'    => $h->active,
            ]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/hotel-images/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'      => ['required', 'string', 'max:150'],
            'city_name' => ['required', 'string', 'max:100'],
            'price'     => ['required', 'numeric', 'min:0'],
            'image'     => ['required', 'image', 'max:2048'],
            'active'    => ['boolean'],
        ]);

        $file      = $request->file('image');
        $extension = strtolower($file->getClientOriginalExtension() ?: 'jpg');
        $filename  = Str::random(40) . '.' . $extension;
        $savePath  = storage_path('app' . DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR . 'hotel-images');
        if (!is_dir($savePath)) {
            mkdir($savePath, 0755, true);
        }
        $file->move($savePath, $filename);

        HotelImage::create([
            'name'      => $validated['name'],
            'city_name' => $validated['city_name'],
            'price'     => $validated['price'],
            'image'     => 'hotel-images/' . $filename,
            'active'    => $validated['active'] ?? true,
        ]);

        return redirect()->route('admin.hotel-images.index')->with('success', 'Hotel image added.');
    }

    public function edit(HotelImage $hotelImage): Response
    {
        return Inertia::render('admin/hotel-images/edit', [
            'hotelImage' => [
                'id'        => $hotelImage->id,
                'name'      => $hotelImage->name,
                'city_name' => $hotelImage->city_name,
                'price'     => $hotelImage->price,
                'image_url' => $hotelImage->image_url,
                'active'    => $hotelImage->active,
            ],
        ]);
    }

    public function update(Request $request, HotelImage $hotelImage): RedirectResponse
    {
        $validated = $request->validate([
            'name'      => ['required', 'string', 'max:150'],
            'city_name' => ['required', 'string', 'max:100'],
            'price'     => ['required', 'numeric', 'min:0'],
            'image'     => ['nullable', 'image', 'max:2048'],
            'active'    => ['boolean'],
        ]);

        if ($request->hasFile('image')) {
            Storage::disk('public')->delete($hotelImage->image);
            $file      = $request->file('image');
            $extension = strtolower($file->getClientOriginalExtension() ?: 'jpg');
            $filename  = Str::random(40) . '.' . $extension;
            $savePath  = storage_path('app' . DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR . 'hotel-images');
            if (!is_dir($savePath)) {
                mkdir($savePath, 0755, true);
            }
            $file->move($savePath, $filename);
            $hotelImage->image = 'hotel-images/' . $filename;
        }

        $hotelImage->name      = $validated['name'];
        $hotelImage->city_name = $validated['city_name'];
        $hotelImage->price     = $validated['price'];
        $hotelImage->active    = $validated['active'] ?? $hotelImage->active;
        $hotelImage->save();

        return redirect()->route('admin.hotel-images.index')->with('success', 'Hotel image updated.');
    }

    public function destroy(HotelImage $hotelImage): RedirectResponse
    {
        Storage::disk('public')->delete($hotelImage->image);
        $hotelImage->delete();

        return redirect()->route('admin.hotel-images.index')->with('success', 'Hotel image deleted.');
    }
}
