import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';

interface Agent { id: number; name: string; }
interface VoucherHotel { hotel: { name: string } | null; city_name: string; city_nights: number; }
interface Voucher {
    id: number;
    date: string | null;
    approved: number;
    agent: Agent | null;
    dep_date: string | null;
    ret_date: string | null;
    total: string;
    t_adult: number;
    t_child: number;
    t_infant: number;
    trip: { name: string } | null;
    vehicle: { name: string } | null;
    hotels: VoucherHotel[];
}
interface Paginated<T> {
    data: T[];
    current_page: number; last_page: number; per_page: number;
    links: { url: string | null; label: string; active: boolean }[];
}
interface Filters { searchText?: string; agent_id?: string; date?: string; v_status?: string; }

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Vouchers', href: '/admin/vouchers' },
];

function fmtDate(v: string | null): string {
    if (!v) return '—';
    const iso = v.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (iso) return `${iso[3]}/${iso[2]}/${iso[1]}`;
    return v;
}

export default function VouchersIndex({
    vouchers, agents, filters, flash,
}: {
    vouchers: Paginated<Voucher>; agents: Agent[]; filters: Filters; flash?: { success?: string };
}) {
    const { data, setData, get, processing } = useForm({
        searchText: filters.searchText ?? '',
        agent_id: filters.agent_id ?? '',
        date: filters.date ?? '',
        v_status: filters.v_status ?? '',
    });

    function search(e: React.FormEvent) {
        e.preventDefault();
        get('/admin/vouchers', { preserveState: true, replace: true });
    }

    function toggleApprove(v: Voucher) {
        const url = v.approved ? '/admin/vouchers/reject' : '/admin/vouchers/approve';
        router.post(url, { id: v.id }, { preserveScroll: true });
    }

    function cancel(id: number) {
        if (!confirm('Cancel this voucher?')) return;
        router.delete(`/admin/vouchers/${id}`, { preserveScroll: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Voucher Management" />
            <div className="flex flex-col gap-4 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Voucher Management</h1>
                    <Button asChild><Link href="/admin/vouchers/create">+ New Voucher</Link></Button>
                </div>

                {flash?.success && (
                    <div className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">{flash.success}</div>
                )}

                {/* Filters */}
                <form onSubmit={search} className="flex flex-wrap items-end gap-3">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground">Party</span>
                        <select value={data.agent_id} onChange={e => setData('agent_id', e.target.value)}
                            className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                            <option value="">All Agents</option>
                            {agents.map(a => <option key={a.id} value={String(a.id)}>{a.name}</option>)}
                        </select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground">Date</span>
                        <input type="date" value={data.date} onChange={e => setData('date', e.target.value)}
                            className="rounded-md border border-input bg-background px-3 py-2 text-sm" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground">Status</span>
                        <select value={data.v_status} onChange={e => setData('v_status', e.target.value)}
                            className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                            <option value="">All</option>
                            <option value="yes">Approved</option>
                            <option value="no">Not Approved</option>
                        </select>
                    </div>
                    <input type="text" placeholder="Search VID..." value={data.searchText}
                        onChange={e => setData('searchText', e.target.value)}
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm w-36" />
                    <Button type="submit" disabled={processing} variant="outline" className="self-end">Search</Button>
                </form>

                {/* Table */}
                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-xs">
                        <thead className="bg-muted/50 text-muted-foreground">
                            <tr>
                                <th className="px-2 py-2 text-left">Cancel</th>
                                <th className="px-2 py-2 text-left">Sr#</th>
                                <th className="px-2 py-2 text-left">Actions</th>
                                <th className="px-2 py-2 text-left">VID</th>
                                <th className="px-2 py-2 text-left">DOE</th>
                                <th className="px-2 py-2 text-left">Party</th>
                                <th className="px-2 py-2 text-left">ARV</th>
                                <th className="px-2 py-2 text-left">RET</th>
                                <th className="px-2 py-2 text-right">Total</th>
                                <th className="px-2 py-2 text-center">Ad</th>
                                <th className="px-2 py-2 text-center">Ch</th>
                                <th className="px-2 py-2 text-center">In</th>
                                <th className="px-2 py-2 text-left">Hotel 1</th>
                                <th className="px-2 py-2 text-center">N1</th>
                                <th className="px-2 py-2 text-left">Hotel 2</th>
                                <th className="px-2 py-2 text-center">N2</th>
                                <th className="px-2 py-2 text-left">Hotel 3</th>
                                <th className="px-2 py-2 text-center">N3</th>
                                <th className="px-2 py-2 text-center">T.Nights</th>
                                <th className="px-2 py-2 text-left">Transport</th>
                                <th className="px-2 py-2 text-left">By</th>
                                <th className="px-2 py-2 text-center">Approve</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {vouchers.data.length === 0 && (
                                <tr><td colSpan={22} className="px-4 py-8 text-center text-muted-foreground">No vouchers found.</td></tr>
                            )}
                            {vouchers.data.map((v, i) => {
                                const h = v.hotels ?? [];
                                const tNights = h.reduce((s, x) => s + (x.city_nights || 0), 0);
                                return (
                                    <tr key={v.id} className="hover:bg-muted/30">
                                        <td className="px-2 py-1">
                                            <button onClick={() => cancel(v.id)}
                                                className="rounded bg-red-100 px-1.5 py-0.5 text-red-700 hover:bg-red-200">✗</button>
                                        </td>
                                        <td className="px-2 py-1">{(vouchers.current_page - 1) * vouchers.per_page + i + 1}</td>
                                        <td className="px-2 py-1">
                                            <div className="flex gap-1">
                                                <Link href={`/admin/vouchers/${v.id}/edit`}
                                                    className="rounded bg-red-100 px-1.5 py-0.5 text-red-700 hover:bg-red-200">Edit</Link>
                                                <Link href={`/admin/vouchers/${v.id}/view`}
                                                    className="rounded bg-green-100 px-1.5 py-0.5 text-green-700 hover:bg-green-200">View</Link>
                                                <Link href={`/admin/vouchers/${v.id}/invoice`}
                                                    className="rounded bg-blue-100 px-1.5 py-0.5 text-blue-700 hover:bg-blue-200">Invoice</Link>
                                            </div>
                                        </td>
                                        <td className="px-2 py-1 font-medium">{v.id}</td>
                                        <td className="px-2 py-1">{fmtDate(v.date)}</td>
                                        <td className="px-2 py-1">{v.agent?.name ?? '—'}</td>
                                        <td className="px-2 py-1">{fmtDate(v.dep_date)}</td>
                                        <td className="px-2 py-1">{fmtDate(v.ret_date)}</td>
                                        <td className="px-2 py-1 text-right font-medium">{v.total}</td>
                                        <td className="px-2 py-1 text-center">{v.t_adult}</td>
                                        <td className="px-2 py-1 text-center">{v.t_child}</td>
                                        <td className="px-2 py-1 text-center">{v.t_infant}</td>
                                        {[0, 1, 2].map(idx => (
                                            <>
                                                <td key={`h${idx}`} className="px-2 py-1">{h[idx]?.hotel?.name ?? ''}</td>
                                                <td key={`n${idx}`} className="px-2 py-1 text-center">{h[idx]?.city_nights ?? ''}</td>
                                            </>
                                        ))}
                                        <td className="px-2 py-1 text-center">{tNights || ''}</td>
                                        <td className="px-2 py-1">{v.trip?.name ?? ''}</td>
                                        <td className="px-2 py-1">{v.vehicle?.name ?? ''}</td>
                                        <td className="px-2 py-1 text-center">
                                            <button onClick={() => toggleApprove(v)}
                                                className={`rounded px-2 py-0.5 ${v.approved ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}>
                                                {v.approved ? '✗ Revoke' : '✓ Approve'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {vouchers.last_page > 1 && (
                    <div className="flex flex-wrap gap-1">
                        {vouchers.links.map((link, i) => (
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
