import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';

interface Agent { id: number; name: string; }
interface VisaCompany { id: number; name: string; }
interface Client {
    id: number; sr_name: string | null; name: string; last_name: string | null;
    ppno: string | null; visa_approve: string;
    visa_company: { name: string } | null;
    agent: { name: string } | null;
    group_code: string | null;
}
interface Paginated<T> { data: T[]; current_page: number; last_page: number; per_page: number; links: { url: string | null; label: string; active: boolean }[]; }
interface Filters { company_id?: string; status?: string; agent_id?: string; searchText?: string; }

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Reports', href: '#' },
    { title: 'Visa Report', href: '/admin/reports/visa' },
];

export default function VisaReport({ records, visaCompanies, agents, filters }: {
    records: Paginated<Client>; visaCompanies: VisaCompany[]; agents: Agent[]; filters: Filters;
}) {
    const { data, setData, get, processing } = useForm({
        company_id: filters.company_id ?? '',
        status: filters.status ?? '',
        agent_id: filters.agent_id ?? '',
        searchText: filters.searchText ?? '',
    });
    function search(e: React.FormEvent) { e.preventDefault(); get('/admin/reports/visa', { preserveState: true, replace: true }); }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Visa Report" />
            <div className="flex flex-col gap-4 p-6">
                <h1 className="text-2xl font-semibold">Visa Report</h1>
                <form onSubmit={search} className="flex flex-wrap items-end gap-3">
                    <input value={data.searchText} onChange={e => setData('searchText', e.target.value)}
                        placeholder="Search name / PP no…"
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm w-44" />
                    <select value={data.company_id} onChange={e => setData('company_id', e.target.value)}
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option value="">All Companies</option>
                        {visaCompanies.map(vc => <option key={vc.id} value={String(vc.id)}>{vc.name}</option>)}
                    </select>
                    <select value={data.agent_id} onChange={e => setData('agent_id', e.target.value)}
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option value="">All Agents</option>
                        {agents.map(a => <option key={a.id} value={String(a.id)}>{a.name}</option>)}
                    </select>
                    <select value={data.status} onChange={e => setData('status', e.target.value)}
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option value="">All Status</option>
                        <option value="yes">Approved</option>
                        <option value="no">Pending</option>
                    </select>
                    <Button type="submit" disabled={processing} variant="outline">Filter</Button>
                </form>
                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-xs">
                        <thead className="bg-muted/50 text-muted-foreground">
                            <tr>
                                <th className="px-3 py-2 text-left">Sr#</th>
                                <th className="px-3 py-2 text-left">Name</th>
                                <th className="px-3 py-2 text-left">PP No</th>
                                <th className="px-3 py-2 text-left">Visa Company</th>
                                <th className="px-3 py-2 text-left">Agent</th>
                                <th className="px-3 py-2 text-left">Group</th>
                                <th className="px-3 py-2 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {records.data.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No records found.</td></tr>}
                            {records.data.map((c, i) => (
                                <tr key={c.id} className="hover:bg-muted/30">
                                    <td className="px-3 py-1.5">{(records.current_page - 1) * records.per_page + i + 1}</td>
                                    <td className="px-3 py-1.5 whitespace-nowrap">{[c.sr_name, c.name, c.last_name].filter(Boolean).join(' ')}</td>
                                    <td className="px-3 py-1.5">{c.ppno ?? '—'}</td>
                                    <td className="px-3 py-1.5">{c.visa_company?.name ?? '—'}</td>
                                    <td className="px-3 py-1.5">{c.agent?.name ?? '—'}</td>
                                    <td className="px-3 py-1.5">{c.group_code ?? '—'}</td>
                                    <td className="px-3 py-1.5 text-center">
                                        <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${c.visa_approve === 'yes' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {c.visa_approve === 'yes' ? 'Approved' : 'Pending'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="text-xs text-muted-foreground">Page {records.current_page} of {records.last_page}</div>
                {records.last_page > 1 && (
                    <div className="flex flex-wrap gap-1">
                        {records.links.map((link, i) => (
                            <button key={i} disabled={!link.url}
                                onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                className={`rounded px-3 py-1 text-sm ${link.active ? 'bg-primary text-primary-foreground' : 'border hover:bg-muted/50 disabled:opacity-40'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }} />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
