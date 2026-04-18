import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

interface Agent { id: number; name: string; }
interface Transaction {
    id: number;
    account_id: number;
    payment_type: 'dr' | 'cr';
    date: string;
    detail: string | null;
    amount: string;
}

export default function TransactionForm({
    transaction, agents,
}: {
    transaction?: Transaction; agents: Agent[];
}) {
    const isEdit = !!transaction;
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Transactions', href: '/admin/transactions' },
        { title: isEdit ? 'Edit' : 'Add', href: '#' },
    ];

    const { data, setData, post, put, processing, errors } = useForm({
        agent_id: transaction?.account_id ? String(transaction.account_id) : '',
        payment_type: transaction?.payment_type ?? 'dr',
        date: transaction?.date?.substring(0, 10) ?? new Date().toISOString().substring(0, 10),
        detail: transaction?.detail ?? '',
        amount: transaction?.amount ?? '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        isEdit ? put(`/admin/transactions/${transaction!.id}`) : post('/admin/transactions');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Edit Transaction' : 'Add Transaction'} />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">{isEdit ? 'Edit Transaction' : 'Add Transaction'}</h1>
                    <Button variant="outline" asChild><Link href="/admin/transactions">Back</Link></Button>
                </div>
                <form onSubmit={submit} className="max-w-lg space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label>Account (Agent) <span className="text-destructive">*</span></Label>
                            <select value={data.agent_id} onChange={e => setData('agent_id', e.target.value)}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
                                <option value="">— Select Account —</option>
                                {agents.map(a => <option key={a.id} value={String(a.id)}>{a.name}</option>)}
                            </select>
                            {errors.agent_id && <p className="text-xs text-destructive">{errors.agent_id}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label>Date <span className="text-destructive">*</span></Label>
                            <Input type="date" value={data.date} onChange={e => setData('date', e.target.value)} required />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label>Type</Label>
                            <div className="flex gap-4 text-sm pt-1">
                                {[{ val: 'dr', label: 'Debit (Dr)' }, { val: 'cr', label: 'Credit (Cr)' }].map(opt => (
                                    <label key={opt.val} className="flex items-center gap-1.5">
                                        <input type="radio" name="payment_type" value={opt.val}
                                            checked={data.payment_type === opt.val}
                                            onChange={e => setData('payment_type', e.target.value as 'dr' | 'cr')} />
                                        {opt.label}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label>Amount <span className="text-destructive">*</span></Label>
                            <Input type="number" step="0.01" min={0} value={data.amount}
                                onChange={e => setData('amount', e.target.value)} required />
                            {errors.amount && <p className="text-xs text-destructive">{errors.amount}</p>}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <Label>Detail / Narration</Label>
                        <textarea value={data.detail} onChange={e => setData('detail', e.target.value)}
                            rows={3} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                    </div>

                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing} className="bg-teal-600 hover:bg-teal-700">
                            {isEdit ? 'Update Transaction' : 'Save Transaction'}
                        </Button>
                        <Button type="button" variant="destructive" asChild>
                            <Link href="/admin/transactions">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
