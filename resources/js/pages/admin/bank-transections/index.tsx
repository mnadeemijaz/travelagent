import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';

interface Bank  { id: number; name: string; }
interface Agent { id: number; name: string; }
interface Record {
    id: number; date: string; detail: string;
    amount: number; payment_type: 'cr' | 'dr';
    bank: Bank | null; agent: Agent | null;
}
interface Paginated<T> {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number; last_page: number;
}
interface Filters {
    search?: string; bank_id?: string; agent_id?: string;
    payment_type?: string; date?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Bank Transactions', href: '/admin/bank-transections' },
];

export default function BankTransectionsIndex({
    records, banks, agents, filters, flash, totalCr, totalDr, balance,
}: {
    records: Paginated<Record>; banks: Bank[]; agents: Agent[];
    filters: Filters; flash?: { success?: string };
    totalCr: number; totalDr: number; balance: number;
}) {
    const { data, setData, get } = useForm({
        search:       filters.search       ?? '',
        bank_id:      filters.bank_id      ?? '',
        agent_id:     filters.agent_id     ?? '',
        payment_type: filters.payment_type ?? '',
        date:         filters.date         ?? '',
    });

    function search(e: React.FormEvent) {
        e.preventDefault();
        get('/admin/bank-transections', { preserveState: true, replace: true });
    }

    function destroy(id: number) {
        if (!confirm('Delete this transaction?')) return;
        router.delete(`/admin/bank-transections/${id}`, { preserveScroll: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bank Transactions" />
            <div className="flex flex-col gap-4 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Bank Transactions</h1>
                    <Button asChild><Link href="/admin/bank-transections/create">+ Add Transaction</Link></Button>
                </div>

                {flash?.success && (
                    <div className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">{flash.success}</div>
                )}

                {/* Summary */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-lg border bg-green-50 p-4 text-center">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Credit (CR)</p>
                        <p className="mt-1 text-xl font-bold text-green-700">PKR {totalCr.toLocaleString()}</p>
                    </div>
                    <div className="rounded-lg border bg-red-50 p-4 text-center">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Debit (DR)</p>
                        <p className="mt-1 text-xl font-bold text-red-700">PKR {totalDr.toLocaleString()}</p>
                    </div>
                    <div className={`rounded-lg border p-4 text-center ${balance >= 0 ? 'bg-blue-50' : 'bg-orange-50'}`}>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Balance</p>
                        <p className={`mt-1 text-xl font-bold ${balance >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
                            PKR {balance.toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <form onSubmit={search} className="flex flex-wrap gap-3">
                    <Input placeholder="Search detail…" value={data.search}
                        onChange={e => setData('search', e.target.value)} className="w-44" />
                    <Input type="date" value={data.date}
                        onChange={e => setData('date', e.target.value)} className="w-40" />
                    <select value={data.bank_id} onChange={e => setData('bank_id', e.target.value)}
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option value="">All Banks</option>
                        {banks.map(b => <option key={b.id} value={String(b.id)}>{b.name}</option>)}
                    </select>
                    <select value={data.agent_id} onChange={e => setData('agent_id', e.target.value)}
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option value="">All Agents</option>
                        {agents.map(a => <option key={a.id} value={String(a.id)}>{a.name}</option>)}
                    </select>
                    <select value={data.payment_type} onChange={e => setData('payment_type', e.target.value)}
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option value="">CR / DR</option>
                        <option value="cr">Credit (CR)</option>
                        <option value="dr">Debit (DR)</option>
                    </select>
                    <Button type="submit" variant="outline">Filter</Button>
                </form>

                {/* Table */}
                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-muted-foreground">
                            <tr>
                                <th className="px-3 py-3 text-left font-medium">#</th>
                                <th className="px-3 py-3 text-left font-medium">Date</th>
                                <th className="px-3 py-3 text-left font-medium">Agent</th>
                                <th className="px-3 py-3 text-left font-medium">Bank</th>
                                <th className="px-3 py-3 text-left font-medium">Detail</th>
                                <th className="px-3 py-3 text-left font-medium">Type</th>
                                <th className="px-3 py-3 text-right font-medium">Amount</th>
                                <th className="px-3 py-3 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {records.data.length === 0 && (
                                <tr><td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">No transactions found.</td></tr>
                            )}
                            {records.data.map((r, i) => (
                                <tr key={r.id} className="hover:bg-muted/30">
                                    <td className="px-3 py-2 text-muted-foreground">{i + 1}</td>
                                    <td className="px-3 py-2">{r.date}</td>
                                    <td className="px-3 py-2">{r.agent?.name ?? '—'}</td>
                                    <td className="px-3 py-2">{r.bank?.name ?? '—'}</td>
                                    <td className="px-3 py-2">{r.detail}</td>
                                    <td className="px-3 py-2">
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${r.payment_type === 'cr' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {r.payment_type.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className={`px-3 py-2 text-right font-semibold ${r.payment_type === 'cr' ? 'text-green-700' : 'text-red-700'}`}>
                                        {r.payment_type === 'dr' ? '−' : '+'}{r.amount.toLocaleString()}
                                    </td>
                                    <td className="px-3 py-2 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/admin/bank-transections/${r.id}/edit`}>Edit</Link>
                                            </Button>
                                            <Button variant="destructive" size="sm" onClick={() => destroy(r.id)}>
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
                {records.last_page > 1 && (
                    <div className="flex flex-wrap gap-1">
                        {records.links.map((link, i) => (
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
