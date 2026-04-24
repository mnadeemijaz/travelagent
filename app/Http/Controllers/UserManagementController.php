<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
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
                'id'          => $user->id,
                'name'        => $user->name,
                'email'       => $user->email,
                'roles'       => $user->roles->pluck('name'),
                'is_approved' => $user->is_approved,
                'created_at'  => $user->created_at->toDateString(),
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
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', Password::defaults()],
            'role'     => ['required', 'string', Rule::exists('roles', 'name')],
        ]);

        $user = User::create([
            'name'        => $validated['name'],
            'email'       => $validated['email'],
            'password'    => Hash::make($validated['password']),
            'is_approved' => true,   // admin-created users are auto-approved
        ]);

        $user->assignRole($validated['role']);

        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }

    public function edit(User $user): Response
    {
        return Inertia::render('users/edit', [
            'user'  => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'role'  => $user->roles->first()?->name,
            ],
            'roles' => Role::orderBy('name')->pluck('name'),
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['nullable', Password::defaults()],
            'role'     => ['required', 'string', Rule::exists('roles', 'name')],
        ]);

        $user->update([
            'name'  => $validated['name'],
            'email' => $validated['email'],
            ...($validated['password'] ? ['password' => Hash::make($validated['password'])] : []),
        ]);

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
