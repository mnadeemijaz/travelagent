<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\User;
use App\Models\VisaCompany;
use App\Models\Voucher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    // ── Pilgrim Report ─────────────────────────────────────────────────────────

    public function pilgrimReport(Request $request): Response
    {
        $query = Client::query()
            ->with(['agent', 'visaCompany'])
            ->where('isDeleted', 0);

        if ($search = $request->input('searchText')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('ppno', 'like', "%{$search}%");
            });
        }

        if ($agentId = $request->input('agent_id')) {
            $query->where('agent_id', $agentId);
        }

        if ($ageGroup = $request->input('age_group')) {
            $query->where('age_group', $ageGroup);
        }

        return Inertia::render('admin/reports/pilgrim', [
            'records' => $query->orderByDesc('id')->paginate(25)->withQueryString(),
            'agents'  => User::whereHas('roles', fn ($q) => $q->where('name', 'agent'))
                ->orderBy('name')->get(['id', 'name']),
            'filters' => $request->only(['searchText', 'agent_id', 'age_group']),
        ]);
    }

    // ── Arrival Report ─────────────────────────────────────────────────────────

    public function arrivalReport(Request $request): Response
    {
        $query = Voucher::query()
            ->with(['agent', 'clients'])
            ->whereNotNull('arv_date');

        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('arv_date', [
                $request->input('start_date'),
                $request->input('end_date'),
            ]);
        } elseif ($request->filled('start_date')) {
            $query->whereDate('arv_date', '>=', $request->input('start_date'));
        }

        if ($agentId = $request->input('agent_id')) {
            $query->where('agent_id', $agentId);
        }

        return Inertia::render('admin/reports/arrival', [
            'records' => $query->orderBy('arv_date')->paginate(25)->withQueryString(),
            'agents'  => User::whereHas('roles', fn ($q) => $q->where('name', 'agent'))
                ->orderBy('name')->get(['id', 'name']),
            'filters' => $request->only(['start_date', 'end_date', 'agent_id']),
        ]);
    }

    // ── Departure Report ───────────────────────────────────────────────────────

    public function departureReport(Request $request): Response
    {
        $query = Voucher::query()
            ->with(['agent', 'clients'])
            ->whereNotNull('date');

        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('date', [
                $request->input('start_date'),
                $request->input('end_date'),
            ]);
        } elseif ($request->filled('start_date')) {
            $query->whereDate('date', '>=', $request->input('start_date'));
        }

        if ($agentId = $request->input('agent_id')) {
            $query->where('agent_id', $agentId);
        }

        return Inertia::render('admin/reports/departure', [
            'records' => $query->orderBy('date')->paginate(25)->withQueryString(),
            'agents'  => User::whereHas('roles', fn ($q) => $q->where('name', 'agent'))
                ->orderBy('name')->get(['id', 'name']),
            'filters' => $request->only(['start_date', 'end_date', 'agent_id']),
        ]);
    }

    // ── Visa Report ────────────────────────────────────────────────────────────

    public function visaReport(Request $request): Response
    {
        $query = Client::query()
            ->with(['agent', 'visaCompany'])
            ->where('isDeleted', 0);

        if ($companyId = $request->input('company_id')) {
            $query->where('visa_company_id', $companyId);
        }

        if ($status = $request->input('status')) {
            $query->where('visa_approve', $status);
        }

        if ($agentId = $request->input('agent_id')) {
            $query->where('agent_id', $agentId);
        }

        if ($search = $request->input('searchText')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('ppno', 'like', "%{$search}%");
            });
        }

        return Inertia::render('admin/reports/visa', [
            'records'       => $query->orderByDesc('id')->paginate(25)->withQueryString(),
            'visaCompanies' => VisaCompany::where('isDeleted', 0)->orderBy('name')->get(['id', 'name']),
            'agents'        => User::whereHas('roles', fn ($q) => $q->where('name', 'agent'))
                ->orderBy('name')->get(['id', 'name']),
            'filters'       => $request->only(['company_id', 'status', 'agent_id', 'searchText']),
        ]);
    }

    // ── Agent Detail (drilled from Agent Balance) ──────────────────────────────

    public function agentDetail(int $agentId): Response
    {
        $agent = User::findOrFail($agentId);

        // DR transactions with adult/child/infant counts from the linked voucher
        $drTransactions = DB::select("
            SELECT t.id, t.date, t.detail, t.amount, t.voucher_id,
                COALESCE(SUM(CASE WHEN c.age_group = 'Adult'  THEN 1 ELSE 0 END), 0) AS t_adult,
                COALESCE(SUM(CASE WHEN c.age_group = 'Child'  THEN 1 ELSE 0 END), 0) AS t_child,
                COALESCE(SUM(CASE WHEN c.age_group = 'Infant' THEN 1 ELSE 0 END), 0) AS t_infant
            FROM transactions t
            LEFT JOIN vouchers v       ON v.id  = t.voucher_id
            LEFT JOIN voucher_clients vc ON vc.voucher_id = v.id
            LEFT JOIN clients c        ON c.id  = vc.client_id
            WHERE t.isDeleted = 0
              AND t.payment_type = 'dr'
              AND t.account_id = ?
            GROUP BY t.id
            ORDER BY t.id DESC
        ", [$agentId]);

        // CR transactions
        $crTransactions = DB::select("
            SELECT t.id, t.date, t.detail, t.amount, t.voucher_id
            FROM transactions t
            WHERE t.isDeleted = 0
              AND t.payment_type = 'cr'
              AND t.account_id = ?
            ORDER BY t.id DESC
        ", [$agentId]);

        // Clients with visa approved but no voucher issued (pending charges)
        $chargesWoVoucher = DB::select("
            SELECT v.sr_rate,
                COALESCE(SUM(CASE WHEN c.age_group = 'Adult'  THEN 1 ELSE 0 END), 0) AS t_adult,
                COALESCE(SUM(CASE WHEN c.age_group = 'Child'  THEN 1 ELSE 0 END), 0) AS t_child,
                COALESCE(SUM(CASE WHEN c.age_group = 'Infant' THEN 1 ELSE 0 END), 0) AS t_infant
            FROM clients c
            JOIN vouchers v ON v.agent_id = c.agent_id
                AND v.id = (SELECT MAX(v2.id) FROM vouchers v2 WHERE v2.agent_id = c.agent_id AND v2.isDeleted = 0)
            WHERE c.isDeleted = 0
              AND c.visa_approve = 'yes'
              AND c.voucher_issue = 'no'
              AND c.agent_id = ?
            GROUP BY c.agent_id, v.sr_rate
        ", [$agentId]);

        // Ticket sales
        $ticketSales = DB::select("
            SELECT ts.id, ts.date, ts.name, ts.ticket_no, ts.pnr,
                ts.ticket_from_to, ts.category,
                ts.purchase, ts.sale, ts.payment_status, ts.paid_amount,
                f.name AS flight_name
            FROM ticket_sale ts
            LEFT JOIN flights f ON f.id = ts.flight_id
            WHERE ts.isDeleted = 0
              AND ts.agent_id = ?
            ORDER BY ts.id DESC
        ", [$agentId]);

        $totalCr = array_sum(array_column($crTransactions, 'amount'));
        $totalDr = array_sum(array_column($drTransactions, 'amount'));

        return Inertia::render('admin/reports/agent-detail', [
            'agent'           => ['id' => $agent->id, 'name' => $agent->name],
            'drTransactions'  => $drTransactions,
            'crTransactions'  => $crTransactions,
            'chargesWoVoucher'=> $chargesWoVoucher,
            'ticketSales'     => $ticketSales,
            'totalCr'         => $totalCr,
            'totalDr'         => $totalDr,
            'balance'         => $totalCr - $totalDr,
        ]);
    }

    // ── Agent Balance Report ───────────────────────────────────────────────────

    public function agentBalanceReport(): Response
    {
        // Per-agent: transaction CR/DR, ticket sale total, approved-pending clients
        $agentRows = DB::select("
            SELECT
                u.id,
                u.name,
                COALESCE(SUM(CASE WHEN t.payment_type = 'cr' THEN t.amount ELSE 0 END), 0) AS credit_total,
                COALESCE(SUM(CASE WHEN t.payment_type = 'dr' THEN t.amount ELSE 0 END), 0) AS debit_total,
                COALESCE(ts.sale_amount, 0)  AS sale_amount,
                COALESCE(c.t_adult, 0)       AS t_adult,
                COALESCE(c.t_child, 0)       AS t_child,
                COALESCE(c.t_infant, 0)      AS t_infant,
                v.sr_rate
            FROM users u
            INNER JOIN model_has_roles mhr ON mhr.model_id = u.id
                AND mhr.model_type = 'App\\\\Models\\\\User'
            INNER JOIN roles r ON r.id = mhr.role_id AND r.name = 'agent'
            LEFT JOIN transactions t ON t.account_id = u.id AND t.isDeleted = 0
            LEFT JOIN (
                SELECT agent_id, SUM(sale) AS sale_amount
                FROM ticket_sale
                WHERE isDeleted = 0
                GROUP BY agent_id
            ) ts ON ts.agent_id = u.id
            LEFT JOIN (
                SELECT agent_id,
                    SUM(CASE WHEN age_group = 'Adult'  THEN 1 ELSE 0 END) AS t_adult,
                    SUM(CASE WHEN age_group = 'Child'  THEN 1 ELSE 0 END) AS t_child,
                    SUM(CASE WHEN age_group = 'Infant' THEN 1 ELSE 0 END) AS t_infant
                FROM clients
                WHERE isDeleted = 0
                    AND visa_approve = 'yes'
                    AND voucher_issue = 'no'
                GROUP BY agent_id
            ) c ON c.agent_id = u.id
            LEFT JOIN vouchers v ON v.agent_id = u.id
                AND v.id = (
                    SELECT MAX(v2.id) FROM vouchers v2
                    WHERE v2.agent_id = u.id AND v2.isDeleted = 0
                )
            GROUP BY u.id, u.name, ts.sale_amount, c.t_adult, c.t_child, c.t_infant, v.sr_rate
            ORDER BY u.name
        ");

        // Per-bank: CR/DR totals
        $bankRows = DB::select("
            SELECT
                b.id,
                b.name,
                COALESCE(SUM(CASE WHEN bt.payment_type = 'cr' THEN bt.amount ELSE 0 END), 0) AS credit_total,
                COALESCE(SUM(CASE WHEN bt.payment_type = 'dr' THEN bt.amount ELSE 0 END), 0) AS debit_total
            FROM banks b
            LEFT JOIN bank_transection bt ON bt.bank_id = b.id AND bt.isDeleted = 0
            GROUP BY b.id, b.name
            ORDER BY b.name
        ");

        return Inertia::render('admin/reports/agent-balance', [
            'agentRows' => $agentRows,
            'bankRows'  => $bankRows,
        ]);
    }

    // ── Agent-Wise Pilgrim Report ──────────────────────────────────────────────

    public function pilgrimWiseReport(Request $request): Response
    {
        $query = User::whereHas('roles', fn ($q) => $q->where('name', 'agent'))
            ->withCount([
                'clients as total_clients'   => fn ($q) => $q->where('isDeleted', 0),
                'clients as total_adults'    => fn ($q) => $q->where('isDeleted', 0)->where('age_group', 'adult'),
                'clients as total_children'  => fn ($q) => $q->where('isDeleted', 0)->where('age_group', 'child'),
                'clients as total_infants'   => fn ($q) => $q->where('isDeleted', 0)->where('age_group', 'infant'),
            ]);

        if ($search = $request->input('searchText')) {
            $query->where('name', 'like', "%{$search}%");
        }

        return Inertia::render('admin/reports/pilgrim-wise', [
            'records' => $query->orderByDesc('total_clients')->paginate(25)->withQueryString(),
            'filters' => $request->only(['searchText']),
        ]);
    }
}
