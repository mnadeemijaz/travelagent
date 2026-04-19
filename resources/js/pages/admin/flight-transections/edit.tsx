import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import FlightTransectionForm, { type FtFormData } from './form';

interface Flight  { id: number; name: string; }
interface Bank    { id: number; name: string; }
interface FtRecord {
    id: number; flight_id: number | null;
    amount: number; payment_type: string; date: string;
    detail: string; bank_id: number | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Flight Transactions', href: '/admin/flight-transections' },
    { title: 'Edit', href: '#' },
];

export default function FlightTransectionsEdit({
    record, flights, banks,
}: { record: FtRecord; flights: Flight[]; banks: Bank[] }) {
    const { data, setData, put, processing, errors } = useForm<FtFormData>({
        flight_id:    record.flight_id ? String(record.flight_id) : '',
        amount:       String(record.amount),
        payment_type: record.payment_type,
        date:         record.date,
        detail:       record.detail,
        bank_id:      record.bank_id ? String(record.bank_id) : '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        put(`/admin/flight-transections/${record.id}`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Flight Transaction" />
            <div className="flex flex-col gap-6 p-6">
                <h1 className="text-2xl font-semibold">Edit Flight Transaction</h1>
                <FlightTransectionForm
                    data={data} setData={setData} errors={errors}
                    processing={processing} flights={flights}
                    banks={banks}
                    onSubmit={submit} submitLabel="Save Changes"
                />
            </div>
        </AppLayout>
    );
}
