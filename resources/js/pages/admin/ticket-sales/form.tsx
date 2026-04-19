import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';

interface Agent  { id: number; name: string; }
interface Flight { id: number; name: string; }

export interface TicketFormData {
    date: string; name: string; phone: string; ticket_no: string; pnr: string;
    flight_id: string; agent_id: string; ticket_from_to: string; category: string;
    purchase: string; sale: string; bps_sale: string;
    payment_status: string; paid_amount: string;
}

interface Props {
    data: TicketFormData;
    setData: (key: keyof TicketFormData, value: string) => void;
    errors: Partial<Record<keyof TicketFormData, string>>;
    processing: boolean;
    agents: Agent[];
    flights: Flight[];
    onSubmit: (e: React.FormEvent) => void;
    backUrl: string;
    submitLabel: string;
}

const CATEGORIES = ['Economy', 'Business', 'First Class', 'Premium Economy'];

export default function TicketSaleForm({
    data, setData, errors, processing, agents, flights, onSubmit, backUrl, submitLabel,
}: Props) {
    const { auth } = usePage<SharedData>().props;
    const isAgent = (auth.roles as string[])?.includes('agent');

    return (
        <form onSubmit={onSubmit} className="space-y-6 max-w-3xl">
            {/* Row 1: Date + Agent */}
            <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
                <div className="space-y-1">
                    <Label>Date <span className="text-destructive">*</span></Label>
                    <Input type="date" value={data.date} onChange={e => setData('date', e.target.value)} />
                    {errors.date && <p className="text-xs text-destructive">{errors.date}</p>}
                </div>
                <div className="space-y-1">
                    <Label>Agent <span className="text-destructive">*</span></Label>
                    {isAgent ? (
                        <div className="w-full rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground">
                            {agents[0]?.name ?? '—'}
                        </div>
                    ) : (
                        <select value={data.agent_id} onChange={e => setData('agent_id', e.target.value)}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
                            <option value="">— Select Agent —</option>
                            {agents.map(a => <option key={a.id} value={String(a.id)}>{a.name}</option>)}
                        </select>
                    )}
                    {errors.agent_id && <p className="text-xs text-destructive">{errors.agent_id}</p>}
                </div>
            </div>

            {/* Row 2: Passenger info */}
            <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
                <div className="space-y-1 col-span-2">
                    <Label className="text-primary font-semibold">Passenger Information</Label>
                </div>
                <div className="space-y-1">
                    <Label>Passenger Name <span className="text-destructive">*</span></Label>
                    <Input placeholder="Full name" value={data.name} onChange={e => setData('name', e.target.value)} />
                    {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>
                <div className="space-y-1">
                    <Label>Phone</Label>
                    <Input placeholder="e.g. 03001234567" value={data.phone} onChange={e => setData('phone', e.target.value)} />
                    {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                </div>
                <div className="space-y-1">
                    <Label>Ticket No <span className="text-destructive">*</span></Label>
                    <Input placeholder="e.g. PK-12345" value={data.ticket_no} onChange={e => setData('ticket_no', e.target.value)} />
                    {errors.ticket_no && <p className="text-xs text-destructive">{errors.ticket_no}</p>}
                </div>
                <div className="space-y-1">
                    <Label>PNR <span className="text-destructive">*</span></Label>
                    <Input placeholder="e.g. ABC123" value={data.pnr} onChange={e => setData('pnr', e.target.value)} />
                    {errors.pnr && <p className="text-xs text-destructive">{errors.pnr}</p>}
                </div>
            </div>

            {/* Row 3: Flight info */}
            <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
                <div className="space-y-1 col-span-2">
                    <Label className="text-primary font-semibold">Flight Information</Label>
                </div>
                <div className="space-y-1">
                    <Label>Flight <span className="text-destructive">*</span></Label>
                    <select value={data.flight_id} onChange={e => setData('flight_id', e.target.value)}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
                        <option value="">— Select Flight —</option>
                        {flights.map(f => <option key={f.id} value={String(f.id)}>{f.name}</option>)}
                    </select>
                    {errors.flight_id && <p className="text-xs text-destructive">{errors.flight_id}</p>}
                </div>
                <div className="space-y-1">
                    <Label>Route (From → To) <span className="text-destructive">*</span></Label>
                    <Input placeholder="e.g. LHE-JED" value={data.ticket_from_to} onChange={e => setData('ticket_from_to', e.target.value)} />
                    {errors.ticket_from_to && <p className="text-xs text-destructive">{errors.ticket_from_to}</p>}
                </div>
                <div className="space-y-1">
                    <Label>Category <span className="text-destructive">*</span></Label>
                    <select value={data.category} onChange={e => setData('category', e.target.value)}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
                        <option value="">— Select Category —</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
                </div>
                <div className="space-y-1">
                    <Label>BPS Sale</Label>
                    <div className="flex gap-4 pt-2 text-sm">
                        {['no', 'yes'].map(v => (
                            <label key={v} className="flex items-center gap-1.5 cursor-pointer">
                                <input type="radio" name="bps_sale" value={v}
                                    checked={data.bps_sale === v}
                                    onChange={e => setData('bps_sale', e.target.value)} />
                                {v === 'yes' ? 'Yes' : 'No'}
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Row 4: Pricing */}
            <div className="grid grid-cols-3 gap-4 rounded-lg border p-4">
                <div className="space-y-1 col-span-3">
                    <Label className="text-primary font-semibold">Pricing & Payment</Label>
                </div>
                <div className="space-y-1">
                    <Label>Purchase Price (PKR) <span className="text-destructive">*</span></Label>
                    <Input type="number" min="0" placeholder="0" value={data.purchase} onChange={e => setData('purchase', e.target.value)} />
                    {errors.purchase && <p className="text-xs text-destructive">{errors.purchase}</p>}
                </div>
                <div className="space-y-1">
                    <Label>Sale Price (PKR) <span className="text-destructive">*</span></Label>
                    <Input type="number" min="0" placeholder="0" value={data.sale} onChange={e => setData('sale', e.target.value)} />
                    {errors.sale && <p className="text-xs text-destructive">{errors.sale}</p>}
                </div>
                <div className="space-y-1">
                    <Label>Profit</Label>
                    <div className={`rounded-md border px-3 py-2 text-sm font-semibold ${
                        parseInt(data.sale || '0') - parseInt(data.purchase || '0') >= 0
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                        PKR {(parseInt(data.sale || '0') - parseInt(data.purchase || '0')).toLocaleString()}
                    </div>
                </div>
                <div className="space-y-1">
                    <Label>Payment Status</Label>
                    <select value={data.payment_status} onChange={e => setData('payment_status', e.target.value)}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option value="">— None —</option>
                        <option value="partial">Partial</option>
                        <option value="full">Full</option>
                    </select>
                    {errors.payment_status && <p className="text-xs text-destructive">{errors.payment_status}</p>}
                </div>
                {data.payment_status === 'partial' && (
                    <div className="space-y-1">
                        <Label>Paid Amount (PKR)</Label>
                        <Input type="number" min="0" placeholder="0" value={data.paid_amount} onChange={e => setData('paid_amount', e.target.value)} />
                        {errors.paid_amount && <p className="text-xs text-destructive">{errors.paid_amount}</p>}
                    </div>
                )}
            </div>

            <div className="flex gap-3">
                <Button type="submit" disabled={processing} className="bg-teal-600 hover:bg-teal-700">
                    {submitLabel}
                </Button>
                <Button type="button" variant="outline" asChild>
                    <Link href={backUrl}>Cancel</Link>
                </Button>
            </div>
        </form>
    );
}
