import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import BankDetailForm from './form';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Bank Details', href: '/admin/bank-details' },
    { title: 'Add', href: '#' },
];

export default function BankDetailCreate() {
    const { data, setData, post, processing, errors } = useForm({
        bank_name: '',
        account_holder_name: '',
        account_number: '',
        iban_number: '',
        logo: null as File | null,
        active: true,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/admin/bank-details', { forceFormData: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Bank Detail" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Add Bank Detail</h1>
                    <Button variant="outline" asChild>
                        <Link href="/admin/bank-details">Back</Link>
                    </Button>
                </div>
                <BankDetailForm
                    data={data}
                    errors={errors}
                    processing={processing}
                    onSubmit={submit}
                    setData={(key, value) => setData(key as any, value as any)}
                />
            </div>
        </AppLayout>
    );
}
