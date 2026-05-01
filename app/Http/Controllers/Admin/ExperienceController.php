<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Experience;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ExperienceController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/experiences/index', [
            'experiences' => Experience::orderByDesc('id')->get()->map(fn ($e) => [
                'id'        => $e->id,
                'name'      => $e->name,
                'image_url' => $e->image_url,
                'active'    => $e->active,
            ]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/experiences/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'   => ['nullable', 'string', 'max:150'],
            'image'  => ['nullable', 'image', 'max:2048'],
            'active' => ['boolean'],
        ]);

        $path = null;
        if ($request->hasFile('image')) {
            $file      = $request->file('image');
            $extension = strtolower($file->getClientOriginalExtension() ?: 'jpg');
            $filename  = Str::random(40) . '.' . $extension;
            $savePath  = storage_path('app' . DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR . 'experiences');
            $file->move($savePath, $filename);
            $path      = 'experiences/' . $filename;
        }

        Experience::create([
            'name'   => $validated['name'] ?? null,
            'image'  => $path,
            'active' => $validated['active'] ?? true,
        ]);

        return redirect()->route('admin.experiences.index')->with('success', 'Experience added.');
    }

    public function edit(Experience $experience): Response
    {
        return Inertia::render('admin/experiences/edit', [
            'experience' => [
                'id'        => $experience->id,
                'name'      => $experience->name,
                'image_url' => $experience->image_url,
                'active'    => $experience->active,
            ],
        ]);
    }

    public function update(Request $request, Experience $experience): RedirectResponse
    {
        $validated = $request->validate([
            'name'   => ['nullable', 'string', 'max:150'],
            'image'  => ['nullable', 'image', 'max:2048'],
            'active' => ['boolean'],
        ]);

        if ($request->hasFile('image')) {
            Storage::disk('public')->delete($experience->image);
            $file      = $request->file('image');
            $extension = strtolower($file->getClientOriginalExtension() ?: 'jpg');
            $filename  = Str::random(40) . '.' . $extension;
            $savePath  = storage_path('app' . DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR . 'experiences');
            $file->move($savePath, $filename);
            $experience->image = 'experiences/' . $filename;
        }

        $experience->name   = $validated['name'] ?? null;
        $experience->active = $validated['active'] ?? $experience->active;
        $experience->save();

        return redirect()->route('admin.experiences.index')->with('success', 'Experience updated.');
    }

    public function destroy(Experience $experience): RedirectResponse
    {
        Storage::disk('public')->delete($experience->image);
        $experience->delete();

        return redirect()->route('admin.experiences.index')->with('success', 'Experience deleted.');
    }
}
