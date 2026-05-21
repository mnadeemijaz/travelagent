import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import GroupTicketForm, { type GtFormData } from './form';

interface GtRecord {
    id: number; category: string; airline: string; from_city: string; to_city: string;
    booking_code: string | null; dep_date: string; dep_time: string; arr_time: string;
    flight_no: string | null; meal: string; baggage: string | null;
    price: number; seats_available: number; is_active: boolean;
    is_return: boolean;
    ret_dep_date: string | null; ret_dep_time: string | null;
    ret_arr_time: string | null; ret_flight_no: string | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Group Tickets', href: '/admin/group-tickets' },
    { title: 'Edit', href: '#' },
];

export default function GroupTicketsEdit({ ticket, categories }: { ticket: GtRecord; categories: string[] }) {
    const { data, setData, put, processing, errors } = useForm<GtFormData>({
        category:        ticket.category,
        airline:         ticket.airline,
        from_city:       ticket.from_city,
        to_city:         ticket.to_city,
        booking_code:    ticket.booking_code ?? '',
        dep_date:        ticket.dep_date.substring(0, 10),
        dep_time:        ticket.dep_time.substring(0, 5),
        arr_time:        ticket.arr_time.substring(0, 5),
        flight_no:       ticket.flight_no ?? '',
        meal:            ticket.meal,
        baggage:         ticket.baggage ?? '',
        price:           String(ticket.price),
        seats_available: String(ticket.seats_available),
        is_active:       ticket.is_active,
        is_return:       ticket.is_return,
        ret_dep_date:    ticket.ret_dep_date ? ticket.ret_dep_date.substring(0, 10) : '',
        ret_dep_time:    ticket.ret_dep_time ? ticket.ret_dep_time.substring(0, 5) : '',
        ret_arr_time:    ticket.ret_arr_time ? ticket.ret_arr_time.substring(0, 5) : '',
        ret_flight_no:   ticket.ret_flight_no ?? '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        put(`/admin/group-tickets/${ticket.id}`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Group Ticket" />
            <div className="flex flex-col gap-6 p-6">
                <h1 className="text-2xl font-semibold">Edit Group Ticket</h1>
                <GroupTicketForm data={data} setData={setData} errors={errors}
                    processing={processing} categories={categories}
                    onSubmit={submit} submitLabel="Save Changes" />
            </div>
        </AppLayout>
    );
}
