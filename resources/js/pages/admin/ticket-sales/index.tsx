import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';

interface Agent  { id: number; name: string; }
interface Flight { id: number; name: string; }
interface Ticket {
    id: number; date: string; name: string; phone: string | null;
    ticket_no: string; pnr: string; ticket_from_to: string; category: string;
    purchase: number; sale: number; bps_sale: 'no' | 'yes';
    payment_status: 'partial' | 'full' | null; paid_amount: number | null;
    flight: Flight | null; agent: Agent | null;
}
interface Paginated<T> {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number; last_page: number;
}
interface Filters { search?: string; agent_id?: string; date?: string; payment_status?: string; }

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Ticket Sales', href: '/admin/ticket-sales' },
];

export default function TicketSalesIndex({
    tickets, agents, filters, flash, isAgent,
}: {
    tickets: Paginated<Ticket>; agents: Agent[]; filters: Filters;
    flash?: { success?: string }; isAgent: boolean;
}) {
    const { data, setData, get } = useForm({
        search: filters.search ?? '',
        agent_id: filters.agent_id ?? '',
        date: filters.date ?? '',
        payment_status: filters.payment_status ?? '',
    });

    function search(e: React.FormEvent) {
        e.preventDefault();
        get('/admin/ticket-sales', { preserveState: true, replace: true });
    }

    function destroy(id: number, name: string) {
        if (!confirm(`Delete ticket for "${name}"?`)) return;
        router.delete(`/admin/ticket-sales/${id}`, { preserveScroll: true });
    }

    const profit = tickets.data.reduce((s, t) => s + (t.sale - t.purchase), 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ticket Sales" />
            <div className="flex flex-col gap-4 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Ticket Sales</h1>
                    <Button asChild><Link href="/admin/ticket-sales/create">+ New Ticket</Link></Button>
                </div>

                {flash?.success && (
                    <div className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">{flash.success}</div>
                )}

                {/* Filters */}
                <form onSubmit={search} className="flex flex-wrap gap-3">
                    <Input placeholder="Name / Ticket No / PNR" value={data.search}
                        onChange={e => setData('search', e.target.value)} className="w-52" />
                    <Input type="date" value={data.date}
                        onChange={e => setData('date', e.target.value)} className="w-40" />
                    {!isAgent && (
                        <select value={data.agent_id} onChange={e => setData('agent_id', e.target.value)}
                            className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                            <option value="">All Agents</option>
                            {agents.map(a => <option key={a.id} value={String(a.id)}>{a.name}</option>)}
                        </select>
                    )}
                    <select value={data.payment_status} onChange={e => setData('payment_status', e.target.value)}
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option value="">All Payments</option>
                        <option value="partial">Partial</option>
                        <option value="full">Full</option>
                    </select>
                    <Button type="submit" variant="outline">Search</Button>
                </form>

                {/* Summary */}
                <div className="flex gap-6 rounded-lg border bg-muted/30 px-4 py-3 text-sm">
                    <span>Records: <strong>{tickets.data.length}</strong></span>
                    <span>Total Purchase: <strong>PKR {tickets.data.reduce((s,t) => s + t.purchase, 0).toLocaleString()}</strong></span>
                    <span>Total Sale: <strong>PKR {tickets.data.reduce((s,t) => s + t.sale, 0).toLocaleString()}</strong></span>
                    <span className={profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                        Profit: <strong>PKR {profit.toLocaleString()}</strong>
                    </span>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-muted-foreground">
                            <tr>
                                <th className="px-3 py-3 text-left font-medium">#</th>
                                <th className="px-3 py-3 text-left font-medium">Date</th>
                                <th className="px-3 py-3 text-left font-medium">Passenger</th>
                                <th className="px-3 py-3 text-left font-medium">Ticket No</th>
                                <th className="px-3 py-3 text-left font-medium">PNR</th>
                                <th className="px-3 py-3 text-left font-medium">Flight</th>
                                <th className="px-3 py-3 text-left font-medium">Route</th>
                                <th className="px-3 py-3 text-left font-medium">Category</th>
                                {!isAgent && <th className="px-3 py-3 text-left font-medium">Agent</th>}
                                <th className="px-3 py-3 text-right font-medium">Purchase</th>
                                <th className="px-3 py-3 text-right font-medium">Sale</th>
                                <th className="px-3 py-3 text-right font-medium">Profit</th>
                                <th className="px-3 py-3 text-left font-medium">BPS</th>
                                <th className="px-3 py-3 text-left font-medium">Payment</th>
                                <th className="px-3 py-3 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {tickets.data.length === 0 && (
                                <tr><td colSpan={15} className="px-4 py-8 text-center text-muted-foreground">No records found.</td></tr>
                            )}
                            {tickets.data.map((t, i) => (
                                <tr key={t.id} className="hover:bg-muted/30">
                                    <td className="px-3 py-2 text-muted-foreground">{i + 1}</td>
                                    <td className="px-3 py-2">{t.date}</td>
                                    <td className="px-3 py-2">
                                        <p className="font-medium">{t.name}</p>
                                        {t.phone && <p className="text-xs text-muted-foreground">{t.phone}</p>}
                                    </td>
                                    <td className="px-3 py-2 font-mono text-xs">{t.ticket_no}</td>
                                    <td className="px-3 py-2 font-mono text-xs">{t.pnr}</td>
                                    <td className="px-3 py-2">{t.flight?.name ?? '—'}</td>
                                    <td className="px-3 py-2">{t.ticket_from_to}</td>
                                    <td className="px-3 py-2">{t.category}</td>
                                    {!isAgent && <td className="px-3 py-2">{t.agent?.name ?? '—'}</td>}
                                    <td className="px-3 py-2 text-right">{t.purchase.toLocaleString()}</td>
                                    <td className="px-3 py-2 text-right">{t.sale.toLocaleString()}</td>
                                    <td className={`px-3 py-2 text-right font-medium ${t.sale - t.purchase >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {(t.sale - t.purchase).toLocaleString()}
                                    </td>
                                    <td className="px-3 py-2">
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${t.bps_sale === 'yes' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {t.bps_sale === 'yes' ? 'Yes' : 'No'}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2">
                                        {t.payment_status ? (
                                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${t.payment_status === 'full' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {t.payment_status === 'full' ? 'Full' : `Partial (${t.paid_amount?.toLocaleString()})`}
                                            </span>
                                        ) : '—'}
                                    </td>
                                    <td className="px-3 py-2 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/admin/ticket-sales/${t.id}/edit`}>Edit</Link>
                                            </Button>
                                            <Button variant="destructive" size="sm" onClick={() => destroy(t.id, t.name)}>
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {tickets.last_page > 1 && (
                    <div className="flex flex-wrap gap-1">
                        {tickets.links.map((link, i) => (
                            <Button key={i} size="sm" variant={link.active ? 'default' : 'outline'}
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url, {}, { preserveScroll: true })}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
