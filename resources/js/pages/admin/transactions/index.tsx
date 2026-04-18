import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';

interface Agent { id: number; name: string; }
interface Transaction {
    id: number;
    account_id: number;
    account_type: string;
    payment_type: 'dr' | 'cr';
    date: string;
    detail: string | null;
    amount: string;
    voucher_id: number | null;
    agent: { name: string } | null;
}
interface Paginated<T> {
    data: T[];
    current_page: number; last_page: number; per_page: number;
    links: { url: string | null; label: string; active: boolean }[];
}
interface Filters { agent_id?: string; date?: string; payment_type?: string; }

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Transactions', href: '/admin/transactions' },
];

export default function TransactionsIndex({
    transactions, agents, filters, balance, flash,
}: {
    transactions: Paginated<Transaction>;
    agents: Agent[];
    filters: Filters;
    balance?: number;
    flash?: { success?: string };
}) {
    const { data, setData, get, processing } = useForm({
        agent_id: filters.agent_id ?? '',
        date: filters.date ?? '',
        payment_type: filters.payment_type ?? '',
    });

    function search(e: React.FormEvent) {
        e.preventDefault();
        get('/admin/transactions', { preserveState: true, replace: true });
    }

    function destroy(id: number) {
        if (!confirm('Delete this transaction?')) return;
        router.delete(`/admin/transactions/${id}`, { preserveScroll: true });
    }

    const totalDr = transactions.data.filter(t => t.payment_type === 'dr').reduce((s, t) => s + parseFloat(t.amount), 0);
    const totalCr = transactions.data.filter(t => t.payment_type === 'cr').reduce((s, t) => s + parseFloat(t.amount), 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transactions" />
            <div className="flex flex-col gap-4 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Transactions</h1>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild><Link href="/admin/transactions/balance">Agent Balance</Link></Button>
                        <Button asChild><Link href="/admin/transactions/create">+ Add</Link></Button>
                    </div>
                </div>

                {flash?.success && <div className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">{flash.success}</div>}

                {/* Filters */}
                <form onSubmit={search} className="flex flex-wrap items-end gap-3">
                    <select value={data.agent_id} onChange={e => setData('agent_id', e.target.value)}
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option value="">All Accounts</option>
                        {agents.map(a => <option key={a.id} value={String(a.id)}>{a.name}</option>)}
                    </select>
                    <input type="date" value={data.date} onChange={e => setData('date', e.target.value)}
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm" />
                    <select value={data.payment_type} onChange={e => setData('payment_type', e.target.value)}
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option value="">All Types</option>
                        <option value="dr">Debit (Dr)</option>
                        <option value="cr">Credit (Cr)</option>
                    </select>
                    <Button type="submit" disabled={processing} variant="outline">Search</Button>
                </form>

                {/* Table */}
                <div className="overflow-hidden rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 text-left w-10">Sr#</th>
                                <th className="px-4 py-3 text-left">Date</th>
                                <th className="px-4 py-3 text-left">Account</th>
                                <th className="px-4 py-3 text-left">Detail</th>
                                <th className="px-4 py-3 text-left">Type</th>
                                <th className="px-4 py-3 text-right">Debit</th>
                                <th className="px-4 py-3 text-right">Credit</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {transactions.data.length === 0 && (
                                <tr><td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">No transactions.</td></tr>
                            )}
                            {transactions.data.map((t, i) => (
                                <tr key={t.id} className="hover:bg-muted/30">
                                    <td className="px-4 py-2">{(transactions.current_page - 1) * transactions.per_page + i + 1}</td>
                                    <td className="px-4 py-2">{t.date?.substring(0, 10)}</td>
                                    <td className="px-4 py-2">{t.agent?.name ?? '—'}</td>
                                    <td className="px-4 py-2 text-muted-foreground">{t.detail ?? '—'}</td>
                                    <td className="px-4 py-2">
                                        <span className={`rounded px-1.5 py-0.5 text-xs font-medium uppercase ${t.payment_type === 'dr' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                            {t.payment_type}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 text-right">{t.payment_type === 'dr' ? t.amount : ''}</td>
                                    <td className="px-4 py-2 text-right">{t.payment_type === 'cr' ? t.amount : ''}</td>
                                    <td className="px-4 py-2 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" size="sm" asChild><Link href={`/admin/transactions/${t.id}/edit`}>Edit</Link></Button>
                                            <Button variant="destructive" size="sm" onClick={() => destroy(t.id)}>Del</Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            <tr className="bg-muted/30 font-semibold">
                                <td colSpan={5} className="px-4 py-2 text-right text-muted-foreground">Page Total</td>
                                <td className="px-4 py-2 text-right text-red-700">{totalDr.toFixed(2)}</td>
                                <td className="px-4 py-2 text-right text-green-700">{totalCr.toFixed(2)}</td>
                                <td />
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {transactions.last_page > 1 && (
                    <div className="flex flex-wrap gap-1">
                        {transactions.links.map((link, i) => (
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
