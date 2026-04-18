<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    // ── Index ─────────────────────────────────────────────────────────────────

    public function index(Request $request, ?int $agentId = null): Response
    {
        $user    = $request->user();
        $isAgent = $user->hasRole('agent');

        $resolvedAgentId = $isAgent
            ? $user->id
            : ($agentId ?: $request->input('agent_id'));

        $query = Transaction::query()
            ->with('agent')
            ->where('isDeleted', 0)
            ->where('account_type', 'agent');

        if ($resolvedAgentId) {
            $query->where('account_id', $resolvedAgentId);
        }

        if ($type = $request->input('payment_type')) {
            $query->where('payment_type', $type);
        }

        if ($date = $request->input('date')) {
            $query->whereDate('date', $date);
        }

        $transactions = $query->orderByDesc('date')->paginate(20)->withQueryString();

        $agents = $isAgent
            ? []
            : User::whereHas('roles', fn ($q) => $q->where('name', 'agent'))
                ->orderBy('name')->get(['id', 'name']);

        return Inertia::render('admin/transactions/index', [
            'transactions' => $transactions,
            'agents'       => $agents,
            'filters'      => $request->only(['agent_id', 'date', 'payment_type']),
            'flash'        => session('flash'),
        ]);
    }

    // ── Create / Store ─────────────────────────────────────────────────────────

    public function create(): Response
    {
        return Inertia::render('admin/transactions/create', [
            'agents' => User::whereHas('roles', fn ($q) => $q->where('name', 'agent'))
                ->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'agent_id'     => ['required', 'integer', 'exists:users,id'],
            'payment_type' => ['required', 'in:dr,cr'],
            'date'         => ['required', 'date'],
            'detail'       => ['nullable', 'string', 'max:500'],
            'amount'       => ['required', 'numeric', 'min:0'],
        ]);

        Transaction::create([
            'account_id'   => $validated['agent_id'],
            'account_type' => 'agent',
            'payment_type' => $validated['payment_type'],
            'date'         => $validated['date'],
            'detail'       => $validated['detail'] ?? null,
            'amount'       => $validated['amount'],
        ]);

        return redirect()->route('admin.transactions.index')
            ->with('success', 'Transaction added successfully.');
    }

    // ── Edit / Update ──────────────────────────────────────────────────────────

    public function edit(Transaction $transaction): Response
    {
        return Inertia::render('admin/transactions/edit', [
            'transaction' => $transaction,
            'agents'      => User::whereHas('roles', fn ($q) => $q->where('name', 'agent'))
                ->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, Transaction $transaction): RedirectResponse
    {
        $validated = $request->validate([
            'agent_id'     => ['required', 'integer', 'exists:users,id'],
            'payment_type' => ['required', 'in:dr,cr'],
            'date'         => ['required', 'date'],
            'detail'       => ['nullable', 'string', 'max:500'],
            'amount'       => ['required', 'numeric', 'min:0'],
        ]);

        $transaction->update([
            'account_id'   => $validated['agent_id'],
            'payment_type' => $validated['payment_type'],
            'date'         => $validated['date'],
            'detail'       => $validated['detail'] ?? null,
            'amount'       => $validated['amount'],
        ]);

        return redirect()->route('admin.transactions.index')
            ->with('success', 'Transaction updated successfully.');
    }

    // ── Delete ─────────────────────────────────────────────────────────────────

    public function destroy(Transaction $transaction): RedirectResponse
    {
        $transaction->update(['isDeleted' => 1]);

        return redirect()->route('admin.transactions.index')
            ->with('success', 'Transaction deleted.');
    }

    // ── Balance Summary ────────────────────────────────────────────────────────

    public function balance(): Response
    {
        $agentBalances = User::whereHas('roles', fn ($q) => $q->where('name', 'agent'))
            ->withSum(
                ['transactions as total_dr' => fn ($q) => $q->where('payment_type', 'dr')->where('isDeleted', 0)],
                'amount'
            )
            ->withSum(
                ['transactions as total_cr' => fn ($q) => $q->where('payment_type', 'cr')->where('isDeleted', 0)],
                'amount'
            )
            ->orderBy('name')
            ->get();

        $totalDr = $agentBalances->sum('total_dr');
        $totalCr = $agentBalances->sum('total_cr');

        return Inertia::render('admin/transactions/balance', [
            'totalDr'       => $totalDr,
            'totalCr'       => $totalCr,
            'netBalance'    => $totalCr - $totalDr,
            'agentBalances' => $agentBalances,
        ]);
    }
}
