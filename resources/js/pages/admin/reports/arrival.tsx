import { Button } from '@/components/ui/button';
import { fmtDate } from '@/lib/utils';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';

interface Agent { id: number; name: string; }
interface VoucherRow {
    id: number; arv_date: string | null; arv_time: string | null;
    gp_hd_no: string | null;
    t_adult: number | null; t_child: number | null; t_infant: number | null;
    agent: { name: string } | null;
    clients: { id: number; name: string; last_name: string | null }[];
}
interface Paginated<T> { data: T[]; current_page: number; last_page: number; per_page: number; links: { url: string | null; label: string; active: boolean }[]; }
interface Filters { start_date?: string; end_date?: string; agent_id?: string; }

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Reports', href: '#' },
    { title: 'Arrival Report', href: '/admin/reports/arrival' },
];

export default function ArrivalReport({ records, agents, filters }: { records: Paginated<VoucherRow>; agents: Agent[]; filters: Filters }) {
    const { data, setData, get, processing } = useForm({
        start_date: filters.start_date ?? '',
        end_date: filters.end_date ?? '',
        agent_id: filters.agent_id ?? '',
    });
    function search(e: React.FormEvent) { e.preventDefault(); get('/admin/reports/arrival', { preserveState: true, replace: true }); }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Arrival Report" />
            <div className="flex flex-col gap-4 p-6">
                <h1 className="text-2xl font-semibold">Arrival Report</h1>
                <form onSubmit={search} className="flex flex-wrap items-end gap-3">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-muted-foreground">From</label>
                        <input type="date" value={data.start_date} onChange={e => setData('start_date', e.target.value)}
                            className="rounded-md border border-input bg-background px-3 py-2 text-sm" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-muted-foreground">To</label>
                        <input type="date" value={data.end_date} onChange={e => setData('end_date', e.target.value)}
                            className="rounded-md border border-input bg-background px-3 py-2 text-sm" />
                    </div>
                    <select value={data.agent_id} onChange={e => setData('agent_id', e.target.value)}
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option value="">All Agents</option>
                        {agents.map(a => <option key={a.id} value={String(a.id)}>{a.name}</option>)}
                    </select>
                    <Button type="submit" disabled={processing} variant="outline">Filter</Button>
                </form>
                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-xs">
                        <thead className="bg-muted/50 text-muted-foreground">
                            <tr>
                                <th className="px-3 py-2 text-left">Sr#</th>
                                <th className="px-3 py-2 text-left">VID</th>
                                <th className="px-3 py-2 text-left">Arrival Date</th>
                                <th className="px-3 py-2 text-left">Time</th>
                                <th className="px-3 py-2 text-left">Group Head</th>
                                <th className="px-3 py-2 text-left">Agent</th>
                                <th className="px-3 py-2 text-center">Ad</th>
                                <th className="px-3 py-2 text-center">Ch</th>
                                <th className="px-3 py-2 text-center">In</th>
                                <th className="px-3 py-2 text-left">Clients</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {records.data.length === 0 && <tr><td colSpan={10} className="px-4 py-8 text-center text-muted-foreground">No records found.</td></tr>}
                            {records.data.map((v, i) => (
                                <tr key={v.id} className="hover:bg-muted/30">
                                    <td className="px-3 py-1.5">{(records.current_page - 1) * records.per_page + i + 1}</td>
                                    <td className="px-3 py-1.5 font-mono">#{v.id}</td>
                                    <td className="px-3 py-1.5">{fmtDate(v.arv_date)}</td>
                                    <td className="px-3 py-1.5">{v.arv_time ?? '—'}</td>
                                    <td className="px-3 py-1.5">{v.gp_hd_no ?? '—'}</td>
                                    <td className="px-3 py-1.5">{v.agent?.name ?? '—'}</td>
                                    <td className="px-3 py-1.5 text-center">{v.t_adult ?? 0}</td>
                                    <td className="px-3 py-1.5 text-center">{v.t_child ?? 0}</td>
                                    <td className="px-3 py-1.5 text-center">{v.t_infant ?? 0}</td>
                                    <td className="px-3 py-1.5">{v.clients.map(c => `${c.name} ${c.last_name ?? ''}`.trim()).join(', ') || '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
