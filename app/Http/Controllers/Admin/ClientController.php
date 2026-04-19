<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Client;
use App\Models\VisaCompany;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ClientController extends Controller
{
    // ── Index ──────────────────────────────────────────────────────────────────

    public function index(Request $request): Response
    {
        $user  = auth()->user();
        $query = Client::query()->where('isDeleted', 0);

        // Agents only see their own clients
        if ($user->hasRole('agent')) {
            $query->where('agent_id', $user->id);
        }

        if ($search = $request->input('searchText')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('ppno', 'like', "%{$search}%")
                  ->orWhere('cnic', 'like', "%{$search}%");
            });
        }

        if ($ageGroup = $request->input('age_group')) {
            $query->where('age_group', $ageGroup);
        }

        if ($visaApprove = $request->input('visa_approve')) {
            $query->where('visa_approve', $visaApprove);
        }

        if ($agentId = $request->input('agent_id')) {
            $query->where('agent_id', $agentId);
        }

        if ($documentation = $request->input('documentation')) {
            $query->where('document', $documentation);
        }

        $clients = $query->with(['agent', 'visaCompany'])
                         ->orderByDesc('id')
                         ->paginate(20)
                         ->withQueryString();

        return Inertia::render('admin/clients/index', [
            'clients'    => $clients,
            'agents'     => User::whereHas('roles', function($q){ $q->where('name', 'agent'); })->orderBy('name')->get(['id', 'name']),
            'filters'    => $request->only(['searchText', 'age_group', 'visa_approve', 'agent_id', 'documentation']),
        ]);
    }

    // ── Create / Store ─────────────────────────────────────────────────────────

    public function create(): Response
    {
        return Inertia::render('admin/clients/create', [
            'agents'        => User::whereHas('roles', function($q){ $q->where('name', 'agent'); })->orderBy('name')->get(['id', 'name']),
            'visaCompanies' => VisaCompany::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        // Agents can only add clients under themselves
        if (auth()->user()->hasRole('agent')) {
            $request->merge(['agent_id' => auth()->id()]);
        }

        $validated = $request->validate([
            'name'            => ['required', 'string', 'max:128'],
            'last_name'       => ['nullable', 'string', 'max:128'],
            'cnic'            => ['nullable', 'string', 'max:20'],
            'sr_name'         => ['nullable', 'string', 'max:128'],
            'dob'             => ['nullable', 'date'],
            'ppno'            => ['nullable', 'string', 'max:50'],
            'age_group'       => ['nullable', 'in:adult,child,infant'],
            'visa_id'         => ['nullable', 'integer'],
            'agent_id'        => ['nullable', 'integer'],
            'visa_company_id' => ['nullable', 'integer'],
        ]);

        Client::create(array_merge($validated, [
            'group_code'  => '',
            'group_name'  => '',
            'account_pkg' => '',
            'address'     => '',
        ]));

        return redirect()->route('admin.clients.index')->with('success', 'Client added successfully.');
    }

    // ── Edit / Update ──────────────────────────────────────────────────────────

    public function edit(Client $client): Response
    {
        return Inertia::render('admin/clients/edit', [
            'client'        => $client,
            'agents'        => User::whereHas('roles', function($q){ $q->where('name', 'agent'); })->orderBy('name')->get(['id', 'name']),
            'visaCompanies' => VisaCompany::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, Client $client): RedirectResponse
    {
        $validated = $request->validate([
            'name'                => ['required', 'string', 'max:128'],
            'last_name'           => ['nullable', 'string', 'max:128'],
            'cnic'                => ['nullable', 'string', 'max:20'],
            'sr_name'             => ['nullable', 'string', 'max:128'],
            'dob'                 => ['nullable', 'date'],
            'ppno'                => ['nullable', 'string', 'max:50'],
            'passport_issue_date' => ['nullable', 'date'],
            'passport_exp_date'   => ['nullable', 'date'],
            'age_group'           => ['nullable', 'in:adult,child,infant'],
            'visa_id'             => ['nullable', 'integer'],
            'agent_id'            => ['nullable', 'integer'],
            'account_pkg'         => ['nullable', 'string', 'max:128'],
            'visa_company_id'     => ['nullable', 'integer'],
            'group_code'          => ['nullable', 'string', 'max:50'],
            'group_name'          => ['nullable', 'string', 'max:128'],
            'document'            => ['nullable', 'boolean'],
        ]);

        $validated['document'] = ($validated['document'] ?? false) ? 'yes' : 'no';

        $client->update($validated);

        return redirect()->route('admin.clients.index')->with('success', 'Client updated successfully.');
    }

    // ── Delete ─────────────────────────────────────────────────────────────────

    public function destroy(Client $client): RedirectResponse
    {
        $client->update(['isDeleted' => 1]);

        return redirect()->route('admin.clients.index')->with('success', 'Client deleted.');
    }

    // ── Visa actions (admin-only) ──────────────────────────────────────────────

    public function approveVisa(Request $request): RedirectResponse
    {
        $request->validate(['id' => ['required', 'integer']]);
        Client::where('id', $request->id)->update(['visa_approve' => 'yes']);

        return back()->with('success', 'Visa approved.');
    }

    public function rejectVisa(Request $request): RedirectResponse
    {
        $request->validate(['id' => ['required', 'integer']]);
        Client::where('id', $request->id)->update(['visa_approve' => 'no']);

        return back()->with('success', 'Visa rejected.');
    }

    public function updateVisa(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'id'        => ['required', 'integer'],
            'visa_no'   => ['required', 'string', 'max:50'],
            'visa_date' => ['required', 'date'],
        ]);

        Client::where('id', $validated['id'])
              ->update(['visa_no' => $validated['visa_no'], 'visa_date' => $validated['visa_date']]);

        return back()->with('success', 'Visa details updated.');
    }

    // ── Passport uniqueness check ──────────────────────────────────────────────

    public function checkPassportNo(Request $request): string
    {
        $query = Client::where('ppno', $request->input('ppno'))->where('isDeleted', 0);

        if ($id = $request->input('id')) {
            $query->where('id', '!=', $id);
        }

        return $query->exists() ? 'false' : 'true';
    }
}
