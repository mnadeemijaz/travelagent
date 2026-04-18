<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\User;
use App\Models\VisaCompany;
use App\Models\Voucher;
use Illuminate\Http\Request;
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
