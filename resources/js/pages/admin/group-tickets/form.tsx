import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from '@inertiajs/react';

export interface GtFormData {
    category: string; airline: string; from_city: string; to_city: string;
    booking_code: string; dep_date: string; dep_time: string; arr_time: string;
    flight_no: string; meal: string; baggage: string;
    price: string; seats_available: string; is_active: boolean;
}

interface Props {
    data: GtFormData;
    setData: (key: keyof GtFormData, value: string | boolean) => void;
    errors: Partial<Record<keyof GtFormData, string>>;
    processing: boolean;
    categories: string[];
    onSubmit: (e: React.FormEvent) => void;
    submitLabel: string;
}

export default function GroupTicketForm({
    data, setData, errors, processing, categories, onSubmit, submitLabel,
}: Props) {
    return (
        <form onSubmit={onSubmit} className="max-w-3xl space-y-6">
            <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">

                {/* Category */}
                <div className="space-y-1">
                    <Label>Category <span className="text-destructive">*</span></Label>
                    <select value={data.category} onChange={e => setData('category', e.target.value)}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm capitalize" required>
                        <option value="">— Select Category —</option>
                        {categories.map(c => (
                            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                        ))}
                    </select>
                    {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
                </div>

                {/* Airline */}
                <div className="space-y-1">
                    <Label>Airline <span className="text-destructive">*</span></Label>
                    <Input placeholder="e.g. Saudi Airline" value={data.airline}
                        onChange={e => setData('airline', e.target.value)} />
                    {errors.airline && <p className="text-xs text-destructive">{errors.airline}</p>}
                </div>

                {/* From City */}
                <div className="space-y-1">
                    <Label>From City <span className="text-destructive">*</span></Label>
                    <Input placeholder="e.g. LAHORE" value={data.from_city}
                        onChange={e => setData('from_city', e.target.value.toUpperCase())} />
                    {errors.from_city && <p className="text-xs text-destructive">{errors.from_city}</p>}
                </div>

                {/* To City */}
                <div className="space-y-1">
                    <Label>To City <span className="text-destructive">*</span></Label>
                    <Input placeholder="e.g. RIYADH" value={data.to_city}
                        onChange={e => setData('to_city', e.target.value.toUpperCase())} />
                    {errors.to_city && <p className="text-xs text-destructive">{errors.to_city}</p>}
                </div>

                {/* Booking Code */}
                <div className="space-y-1">
                    <Label>Booking Code</Label>
                    <Input placeholder="e.g. AG-10296" value={data.booking_code}
                        onChange={e => setData('booking_code', e.target.value)} />
                    {errors.booking_code && <p className="text-xs text-destructive">{errors.booking_code}</p>}
                </div>

                {/* Flight No */}
                <div className="space-y-1">
                    <Label>Flight No</Label>
                    <Input placeholder="e.g. SV737" value={data.flight_no}
                        onChange={e => setData('flight_no', e.target.value)} />
                    {errors.flight_no && <p className="text-xs text-destructive">{errors.flight_no}</p>}
                </div>

                {/* Departure Date */}
                <div className="space-y-1">
                    <Label>Departure Date <span className="text-destructive">*</span></Label>
                    <Input type="date" value={data.dep_date}
                        onChange={e => setData('dep_date', e.target.value)} />
                    {errors.dep_date && <p className="text-xs text-destructive">{errors.dep_date}</p>}
                </div>

                {/* Departure Time */}
                <div className="space-y-1">
                    <Label>Departure Time <span className="text-destructive">*</span></Label>
                    <Input type="time" value={data.dep_time}
                        onChange={e => setData('dep_time', e.target.value)} />
                    {errors.dep_time && <p className="text-xs text-destructive">{errors.dep_time}</p>}
                </div>

                {/* Arrival Time */}
                <div className="space-y-1">
                    <Label>Arrival Time <span className="text-destructive">*</span></Label>
                    <Input type="time" value={data.arr_time}
                        onChange={e => setData('arr_time', e.target.value)} />
                    {errors.arr_time && <p className="text-xs text-destructive">{errors.arr_time}</p>}
                </div>

                {/* Meal */}
                <div className="space-y-1">
                    <Label>Meal <span className="text-destructive">*</span></Label>
                    <div className="flex gap-6 pt-2">
                        {[{ val: 'yes', label: 'Yes' }, { val: 'no', label: 'No' }].map(opt => (
                            <label key={opt.val} className="flex cursor-pointer items-center gap-2 text-sm">
                                <input type="radio" name="meal" value={opt.val}
                                    checked={data.meal === opt.val}
                                    onChange={e => setData('meal', e.target.value)} />
                                {opt.label}
                            </label>
                        ))}
                    </div>
                    {errors.meal && <p className="text-xs text-destructive">{errors.meal}</p>}
                </div>

                {/* Baggage */}
                <div className="space-y-1">
                    <Label>Baggage</Label>
                    <Input placeholder="e.g. 23+7 KG" value={data.baggage}
                        onChange={e => setData('baggage', e.target.value)} />
                    {errors.baggage && <p className="text-xs text-destructive">{errors.baggage}</p>}
                </div>

                {/* Price */}
                <div className="space-y-1">
                    <Label>Price (PKR) <span className="text-destructive">*</span></Label>
                    <Input type="number" min="0" placeholder="0" value={data.price}
                        onChange={e => setData('price', e.target.value)} />
                    {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
                </div>

                {/* Seats Available */}
                <div className="space-y-1">
                    <Label>Seats Available <span className="text-destructive">*</span></Label>
                    <Input type="number" min="0" placeholder="0" value={data.seats_available}
                        onChange={e => setData('seats_available', e.target.value)} />
                    {errors.seats_available && <p className="text-xs text-destructive">{errors.seats_available}</p>}
                </div>

                {/* Active */}
                <div className="col-span-2 flex items-center gap-3 pt-1">
                    <input type="checkbox" id="is_active" checked={data.is_active}
                        onChange={e => setData('is_active', e.target.checked)}
                        className="h-4 w-4 rounded" />
                    <label htmlFor="is_active" className="text-sm font-medium">Active (visible on website)</label>
                </div>
            </div>

            <div className="flex gap-3">
                <Button type="submit" disabled={processing} className="bg-teal-600 hover:bg-teal-700">
                    {submitLabel}
                </Button>
                <Button type="button" variant="outline" asChild>
                    <Link href="/admin/group-tickets">Cancel</Link>
                </Button>
            </div>
        </form>
    );
}
