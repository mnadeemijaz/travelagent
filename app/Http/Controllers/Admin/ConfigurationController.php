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
            'adult_rate'             => ['nullable', 'numeric', 'min:0'],
            'child_rate'             => ['nullable', 'numeric', 'min:0'],
            'infant_rate'            => ['nullable', 'numeric', 'min:0'],
            'sr_rate'                => ['nullable', 'numeric', 'min:0'],
            'makkah_contact1_name'   => ['nullable', 'string', 'max:100'],
            'makkah_contact1_phone'  => ['nullable', 'string', 'max:50'],
            'makkah_contact2_name'   => ['nullable', 'string', 'max:100'],
            'makkah_contact2_phone'  => ['nullable', 'string', 'max:50'],
            'madina_contact1_name'   => ['nullable', 'string', 'max:100'],
            'madina_contact1_phone'  => ['nullable', 'string', 'max:50'],
            'madina_contact2_name'   => ['nullable', 'string', 'max:100'],
            'madina_contact2_phone'  => ['nullable', 'string', 'max:50'],
        ]);

        $config = CompanyConfiguration::instance();
        $config->update($validated);

        return redirect()->route('profile.edit')->with('configSaved', true);
    }
}
