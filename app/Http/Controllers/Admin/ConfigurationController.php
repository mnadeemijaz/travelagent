<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CompanyConfiguration;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ConfigurationController extends Controller
{
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'company_name' => ['required', 'string', 'max:150'],
            'address'      => ['nullable', 'string', 'max:500'],
            'tagline'      => ['nullable', 'string', 'max:200'],
            'phone'        => ['nullable', 'string', 'max:50'],
            'email'        => ['nullable', 'email', 'max:150'],
        ]);

        $config = CompanyConfiguration::instance();
        $config->update($validated);

        return redirect()->route('profile.edit')->with('configSaved', true);
    }
}
