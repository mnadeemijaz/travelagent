<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserManagementController extends Controller
{
    public function index(): Response
    {
        $users = User::with('roles')
            ->orderBy('is_approved')   // unapproved first
            ->orderBy('id')
            ->get()
            ->map(fn (User $user) => [
                'id'           => $user->id,
                'name'         => $user->name,
                'email'        => $user->email,
                'roles'        => $user->roles->pluck('name'),
                'is_approved'  => $user->is_approved,
                'created_at'   => $user->created_at->toDateString(),
                'company_name' => $user->company_name,
                'address'      => $user->address,
                'mobile'       => $user->mobile,
                'logo_url'     => $user->logo_url,
            ]);

        return Inertia::render('users/index', [
            'users' => $users,
            'flash' => session()->only(['success']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('users/create', [
            'roles' => Role::orderBy('name')->pluck('name'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'         => ['required', 'string', 'max:255'],
            'email'        => ['required', 'email', 'max:255', 'unique:users,email'],
            'password'     => ['required', Password::defaults()],
            'role'         => ['required', 'string', Rule::exists('roles', 'name')],
            'company_name' => ['nullable', 'string', 'max:255'],
            'address'      => ['nullable', 'string', 'max:1000'],
            'mobile'       => ['nullable', 'string', 'max:50'],
            'company_logo' => ['nullable', 'image', 'max:2048'],
        ]);

        $logoPath = null;
        if ($request->hasFile('company_logo')) {
            $file      = $request->file('company_logo');
            $extension = strtolower($file->getClientOriginalExtension() ?: 'jpg');
            $filename  = Str::random(40) . '.' . $extension;
            $savePath  = storage_path('app' . DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR . 'logos');
            if (!is_dir($savePath)) mkdir($savePath, 0755, true);
            $file->move($savePath, $filename);
            $logoPath = 'logos/' . $filename;
        }

        $user = User::create([
            'name'         => $validated['name'],
            'email'        => $validated['email'],
            'password'     => Hash::make($validated['password']),
            'is_approved'  => true,   // admin-created users are auto-approved
            'company_name' => $validated['company_name'] ?? null,
            'address'      => $validated['address'] ?? null,
            'mobile'       => $validated['mobile'] ?? null,
            'company_logo' => $logoPath,
        ]);

        $user->assignRole($validated['role']);

        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }

    public function edit(User $user): Response
    {
        return Inertia::render('users/edit', [
            'user'  => [
                'id'           => $user->id,
                'name'         => $user->name,
                'email'        => $user->email,
                'role'         => $user->roles->first()?->name,
                'company_name' => $user->company_name,
                'address'      => $user->address,
                'mobile'       => $user->mobile,
                'logo_url'     => $user->logo_url,
            ],
            'roles' => Role::orderBy('name')->pluck('name'),
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name'         => ['required', 'string', 'max:255'],
            'email'        => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password'     => ['nullable', Password::defaults()],
            'role'         => ['required', 'string', Rule::exists('roles', 'name')],
            'company_name' => ['nullable', 'string', 'max:255'],
            'address'      => ['nullable', 'string', 'max:1000'],
            'mobile'       => ['nullable', 'string', 'max:50'],
            'company_logo' => ['nullable', 'image', 'max:2048'],
        ]);

        if ($request->hasFile('company_logo')) {
            if ($user->company_logo) {
                Storage::disk('public')->delete($user->company_logo);
            }
            $file      = $request->file('company_logo');
            $extension = strtolower($file->getClientOriginalExtension() ?: 'jpg');
            $filename  = Str::random(40) . '.' . $extension;
            $savePath  = storage_path('app' . DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR . 'logos');
            if (!is_dir($savePath)) mkdir($savePath, 0755, true);
            $file->move($savePath, $filename);
            $user->company_logo = 'logos/' . $filename;
        }

        $user->fill([
            'name'         => $validated['name'],
            'email'        => $validated['email'],
            'company_name' => $validated['company_name'] ?? null,
            'address'      => $validated['address'] ?? null,
            'mobile'       => $validated['mobile'] ?? null,
            ...($validated['password'] ? ['password' => Hash::make($validated['password'])] : []),
        ]);
        $user->save();

        $user->syncRoles([$validated['role']]);

        return redirect()->route('users.index')->with('success', 'User updated successfully.');
    }

    public function approve(User $user): RedirectResponse
    {
        $user->update(['is_approved' => true]);

        return back()->with('success', "'{$user->name}' approved. They can now log in.");
    }

    public function destroy(User $user): RedirectResponse
    {
        $user->delete();

        return redirect()->route('users.index')->with('success', 'User deleted successfully.');
    }
}
