import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Printer } from 'lucide-react';
import { useState } from 'react';

interface HotelOption {
    id: number;
    name: string;
    city_name: string;
    room_type: string;
    price: number;
}

interface Rates {
    adult_rate: number;
    child_rate: number;
    infant_rate: number;
    sr_rate: number;
}

interface Props {
    agentHotels: Record<string, HotelOption[]>;
    rates: Rates;
}

interface HotelRow {
    city_name: string;
    nights: string;
    hotel_id: string;
    room_type: string;
    price: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Umrah Calculator', href: '/umrah-calculator' },
];

const emptyRow = (): HotelRow => ({
    city_name: '',
    nights: '',
    hotel_id: '',
    room_type: '',
    price: '',
});

function fmt(n: number) {
    return n.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export default function UmrahCalculator({ agentHotels, rates }: Props) {
    const [adults, setAdults]   = useState('1');
    const [children, setChildren] = useState('0');
    const [infants, setInfants]  = useState('0');
    const [srRate, setSrRate]    = useState(String(rates.sr_rate));
    const [rows, setRows]        = useState<HotelRow[]>([emptyRow()]);

    // All cities available to this agent
    const cities = Object.keys(agentHotels);

    function hotelsForCity(city: string): HotelOption[] {
        if (!city) return [];
        return agentHotels[city] ?? [];
    }

    function roomTypesForHotel(city: string, hotelId: string): string[] {
        return hotelsForCity(city)
            .filter(h => String(h.id) === hotelId)
            .map(h => h.room_type);
    }

    function updateRow(idx: number, field: keyof HotelRow, val: string) {
        setRows(prev => {
            const next = prev.map(r => ({ ...r }));
            const row = { ...next[idx], [field]: val };

            if (field === 'city_name') {
                row.hotel_id = '';
                row.room_type = '';
                row.price = '';
            }

            if (field === 'hotel_id') {
                const opts = hotelsForCity(next[idx].city_name);
                const first = opts.find(h => String(h.id) === val);
                row.room_type = first?.room_type ?? '';
                row.price     = first ? String(first.price) : '';
            }

            if (field === 'room_type' && row.hotel_id) {
                const found = hotelsForCity(next[idx].city_name)
                    .find(h => String(h.id) === row.hotel_id && h.room_type === val);
                if (found) row.price = String(found.price);
            }

            next[idx] = row;
            return next;
        });
    }

    function addRow()            { setRows(r => [...r, emptyRow()]); }
    function removeRow(idx: number) { setRows(r => r.filter((_, i) => i !== idx)); }

    // ── Calculations ────────────────────────────────────────────────────────────
    const sr  = parseFloat(srRate) || 0;
    const ad  = parseInt(adults)   || 0;
    const ch  = parseInt(children) || 0;
    const inf = parseInt(infants)  || 0;

    const totalPersons = ad + ch + inf;

    const personCostPkr =
        ad  * rates.adult_rate  * sr +
        ch  * rates.child_rate  * sr +
        inf * rates.infant_rate * sr;

    // Hotel cost: nights × price(SR) × sr_rate
    const hotelRows = rows.map(row => {
        const nights = parseInt(row.nights) || 0;
        const price  = parseFloat(row.price) || 0;
        const srCost = nights * price;
        const pkrCost = srCost * sr;
        return { ...row, nights, price, srCost, pkrCost };
    });

    const totalHotelSr  = hotelRows.reduce((s, r) => s + r.srCost, 0);
    const totalHotelPkr = hotelRows.reduce((s, r) => s + r.pkrCost, 0);

    // Makkah / Madina split nights
    const makkahNights = hotelRows
        .filter(r => r.city_name.toLowerCase() === 'makkah')
        .reduce((s, r) => s + r.nights, 0);
    const madinaNights = hotelRows
        .filter(r => r.city_name.toLowerCase() === 'madina')
        .reduce((s, r) => s + r.nights, 0);
    const totalNights = hotelRows.reduce((s, r) => s + r.nights, 0);

    const grandTotal = personCostPkr + totalHotelPkr;
    const perPerson  = totalPersons > 0 ? grandTotal / totalPersons : 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Umrah Calculator" />

            <style>{`
                @media print {
                    /* Hide sidebar, topbar, breadcrumbs, form controls, buttons */
                    aside, header, nav,
                    [data-sidebar], [data-sidebar-wrapper],
                    .no-print { display: none !important; }

                    body, html { background: white !important; }

                    /* Make the content full-width */
                    main, [data-main-content] { margin: 0 !important; padding: 0 !important; width: 100% !important; }

                    .print-only { display: block !important; }

                    /* Keep summary visible, hide form sections */
                    .print-hide { display: none !important; }

                    .print-summary {
                        break-inside: avoid;
                    }
                }
                .print-only { display: none; }
            `}</style>

            <div className="flex flex-col gap-6 p-6 max-w-5xl">
                {/* Print-only header */}
                <div className="print-only mb-4 border-b pb-3">
                    <h1 className="text-2xl font-bold">Umrah Cost Calculator</h1>
                    <p className="text-sm text-gray-500">AL Abrar Group of Travels &mdash; Printed on {new Date().toLocaleDateString('en-PK')}</p>
                </div>

                <div className="flex items-center justify-between no-print">
                    <h1 className="text-2xl font-semibold">Umrah Calculator</h1>
                    <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-2">
                        <Printer className="h-4 w-4" />
                        Print
                    </Button>
                </div>

                {/* ── Persons ─────────────────────────────────────────────── */}
                <div className="rounded-lg border p-4 print-hide">
                    <h2 className="mb-4 font-semibold text-primary">Number of Persons</h2>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <Label>Adults</Label>
                            <Input type="number" min="0" value={adults}
                                onChange={e => setAdults(e.target.value)} />
                            <p className="text-xs text-muted-foreground">
                                Rate: SR {rates.adult_rate} × {sr} = PKR {fmt(rates.adult_rate * sr)} / person
                            </p>
                        </div>
                        <div className="space-y-1">
                            <Label>Children</Label>
                            <Input type="number" min="0" value={children}
                                onChange={e => setChildren(e.target.value)} />
                            <p className="text-xs text-muted-foreground">
                                Rate: SR {rates.child_rate} × {sr} = PKR {fmt(rates.child_rate * sr)} / person
                            </p>
                        </div>
                        <div className="space-y-1">
                            <Label>Infants</Label>
                            <Input type="number" min="0" value={infants}
                                onChange={e => setInfants(e.target.value)} />
                            <p className="text-xs text-muted-foreground">
                                Rate: SR {rates.infant_rate} × {sr} = PKR {fmt(rates.infant_rate * sr)} / person
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── SR Rate ─────────────────────────────────────────────── */}
                <div className="rounded-lg border p-4 print-hide">
                    <h2 className="mb-4 font-semibold text-primary">Exchange Rate</h2>
                    <div className="max-w-xs space-y-1">
                        <Label>1 SR = PKR</Label>
                        <Input type="number" value={srRate} disabled className="bg-muted text-muted-foreground" />
                    </div>
                </div>

                {/* ── Hotel Rows ──────────────────────────────────────────── */}
                <div className="rounded-lg border p-4 print-hide">
                    <h2 className="mb-4 font-semibold text-primary">Hotels</h2>

                    {cities.length === 0 && (
                        <p className="text-sm text-amber-600 mb-3">
                            No hotels are assigned to your account yet. Contact admin.
                        </p>
                    )}

                    {/* Header */}
                    <div className="mb-2 grid grid-cols-[140px_80px_1fr_140px_100px_32px] gap-2 text-xs font-medium text-muted-foreground">
                        <span>City</span>
                        <span>Nights</span>
                        <span>Hotel</span>
                        <span>Room Type</span>
                        <span>Price / Night (SR)</span>
                        <span />
                    </div>

                    <div className="space-y-2">
                        {rows.map((row, idx) => {
                            const cityHotels = hotelsForCity(row.city_name);
                            // unique hotels (by id) for the dropdown
                            const uniqueHotels = cityHotels.filter(
                                (h, i, arr) => arr.findIndex(x => x.id === h.id) === i
                            );
                            const roomTypes = roomTypesForHotel(row.city_name, row.hotel_id);

                            return (
                                <div key={idx} className="grid grid-cols-[140px_80px_1fr_140px_100px_32px] gap-2 items-center">
                                    {/* City */}
                                    <select
                                        value={row.city_name}
                                        onChange={e => updateRow(idx, 'city_name', e.target.value)}
                                        className="rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                                    >
                                        <option value="">— City —</option>
                                        {cities.map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>

                                    {/* Nights */}
                                    <Input
                                        type="number" min="0"
                                        value={row.nights}
                                        onChange={e => updateRow(idx, 'nights', e.target.value)}
                                        placeholder="0"
                                    />

                                    {/* Hotel */}
                                    <select
                                        value={row.hotel_id}
                                        onChange={e => updateRow(idx, 'hotel_id', e.target.value)}
                                        className="rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                                        disabled={!row.city_name}
                                    >
                                        <option value="">— Hotel —</option>
                                        {uniqueHotels.map(h => (
                                            <option key={h.id} value={String(h.id)}>{h.name}</option>
                                        ))}
                                    </select>

                                    {/* Room Type */}
                                    <select
                                        value={row.room_type}
                                        onChange={e => updateRow(idx, 'room_type', e.target.value)}
                                        className="rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                                        disabled={!row.hotel_id}
                                    >
                                        <option value="">— Room —</option>
                                        {roomTypes.map(rt => (
                                            <option key={rt} value={rt}>{rt.replace(/_/g, ' ')}</option>
                                        ))}
                                    </select>

                                    {/* Price */}
                                    <Input
                                        type="number" min="0" step="0.01"
                                        value={row.price}
                                        onChange={e => updateRow(idx, 'price', e.target.value)}
                                        placeholder="0.00"
                                    />

                                    {/* Remove */}
                                    {rows.length > 1 ? (
                                        <button
                                            type="button"
                                            onClick={() => removeRow(idx)}
                                            className="flex h-8 w-8 items-center justify-center rounded bg-red-100 text-red-700 hover:bg-red-200 text-base font-bold"
                                        >−</button>
                                    ) : <span />}
                                </div>
                            );
                        })}
                    </div>

                    <Button type="button" variant="outline" size="sm" className="mt-3" onClick={addRow}>
                        + Add Hotel Row
                    </Button>
                </div>

                {/* ── Print-only: inputs summary ──────────────────────────── */}
                <div className="print-only rounded-lg border p-4 mb-2">
                    <h2 className="mb-3 font-semibold text-base">Package Details</h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
                        <div className="flex justify-between border-b py-1">
                            <span className="text-gray-500">Adults</span><span className="font-medium">{ad}</span>
                        </div>
                        <div className="flex justify-between border-b py-1">
                            <span className="text-gray-500">Children</span><span className="font-medium">{ch}</span>
                        </div>
                        <div className="flex justify-between border-b py-1">
                            <span className="text-gray-500">Infants</span><span className="font-medium">{inf}</span>
                        </div>
                        <div className="flex justify-between border-b py-1">
                            <span className="text-gray-500">SR Rate</span><span className="font-medium">PKR {fmt(sr)}</span>
                        </div>
                        <div className="flex justify-between border-b py-1">
                            <span className="text-gray-500">Makkah Nights</span><span className="font-medium">{makkahNights}</span>
                        </div>
                        <div className="flex justify-between border-b py-1">
                            <span className="text-gray-500">Madina Nights</span><span className="font-medium">{madinaNights}</span>
                        </div>
                    </div>

                    {hotelRows.filter(r => r.nights > 0 && r.price > 0).length > 0 && (
                        <div className="mt-3">
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Hotels</p>
                            <table className="w-full text-sm border-collapse">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="text-left p-1 border">City</th>
                                        <th className="text-left p-1 border">Hotel</th>
                                        <th className="text-left p-1 border">Room</th>
                                        <th className="text-right p-1 border">Nights</th>
                                        <th className="text-right p-1 border">Rate (SR)</th>
                                        <th className="text-right p-1 border">Cost (PKR)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {hotelRows.filter(r => r.nights > 0 && r.price > 0).map((r, i) => {
                                        const cityHotelsAll = agentHotels[r.city_name] ?? [];
                                        const hotelName = cityHotelsAll.find(h => String(h.id) === r.hotel_id)?.name ?? '—';
                                        return (
                                            <tr key={i}>
                                                <td className="p-1 border">{r.city_name}</td>
                                                <td className="p-1 border">{hotelName}</td>
                                                <td className="p-1 border">{r.room_type.replace(/_/g, ' ')}</td>
                                                <td className="p-1 border text-right">{r.nights}</td>
                                                <td className="p-1 border text-right">{fmt(r.price)}</td>
                                                <td className="p-1 border text-right">PKR {fmt(r.pkrCost)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* ── Summary ─────────────────────────────────────────────── */}
                <div className="rounded-lg border p-4 bg-muted/30 print-summary">
                    <h2 className="mb-4 font-semibold text-primary">Cost Summary</h2>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {/* Left: breakdown */}
                        <div className="space-y-3 text-sm">
                            <div className="font-medium text-muted-foreground uppercase text-xs tracking-wide">Persons</div>
                            <div className="flex justify-between">
                                <span>Adults ({ad}) × PKR {fmt(rates.adult_rate * sr)}</span>
                                <span className="font-medium">PKR {fmt(ad * rates.adult_rate * sr)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Children ({ch}) × PKR {fmt(rates.child_rate * sr)}</span>
                                <span className="font-medium">PKR {fmt(ch * rates.child_rate * sr)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Infants ({inf}) × PKR {fmt(rates.infant_rate * sr)}</span>
                                <span className="font-medium">PKR {fmt(inf * rates.infant_rate * sr)}</span>
                            </div>
                            <div className="flex justify-between border-t pt-2">
                                <span className="font-medium">Person Total</span>
                                <span className="font-semibold">PKR {fmt(personCostPkr)}</span>
                            </div>

                            <div className="font-medium text-muted-foreground uppercase text-xs tracking-wide pt-2">Hotels</div>
                            {hotelRows.map((r, i) => (
                                r.nights > 0 && r.price > 0 ? (
                                    <div key={i} className="flex justify-between">
                                        <span>
                                            {r.city_name || '—'} · {r.nights} nights × SR {r.price}
                                        </span>
                                        <span className="font-medium">PKR {fmt(r.pkrCost)}</span>
                                    </div>
                                ) : null
                            ))}
                            <div className="flex justify-between border-t pt-2">
                                <span className="font-medium">Hotel Total ({totalNights} nights, SR {fmt(totalHotelSr)})</span>
                                <span className="font-semibold">PKR {fmt(totalHotelPkr)}</span>
                            </div>
                        </div>

                        {/* Right: totals */}
                        <div className="flex flex-col gap-3">
                            <div className="rounded-lg border bg-background p-4 space-y-2 text-sm">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Makkah nights</span><span>{makkahNights}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Madina nights</span><span>{madinaNights}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Total nights</span><span>{totalNights}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Total persons</span><span>{totalPersons}</span>
                                </div>
                            </div>

                            <div className="rounded-lg border bg-teal-50 p-4 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span>Person cost</span>
                                    <span className="font-medium">PKR {fmt(personCostPkr)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Hotel cost</span>
                                    <span className="font-medium">PKR {fmt(totalHotelPkr)}</span>
                                </div>
                                <div className="flex justify-between border-t pt-3">
                                    <span className="text-lg font-bold">Grand Total</span>
                                    <span className="text-lg font-bold text-teal-700">PKR {fmt(grandTotal)}</span>
                                </div>
                                {totalPersons > 0 && (
                                    <div className="flex justify-between text-sm text-muted-foreground">
                                        <span>Per Person</span>
                                        <span className="font-medium">PKR {fmt(perPerson)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
