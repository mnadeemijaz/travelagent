import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from '@inertiajs/react';

interface Flight { id: number; name: string; }
interface Bank   { id: number; name: string; }

export interface FtFormData {
    flight_id: string; amount: string;
    payment_type: string; date: string; detail: string; bank_id: string;
}

interface Props {
    data: FtFormData;
    setData: (key: keyof FtFormData, value: string) => void;
    errors: Partial<Record<keyof FtFormData, string>>;
    processing: boolean;
    flights: Flight[];
    banks: Bank[];
    onSubmit: (e: React.FormEvent) => void;
    submitLabel: string;
}

export default function FlightTransectionForm({
    data, setData, errors, processing, flights, banks, onSubmit, submitLabel,
}: Props) {
    return (
        <form onSubmit={onSubmit} className="max-w-2xl space-y-6">
            <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
                {/* Date */}
                <div className="space-y-1">
                    <Label>Date <span className="text-destructive">*</span></Label>
                    <Input type="date" value={data.date} onChange={e => setData('date', e.target.value)} />
                    {errors.date && <p className="text-xs text-destructive">{errors.date}</p>}
                </div>

                {/* Payment Type */}
                <div className="space-y-1">
                    <Label>Payment Type <span className="text-destructive">*</span></Label>
                    <div className="flex gap-6 pt-2">
                        {[{ val: 'cr', label: 'Credit (CR)' }, { val: 'dr', label: 'Debit (DR)' }].map(opt => (
                            <label key={opt.val} className="flex cursor-pointer items-center gap-2 text-sm">
                                <input type="radio" name="payment_type" value={opt.val}
                                    checked={data.payment_type === opt.val}
                                    onChange={e => setData('payment_type', e.target.value)} />
                                <span className={opt.val === 'cr' ? 'text-green-700 font-medium' : 'text-red-700 font-medium'}>
                                    {opt.label}
                                </span>
                            </label>
                        ))}
                    </div>
                    {errors.payment_type && <p className="text-xs text-destructive">{errors.payment_type}</p>}
                </div>

                {/* Flight */}
                <div className="space-y-1">
                    <Label>Flight</Label>
                    <select value={data.flight_id} onChange={e => setData('flight_id', e.target.value)}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option value="">— None —</option>
                        {flights.map(f => <option key={f.id} value={String(f.id)}>{f.name}</option>)}
                    </select>
                    {errors.flight_id && <p className="text-xs text-destructive">{errors.flight_id}</p>}
                </div>

                {/* Bank */}
                <div className="space-y-1">
                    <Label>Bank</Label>
                    <select value={data.bank_id} onChange={e => setData('bank_id', e.target.value)}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option value="">— None —</option>
                        {banks.map(b => <option key={b.id} value={String(b.id)}>{b.name}</option>)}
                    </select>
                    {errors.bank_id && <p className="text-xs text-destructive">{errors.bank_id}</p>}
                </div>

                {/* Amount */}
                <div className="space-y-1">
                    <Label>Amount (PKR) <span className="text-destructive">*</span></Label>
                    <Input type="number" min="1" placeholder="0" value={data.amount}
                        onChange={e => setData('amount', e.target.value)} />
                    {errors.amount && <p className="text-xs text-destructive">{errors.amount}</p>}
                </div>

                {/* Detail */}
                <div className="space-y-1">
                    <Label>Detail <span className="text-destructive">*</span></Label>
                    <Input placeholder="Transaction detail" value={data.detail}
                        onChange={e => setData('detail', e.target.value)} maxLength={100} />
                    {errors.detail && <p className="text-xs text-destructive">{errors.detail}</p>}
                </div>
            </div>

            <div className="flex gap-3">
                <Button type="submit" disabled={processing} className="bg-teal-600 hover:bg-teal-700">
                    {submitLabel}
                </Button>
                <Button type="button" variant="outline" asChild>
                    <Link href="/admin/flight-transections">Cancel</Link>
                </Button>
            </div>
        </form>
    );
}
