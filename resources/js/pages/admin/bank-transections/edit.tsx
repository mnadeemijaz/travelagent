import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import BankTransectionForm, { type BtFormData } from './form';

interface Bank  { id: number; name: string; }
interface Agent { id: number; name: string; }
interface BtRecord {
    id: number; payment_type: string; amount: number;
    date: string; detail: string; bank_id: number; agent_id: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Bank Transactions', href: '/admin/bank-transections' },
    { title: 'Edit', href: '#' },
];

export default function BankTransectionsEdit({
    record, banks, agents,
}: { record: BtRecord; banks: Bank[]; agents: Agent[] }) {
    const { data, setData, put, processing, errors } = useForm<BtFormData>({
        payment_type: record.payment_type,
        amount:       String(record.amount),
        date:         record.date,
        detail:       record.detail,
        bank_id:      String(record.bank_id),
        agent_id:     String(record.agent_id),
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        put(`/admin/bank-transections/${record.id}`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Bank Transaction" />
            <div className="flex flex-col gap-6 p-6">
                <h1 className="text-2xl font-semibold">Edit Bank Transaction</h1>
                <BankTransectionForm
                    data={data} setData={setData} errors={errors}
                    processing={processing} banks={banks} agents={agents}
                    onSubmit={submit} submitLabel="Save Changes"
                />
            </div>
        </AppLayout>
    );
}
