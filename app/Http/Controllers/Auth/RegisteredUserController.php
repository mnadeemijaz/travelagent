<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\NewUserRegistered;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role'     => ['required', 'in:agent,user'],
        ]);

        $user = User::create([
            'name'        => $request->name,
            'email'       => $request->email,
            'password'    => Hash::make($request->password),
            'is_approved' => false,   // must wait for admin approval
        ]);

        $user->assignRole($request->role);

        event(new Registered($user));

        // Notify admin
        $adminEmail = config('app.admin_email', env('ADMIN_EMAIL'));
        if ($adminEmail) {
            Mail::to($adminEmail)->send(new NewUserRegistered($user));
        }

        return redirect()->route('login')->with(
            'status',
            'Registration successful! Your account is pending admin approval. You will be able to login once approved.'
        );
    }
}
