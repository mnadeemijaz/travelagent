import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';

interface AgentRow {
    id: number; name: string;
    total_clients: number; total_adults: number; total_children: number; total_infants: number;
}
interface Paginated<T> { data: T[]; current_page: number; last_page: number; per_page: number; links: { url: string | null; label: string; active: boolean }[]; }
interface Filters { searchText?: string; }

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Reports', href: '#' },
    { title: 'Agent-Wise Report', href: '/admin/reports/pilgrim-wise' },
];

export default function PilgrimWiseReport({ records, filters }: { records: Paginated<AgentRow>; filters: Filters }) {
    const { data, setData, get, processing } = useForm({ searchText: filters.searchText ?? '' });
    function search(e: React.FormEvent) { e.preventDefault(); get('/admin/reports/pilgrim-wise', { preserveState: true, replace: true }); }

    const grandTotal = records.data.reduce((s, r) => s + r.total_clients, 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Agent-Wise Report" />
            <div className="flex flex-col gap-4 p-6">
                <h1 className="text-2xl font-semibold">Agent-Wise Pilgrim Report</h1>
                <form onSubmit={search} className="flex flex-wrap items-end gap-3">
                    <input value={data.searchText} onChange={e => setData('searchText', e.target.value)}
                        placeholder="Search agent name…"
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm w-48" />
                    <Button type="submit" disabled={processing} variant="outline">Filter</Button>
                </form>
                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 text-left w-10">Sr#</th>
                                <th className="px-4 py-3 text-left">Agent</th>
                                <th className="px-4 py-3 text-center">Adults</th>
                                <th className="px-4 py-3 text-center">Children</th>
                                <th className="px-4 py-3 text-center">Infants</th>
                                <th className="px-4 py-3 text-center font-semibold">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {records.data.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No records found.</td></tr>}
                            {records.data.map((r, i) => (
                                <tr key={r.id} className="hover:bg-muted/30">
                                    <td className="px-4 py-2">{(records.current_page - 1) * records.per_page + i + 1}</td>
                                    <td className="px-4 py-2 font-medium">{r.name}</td>
                                    <td className="px-4 py-2 text-center">{r.total_adults}</td>
                                    <td className="px-4 py-2 text-center">{r.total_children}</td>
                                    <td className="px-4 py-2 text-center">{r.total_infants}</td>
                                    <td className="px-4 py-2 text-center font-semibold">{r.total_clients}</td>
                                </tr>
                            ))}
                            {records.data.length > 0 && (
                                <tr className="bg-muted/30 font-semibold">
                                    <td colSpan={5} className="px-4 py-2 text-right text-muted-foreground">Page Total</td>
                                    <td className="px-4 py-2 text-center">{grandTotal}</td>
                                </tr>
                            )}
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
