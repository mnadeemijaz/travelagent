<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BankDetail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BankDetailController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/bank-details/index', [
            'bankDetails' => BankDetail::orderByDesc('id')->get()->map(fn ($b) => [
                'id'                  => $b->id,
                'bank_name'           => $b->bank_name,
                'account_holder_name' => $b->account_holder_name,
                'account_number'      => $b->account_number,
                'iban_number'         => $b->iban_number,
                'logo_url'            => $b->logo_url,
                'active'              => $b->active,
            ]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/bank-details/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'bank_name'           => ['required', 'string', 'max:150'],
            'account_holder_name' => ['required', 'string', 'max:150'],
            'account_number'      => ['required', 'string', 'max:50'],
            'iban_number'         => ['nullable', 'string', 'max:50'],
            'logo'                => ['nullable', 'image', 'max:2048'],
            'active'              => ['boolean'],
        ]);

        $logoPath = null;
        if ($request->hasFile('logo')) {
            $file      = $request->file('logo');
            $extension = strtolower($file->getClientOriginalExtension() ?: 'png');
            $filename  = Str::random(40) . '.' . $extension;
            $savePath  = storage_path('app' . DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR . 'bank-details');
            if (!is_dir($savePath)) {
                mkdir($savePath, 0755, true);
            }
            $file->move($savePath, $filename);
            $logoPath = 'bank-details/' . $filename;
        }

        BankDetail::create([
            'bank_name'           => $validated['bank_name'],
            'account_holder_name' => $validated['account_holder_name'],
            'account_number'      => $validated['account_number'],
            'iban_number'         => $validated['iban_number'] ?? null,
            'logo'                => $logoPath,
            'active'              => $validated['active'] ?? true,
        ]);

        return redirect()->route('admin.bank-details.index')->with('success', 'Bank detail added successfully.');
    }

    public function edit(BankDetail $bankDetail): Response
    {
        return Inertia::render('admin/bank-details/edit', [
            'bankDetail' => [
                'id'                  => $bankDetail->id,
                'bank_name'           => $bankDetail->bank_name,
                'account_holder_name' => $bankDetail->account_holder_name,
                'account_number'      => $bankDetail->account_number,
                'iban_number'         => $bankDetail->iban_number,
                'logo_url'            => $bankDetail->logo_url,
                'active'              => $bankDetail->active,
            ],
        ]);
    }

    public function update(Request $request, BankDetail $bankDetail): RedirectResponse
    {
        $validated = $request->validate([
            'bank_name'           => ['required', 'string', 'max:150'],
            'account_holder_name' => ['required', 'string', 'max:150'],
            'account_number'      => ['required', 'string', 'max:50'],
            'iban_number'         => ['nullable', 'string', 'max:50'],
            'logo'                => ['nullable', 'image', 'max:2048'],
            'active'              => ['boolean'],
        ]);

        if ($request->hasFile('logo')) {
            if ($bankDetail->logo) {
                Storage::disk('public')->delete($bankDetail->logo);
            }
            $file      = $request->file('logo');
            $extension = strtolower($file->getClientOriginalExtension() ?: 'png');
            $filename  = Str::random(40) . '.' . $extension;
            $savePath  = storage_path('app' . DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR . 'bank-details');
            if (!is_dir($savePath)) {
                mkdir($savePath, 0755, true);
            }
            $file->move($savePath, $filename);
            $bankDetail->logo = 'bank-details/' . $filename;
        }

        $bankDetail->bank_name           = $validated['bank_name'];
        $bankDetail->account_holder_name = $validated['account_holder_name'];
        $bankDetail->account_number      = $validated['account_number'];
        $bankDetail->iban_number         = $validated['iban_number'] ?? null;
        $bankDetail->active              = $validated['active'] ?? $bankDetail->active;
        $bankDetail->save();

        return redirect()->route('admin.bank-details.index')->with('success', 'Bank detail updated successfully.');
    }

    public function destroy(BankDetail $bankDetail): RedirectResponse
    {
        if ($bankDetail->logo) {
            Storage::disk('public')->delete($bankDetail->logo);
        }
        $bankDetail->delete();

        return redirect()->route('admin.bank-details.index')->with('success', 'Bank detail deleted.');
    }
}
