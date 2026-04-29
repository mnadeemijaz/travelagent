<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use App\Models\CompanyConfiguration;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        $config = CompanyConfiguration::instance();

        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status'          => $request->session()->get('status'),
            'configSaved'     => $request->session()->get('configSaved', false),
            'configuration'   => [
                'company_name' => $config->company_name,
                'address'      => $config->address ?? '',
                'tagline'      => $config->tagline ?? '',
                'phone'        => $config->phone ?? '',
                'email'        => $config->email ?? '',
                'adult_rate'   => (float) ($config->adult_rate ?? 0),
                'child_rate'   => (float) ($config->child_rate ?? 0),
                'infant_rate'  => (float) ($config->infant_rate ?? 0),
                'sr_rate'      => (float) ($config->sr_rate ?? 1),
            ],
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return to_route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        if ($request->user()->hasRole('admin')) {
            return back()->withErrors(['password' => 'Admin accounts cannot be deleted.']);
        }

        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
