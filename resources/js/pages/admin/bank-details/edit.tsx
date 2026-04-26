import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import BankDetailForm from './form';

interface BankDetailData {
    id: number;
    bank_name: string;
    account_holder_name: string;
    account_number: string;
    iban_number: string | null;
    logo_url: string | null;
    active: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Bank Details', href: '/admin/bank-details' },
    { title: 'Edit', href: '#' },
];

export default function BankDetailEdit({ bankDetail }: { bankDetail: BankDetailData }) {
    const { data, setData, post, processing, errors } = useForm({
        bank_name: bankDetail.bank_name,
        account_holder_name: bankDetail.account_holder_name,
        account_number: bankDetail.account_number,
        iban_number: bankDetail.iban_number ?? '',
        logo: null as File | null,
        active: bankDetail.active,
        _method: 'PUT',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(`/admin/bank-details/${bankDetail.id}`, { forceFormData: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Bank Detail" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Edit Bank Detail</h1>
                    <Button variant="outline" asChild>
                        <Link href="/admin/bank-details">Back</Link>
                    </Button>
                </div>
                <BankDetailForm
                    data={data}
                    errors={errors}
                    processing={processing}
                    existingLogoUrl={bankDetail.logo_url}
                    onSubmit={submit}
                    setData={(key, value) => setData(key as any, value as any)}
                />
            </div>
        </AppLayout>
    );
}
