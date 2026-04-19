import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import TicketSaleForm, { type TicketFormData } from './form';

interface Agent  { id: number; name: string; }
interface Flight { id: number; name: string; }
interface Ticket {
    id: number; date: string; name: string; phone: string | null;
    ticket_no: string; pnr: string; flight_id: number; agent_id: number;
    ticket_from_to: string; category: string; purchase: number; sale: number;
    bps_sale: string; payment_status: string | null; paid_amount: number | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Ticket Sales', href: '/admin/ticket-sales' },
    { title: 'Edit', href: '#' },
];

export default function TicketSalesEdit({
    ticket, agents, flights,
}: { ticket: Ticket; agents: Agent[]; flights: Flight[] }) {
    const { data, setData, put, processing, errors } = useForm<TicketFormData>({
        date: ticket.date ?? '',
        name: ticket.name ?? '',
        phone: ticket.phone ?? '',
        ticket_no: ticket.ticket_no ?? '',
        pnr: ticket.pnr ?? '',
        flight_id: ticket.flight_id ? String(ticket.flight_id) : '',
        agent_id: ticket.agent_id ? String(ticket.agent_id) : '',
        ticket_from_to: ticket.ticket_from_to ?? '',
        category: ticket.category ?? '',
        purchase: String(ticket.purchase ?? ''),
        sale: String(ticket.sale ?? ''),
        bps_sale: ticket.bps_sale ?? 'no',
        payment_status: ticket.payment_status ?? '',
        paid_amount: ticket.paid_amount ? String(ticket.paid_amount) : '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        put(`/admin/ticket-sales/${ticket.id}`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Ticket Sale" />
            <div className="flex flex-col gap-6 p-6">
                <h1 className="text-2xl font-semibold">Edit Ticket Sale</h1>
                <TicketSaleForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    agents={agents}
                    flights={flights}
                    onSubmit={submit}
                    backUrl="/admin/ticket-sales"
                    submitLabel="Save Changes"
                />
            </div>
        </AppLayout>
    );
}
