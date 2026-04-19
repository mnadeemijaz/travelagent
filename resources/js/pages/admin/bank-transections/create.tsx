import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import BankTransectionForm, { type BtFormData } from './form';

interface Bank  { id: number; name: string; }
interface Agent { id: number; name: string; }

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Bank Transactions', href: '/admin/bank-transections' },
    { title: 'Add', href: '#' },
];

export default function BankTransectionsCreate({
    banks, agents,
}: { banks: Bank[]; agents: Agent[] }) {
    const { data, setData, post, processing, errors } = useForm<BtFormData>({
        payment_type: 'cr',
        amount: '',
        date: new Date().toISOString().substring(0, 10),
        detail: '',
        bank_id: '',
        agent_id: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/admin/bank-transections');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Bank Transaction" />
            <div className="flex flex-col gap-6 p-6">
                <h1 className="text-2xl font-semibold">Add Bank Transaction</h1>
                <BankTransectionForm
                    data={data} setData={setData} errors={errors}
                    processing={processing} banks={banks} agents={agents}
                    onSubmit={submit} submitLabel="Save Transaction"
                />
            </div>
        </AppLayout>
    );
}
