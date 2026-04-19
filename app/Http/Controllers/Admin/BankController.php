<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Bank;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BankController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/banks/index', [
            'banks' => Bank::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/banks/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate(['name' => ['required', 'string', 'max:150', 'unique:banks,name']]);

        Bank::create(['name' => $request->name]);

        return redirect()->route('admin.banks.index')->with('success', 'Bank added successfully.');
    }

    public function edit(Bank $bank): Response
    {
        return Inertia::render('admin/banks/edit', ['bank' => $bank]);
    }

    public function update(Request $request, Bank $bank): RedirectResponse
    {
        $request->validate(['name' => ['required', 'string', 'max:150', 'unique:banks,name,' . $bank->id]]);

        $bank->update(['name' => $request->name]);

        return redirect()->route('admin.banks.index')->with('success', 'Bank updated successfully.');
    }

    public function destroy(Bank $bank): RedirectResponse
    {
        $bank->delete();

        return redirect()->route('admin.banks.index')->with('success', 'Bank deleted.');
    }
}
