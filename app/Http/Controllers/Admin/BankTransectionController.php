<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Bank;
use App\Models\BankTransection;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class BankTransectionController extends Controller
{
    private function formData(): array
    {
        $agentRole = Role::findByName('agent');
        $agents = User::role('agent')->orderBy('name')->get(['id', 'name']);

        return [
            'banks'  => Bank::orderBy('name')->get(['id', 'name']),
            'agents' => $agents,
        ];
    }

    // ── Index ──────────────────────────────────────────────────────────────────

    public function index(Request $request): Response
    {
        $query = BankTransection::where('isDeleted', 0);

        if ($bankId = $request->input('bank_id')) {
            $query->where('bank_id', $bankId);
        }

        if ($agentId = $request->input('agent_id')) {
            $query->where('agent_id', $agentId);
        }

        if ($paymentType = $request->input('payment_type')) {
            $query->where('payment_type', $paymentType);
        }

        if ($date = $request->input('date')) {
            $query->whereDate('date', $date);
        }

        if ($search = $request->input('search')) {
            $query->where('detail', 'like', "%{$search}%");
        }

        $records = $query->with(['bank:id,name', 'agent:id,name'])
                         ->orderByDesc('id')
                         ->paginate(25)
                         ->withQueryString();

        $totalCr = BankTransection::where('isDeleted', 0)->where('payment_type', 'cr')->sum('amount');
        $totalDr = BankTransection::where('isDeleted', 0)->where('payment_type', 'dr')->sum('amount');

        return Inertia::render('admin/bank-transections/index', [
            'records'   => $records,
            'banks'     => Bank::orderBy('name')->get(['id', 'name']),
            'agents'    => User::role('agent')->orderBy('name')->get(['id', 'name']),
            'filters'   => $request->only(['search', 'bank_id', 'agent_id', 'payment_type', 'date']),
            'totalCr'   => $totalCr,
            'totalDr'   => $totalDr,
            'balance'   => $totalCr - $totalDr,
        ]);
    }

    // ── Create / Store ─────────────────────────────────────────────────────────

    public function create(): Response
    {
        return Inertia::render('admin/bank-transections/create', $this->formData());
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'payment_type' => ['required', 'in:cr,dr'],
            'amount'       => ['required', 'integer', 'min:1'],
            'date'         => ['required', 'date'],
            'detail'       => ['required', 'string', 'max:100'],
            'bank_id'      => ['required', 'integer', 'exists:banks,id'],
            'agent_id'     => ['required', 'integer', 'exists:users,id'],
        ]);

        BankTransection::create($validated);

        return redirect()->route('admin.bank-transections.index')->with('success', 'Transaction added successfully.');
    }

    // ── Edit / Update ──────────────────────────────────────────────────────────

    public function edit(BankTransection $bankTransection): Response
    {
        return Inertia::render('admin/bank-transections/edit', array_merge($this->formData(), [
            'record' => $bankTransection,
        ]));
    }

    public function update(Request $request, BankTransection $bankTransection): RedirectResponse
    {
        $validated = $request->validate([
            'payment_type' => ['required', 'in:cr,dr'],
            'amount'       => ['required', 'integer', 'min:1'],
            'date'         => ['required', 'date'],
            'detail'       => ['required', 'string', 'max:100'],
            'bank_id'      => ['required', 'integer', 'exists:banks,id'],
            'agent_id'     => ['required', 'integer', 'exists:users,id'],
        ]);

        $bankTransection->update($validated);

        return redirect()->route('admin.bank-transections.index')->with('success', 'Transaction updated successfully.');
    }

    // ── Delete ─────────────────────────────────────────────────────────────────

    public function destroy(BankTransection $bankTransection): RedirectResponse
    {
        $bankTransection->update(['isDeleted' => 1]);

        return back()->with('success', 'Transaction deleted.');
    }
}
