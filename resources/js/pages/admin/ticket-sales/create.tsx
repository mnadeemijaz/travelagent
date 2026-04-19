import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import TicketSaleForm, { type TicketFormData } from './form';

interface Agent  { id: number; name: string; }
interface Flight { id: number; name: string; }

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Ticket Sales', href: '/admin/ticket-sales' },
    { title: 'Add', href: '#' },
];

export default function TicketSalesCreate({ agents, flights }: { agents: Agent[]; flights: Flight[] }) {
    const { data, setData, post, processing, errors } = useForm<TicketFormData>({
        date: new Date().toISOString().substring(0, 10),
        name: '', phone: '', ticket_no: '', pnr: '',
        flight_id: '', agent_id: agents.length === 1 ? String(agents[0].id) : '',
        ticket_from_to: '', category: '',
        purchase: '', sale: '', bps_sale: 'no',
        payment_status: '', paid_amount: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/admin/ticket-sales');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Ticket Sale" />
            <div className="flex flex-col gap-6 p-6">
                <h1 className="text-2xl font-semibold">Add Ticket Sale</h1>
                <TicketSaleForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    agents={agents}
                    flights={flights}
                    onSubmit={submit}
                    backUrl="/admin/ticket-sales"
                    submitLabel="Save Ticket"
                />
            </div>
        </AppLayout>
    );
}
