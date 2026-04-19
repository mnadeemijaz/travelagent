import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import GroupTicketForm, { type GtFormData } from './form';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Group Tickets', href: '/admin/group-tickets' },
    { title: 'Add', href: '#' },
];

export default function GroupTicketsCreate({ categories }: { categories: string[] }) {
    const { data, setData, post, processing, errors } = useForm<GtFormData>({
        category: '', airline: '', from_city: '', to_city: '',
        booking_code: '', dep_date: '', dep_time: '', arr_time: '',
        flight_no: '', meal: 'yes', baggage: '',
        price: '', seats_available: '', is_active: true,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/admin/group-tickets');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Group Ticket" />
            <div className="flex flex-col gap-6 p-6">
                <h1 className="text-2xl font-semibold">Add Group Ticket</h1>
                <GroupTicketForm data={data} setData={setData} errors={errors}
                    processing={processing} categories={categories}
                    onSubmit={submit} submitLabel="Save Ticket" />
            </div>
        </AppLayout>
    );
}
