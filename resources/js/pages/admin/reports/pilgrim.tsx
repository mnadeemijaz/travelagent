import { Button } from '@/components/ui/button';
import { fmtDate } from '@/lib/utils';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';

interface Agent { id: number; name: string; }
interface Client {
    id: number; sr_name: string | null; name: string; last_name: string | null;
    ppno: string | null; dob: string | null; age_group: string | null;
    passport_issue_date: string | null; passport_exp_date: string | null;
    agent: { name: string } | null;
    visa_company: { name: string } | null;
    group_code: string | null; group_name: string | null;
    vouchers: { id: number }[];
}
interface Paginated<T> { data: T[]; current_page: number; last_page: number; per_page: number; links: { url: string | null; label: string; active: boolean }[]; }
interface Filters { searchText?: string; agent_id?: string; age_group?: string; }

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Reports', href: '#' },
    { title: 'Pilgrim Report', href: '/admin/reports/pilgrim' },
];

export default function PilgrimReport({ records, agents, filters }: { records: Paginated<Client>; agents: Agent[]; filters: Filters }) {
    const { data, setData, get, processing } = useForm({
        searchText: filters.searchText ?? '',
        agent_id: filters.agent_id ?? '',
        age_group: filters.age_group ?? '',
    });
    function search(e: React.FormEvent) { e.preventDefault(); get('/admin/reports/pilgrim', { preserveState: true, replace: true }); }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pilgrim Report" />
            <div className="flex flex-col gap-4 p-6">
                <h1 className="text-2xl font-semibold">Pilgrim Report</h1>

                <form onSubmit={search} className="flex flex-wrap items-end gap-3">
                    <input value={data.searchText} onChange={e => setData('searchText', e.target.value)}
                        placeholder="Search name / PP no…"
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm w-48" />
                    <select value={data.agent_id} onChange={e => setData('agent_id', e.target.value)}
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option value="">All Agents</option>
                        {agents.map(a => <option key={a.id} value={String(a.id)}>{a.name}</option>)}
                    </select>
                    <select value={data.age_group} onChange={e => setData('age_group', e.target.value)}
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option value="">All Groups</option>
                        <option value="adult">Adult</option>
                        <option value="child">Child</option>
                        <option value="infant">Infant</option>
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
                                <th className="px-3 py-2 text-left">DOB</th>
                                <th className="px-3 py-2 text-left">Age Group</th>
                                <th className="px-3 py-2 text-left">PP Issue</th>
                                <th className="px-3 py-2 text-left">PP Expiry</th>
                                <th className="px-3 py-2 text-left">Agent</th>
                                <th className="px-3 py-2 text-left">Visa Co.</th>
                                <th className="px-3 py-2 text-left">Group</th>
                                <th className="px-3 py-2 text-left">Voucher ID</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {records.data.length === 0 && <tr><td colSpan={11} className="px-4 py-8 text-center text-muted-foreground">No records found.</td></tr>}
                            {records.data.map((c, i) => (
                                <tr key={c.id} className="hover:bg-muted/30">
                                    <td className="px-3 py-1.5">{(records.current_page - 1) * records.per_page + i + 1}</td>
                                    <td className="px-3 py-1.5 whitespace-nowrap">{[c.sr_name, c.name, c.last_name].filter(Boolean).join(' ')}</td>
                                    <td className="px-3 py-1.5">{c.ppno ?? '—'}</td>
                                    <td className="px-3 py-1.5">{fmtDate(c.dob)}</td>
                                    <td className="px-3 py-1.5 capitalize">{c.age_group ?? '—'}</td>
                                    <td className="px-3 py-1.5">{fmtDate(c.passport_issue_date)}</td>
                                    <td className="px-3 py-1.5">{fmtDate(c.passport_exp_date)}</td>
                                    <td className="px-3 py-1.5">{c.agent?.name ?? '—'}</td>
                                    <td className="px-3 py-1.5">{c.visa_company?.name ?? '—'}</td>
                                    <td className="px-3 py-1.5">{[c.group_code, c.group_name].filter(Boolean).join(' / ') || '—'}</td>
                                    <td className="px-3 py-1.5">
                                        {c.vouchers.length > 0 ? c.vouchers.map((v, vi) => (
                                            <span key={v.id}>
                                                {vi > 0 && ', '}
                                                <Link href={route('admin.vouchers.view', v.id)} className="text-blue-600 hover:underline font-medium">
                                                    #{v.id}
                                                </Link>
                                            </span>
                                        )) : '—'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Total on page: {records.data.length} | Page {records.current_page} of {records.last_page}</span>
                </div>

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
