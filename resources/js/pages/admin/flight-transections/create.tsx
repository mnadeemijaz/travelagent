import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import FlightTransectionForm, { type FtFormData } from './form';

interface Flight { id: number; name: string; }
interface Bank   { id: number; name: string; }

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Flight Transactions', href: '/admin/flight-transections' },
    { title: 'Add', href: '#' },
];

export default function FlightTransectionsCreate({
    flights, banks,
}: { flights: Flight[]; banks: Bank[] }) {
    const { data, setData, post, processing, errors } = useForm<FtFormData>({
        flight_id: '', amount: '',
        payment_type: 'cr',
        date: new Date().toISOString().substring(0, 10),
        detail: '', bank_id: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/admin/flight-transections');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Flight Transaction" />
            <div className="flex flex-col gap-6 p-6">
                <h1 className="text-2xl font-semibold">Add Flight Transaction</h1>
                <FlightTransectionForm
                    data={data} setData={setData} errors={errors}
                    processing={processing} flights={flights}
                    banks={banks}
                    onSubmit={submit} submitLabel="Save Transaction"
                />
            </div>
        </AppLayout>
    );
}
