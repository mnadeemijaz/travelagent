import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface Agent     { id: number; name: string; }
interface Flight    { id: number; name: string; }
interface Sector    { id: number; name: string; }
interface Vehicle   { id: number; name: string; sharing: number; }
interface Trip      { id: number; name: string; vehicle_id: number; }
interface Hotel     { id: number; name: string; }
interface TourPkg   { id: number; name: string; }
interface Ziarat    { id: number; name: string; }
interface EligibleClient {
    id: number; sr_name: string | null; name: string; last_name: string | null;
    ppno: string | null; dob: string | null; age_group: string | null;
    account_pkg: string | null; group_code: string | null; group_name: string | null;
}
interface HotelRow { city_name: string; city_nights: string; check_in: string; check_out: string; hotel_id: string; room_type: string; [key: string]: string; }

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Vouchers', href: '/admin/vouchers' },
    { title: 'Create', href: '#' },
];

const ROOM_TYPES = ['sharing','single_bed','double_bed','triple_bed','quad_bed','five_bed','six_bed'];
const emptyHotel = (): HotelRow => ({ city_name: '', city_nights: '0', check_in: '', check_out: '', hotel_id: '', room_type: 'sharing' });

export default function VouchersCreate({
    agents, flights, sectors, vehicles, trips, hotels, tourPackages, ziarats,
}: {
    agents: Agent[]; flights: Flight[]; sectors: Sector[]; vehicles: Vehicle[];
    trips: Trip[]; hotels: Hotel[]; tourPackages: TourPkg[]; ziarats: Ziarat[];
}) {
    const { data, setData, post, processing, errors } = useForm<{
        agent_id: string; date: string;
        dep_date: string; dep_time: string; arv_date: string; arv_time: string;
        ret_date: string; ret_time: string; ret_pnr_no: string;
        dep_flight: string; dep_flight_no: string; dep_pnr_no: string;
        dep_sector1: string; dep_sector2: string;
        ret_flight: string; ret_flight_no: string;
        ret_sector1: string; ret_sector2: string;
        vehicle_id: string; trip_id: string; pkg_type: string;
        total_nights: string; gp_hd_no: string; remarks: string; contact: string;
        client_ids: number[];
        hotels: HotelRow[];
        ziarat_ids: number[];
    }>({
        agent_id: '', date: new Date().toISOString().substring(0, 10),
        dep_date: '', dep_time: '', arv_date: '', arv_time: '',
        ret_date: '', ret_time: '', ret_pnr_no: '',
        dep_flight: '', dep_flight_no: '', dep_pnr_no: '',
        dep_sector1: '', dep_sector2: 'JED',
        ret_flight: '', ret_flight_no: '',
        ret_sector1: 'JED', ret_sector2: '',
        vehicle_id: '', trip_id: '', pkg_type: '',
        total_nights: '0', gp_hd_no: '', remarks: '', contact: 'package_with_hotel',
        client_ids: [],
        hotels: [emptyHotel()],
        ziarat_ids: [],
    });

    const [showPaxModal, setShowPaxModal] = useState(false);
    const [eligibleClients, setEligibleClients] = useState<EligibleClient[]>([]);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

    function loadClients() {
        if (!data.agent_id) return;
        fetch(`/admin/vouchers/eligible-clients?agent_id=${data.agent_id}`)
            .then(r => r.json())
            .then(setEligibleClients);
    }

    function openPax() { loadClients(); setShowPaxModal(true); }
    function closePax() { setShowPaxModal(false); }
    function confirmPax() {
        setData('client_ids', Array.from(selectedIds));
        closePax();
    }

    function toggleClient(id: number) {
        setSelectedIds(prev => {
            const n = new Set(prev);
            n.has(id) ? n.delete(id) : n.add(id);
            return n;
        });
    }

    // Sync selectedIds with form data when modal opens
    useEffect(() => {
        if (showPaxModal) setSelectedIds(new Set(data.client_ids));
    }, [showPaxModal]);

    // Hotels helpers
    function addHotelRow() { setData('hotels', [...data.hotels, emptyHotel()]); }
    function removeHotelRow(idx: number) { setData('hotels', data.hotels.filter((_, i) => i !== idx)); }
    function setHotel(idx: number, field: keyof HotelRow, val: string) {
        const rows = [...data.hotels];
        rows[idx] = { ...rows[idx], [field]: val };
        setData('hotels', rows);
    }

    // Ziarat toggle
    function toggleZiarat(id: number) {
        const arr = data.ziarat_ids.includes(id)
            ? data.ziarat_ids.filter(z => z !== id)
            : [...data.ziarat_ids, id];
        setData('ziarat_ids', arr);
    }

    // Count total nights
    const totalNights = data.hotels.reduce((s, h) => s + (parseInt(h.city_nights) || 0), 0);

    function submit(e: React.FormEvent) {
        e.preventDefault();
        setData('total_nights', String(totalNights));
        post('/admin/vouchers');
    }

    const filteredTrips = data.vehicle_id
        ? trips.filter(t => t.vehicle_id === parseInt(data.vehicle_id))
        : trips;

    const selectedClients = eligibleClients.filter(c => data.client_ids.includes(c.id));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Voucher" />
            <div className="flex flex-col gap-5 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Create Voucher</h1>
                    <Button variant="outline" asChild><Link href="/admin/vouchers">Back</Link></Button>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* Agent + Date */}
                    <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
                        <div className="space-y-1">
                            <Label>Agent / Party <span className="text-destructive">*</span></Label>
                            <select value={data.agent_id} onChange={e => setData('agent_id', e.target.value)}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
                                <option value="">— Select Agent —</option>
                                {agents.map(a => <option key={a.id} value={String(a.id)}>{a.name}</option>)}
                            </select>
                            {errors.agent_id && <p className="text-xs text-destructive">{errors.agent_id}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label>Voucher Date</Label>
                            <Input type="date" value={data.date} onChange={e => setData('date', e.target.value)} />
                        </div>
                    </div>

                    {/* Flight Information */}
                    <div className="rounded-lg border p-4">
                        <h2 className="mb-3 font-semibold text-primary">Flight Information</h2>

                        <div className="mb-4">
                            <h3 className="mb-2 text-sm font-medium text-muted-foreground">Departure</h3>
                            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                                <div className="space-y-1">
                                    <Label>Dep. Date</Label>
                                    <Input type="date" value={data.dep_date} onChange={e => setData('dep_date', e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <Label>Dep. Time</Label>
                                    <Input type="time" value={data.dep_time} onChange={e => setData('dep_time', e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <Label>Arrival Date</Label>
                                    <Input type="date" value={data.arv_date} onChange={e => setData('arv_date', e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <Label>Arrival Time</Label>
                                    <Input type="time" value={data.arv_time} onChange={e => setData('arv_time', e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <Label>Sector From</Label>
                                    <select value={data.dep_sector1} onChange={e => setData('dep_sector1', e.target.value)}
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                        <option value="">Select</option>
                                        {sectors.map(s => <option key={s.id} value={String(s.id)}>{s.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <Label>Sector To</Label>
                                    <select value={data.dep_sector2} onChange={e => setData('dep_sector2', e.target.value)}
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                        <option value="JED">JED</option>
                                        <option value="MED">MED</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <Label>Flight</Label>
                                    <select value={data.dep_flight} onChange={e => setData('dep_flight', e.target.value)}
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                        <option value="">Select</option>
                                        {flights.map(f => <option key={f.id} value={String(f.id)}>{f.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <Label>Flight No</Label>
                                    <Input value={data.dep_flight_no} onChange={e => setData('dep_flight_no', e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <Label>PNR No</Label>
                                    <Input value={data.dep_pnr_no} onChange={e => setData('dep_pnr_no', e.target.value)} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="mb-2 text-sm font-medium text-muted-foreground">Return</h3>
                            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                                <div className="space-y-1">
                                    <Label>Ret. Date</Label>
                                    <Input type="date" value={data.ret_date} onChange={e => setData('ret_date', e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <Label>Ret. Time</Label>
                                    <Input type="time" value={data.ret_time} onChange={e => setData('ret_time', e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <Label>Sector From</Label>
                                    <select value={data.ret_sector1} onChange={e => setData('ret_sector1', e.target.value)}
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                        <option value="JED">JED</option>
                                        <option value="MED">MED</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <Label>Sector To</Label>
                                    <select value={data.ret_sector2} onChange={e => setData('ret_sector2', e.target.value)}
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                        <option value="">Select</option>
                                        {sectors.map(s => <option key={s.id} value={String(s.id)}>{s.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <Label>Flight</Label>
                                    <select value={data.ret_flight} onChange={e => setData('ret_flight', e.target.value)}
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                        <option value="">Select</option>
                                        {flights.map(f => <option key={f.id} value={String(f.id)}>{f.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <Label>Flight No</Label>
                                    <Input value={data.ret_flight_no} onChange={e => setData('ret_flight_no', e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <Label>PNR No</Label>
                                    <Input value={data.ret_pnr_no} onChange={e => setData('ret_pnr_no', e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pax */}
                    <div className="rounded-lg border p-4">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="font-semibold text-primary">Mautamers / Pax</h2>
                            <Button type="button" variant="outline" size="sm" onClick={openPax}>Select Pax</Button>
                        </div>
                        {data.client_ids.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs">
                                    <thead className="bg-muted/50">
                                        <tr>
                                            <th className="px-2 py-1 text-left">Name</th>
                                            <th className="px-2 py-1 text-left">PP No</th>
                                            <th className="px-2 py-1 text-left">DOB</th>
                                            <th className="px-2 py-1 text-left">Age Group</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {selectedClients.map(c => (
                                            <tr key={c.id}>
                                                <td className="px-2 py-1">{c.sr_name} {c.name} {c.last_name}</td>
                                                <td className="px-2 py-1">{c.ppno}</td>
                                                <td className="px-2 py-1">{c.dob?.substring(0, 10)}</td>
                                                <td className="px-2 py-1 capitalize">{c.age_group}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No pax selected. Select an agent first, then click "Select Pax".</p>
                        )}
                    </div>

                    {/* Transportation */}
                    <div className="rounded-lg border p-4">
                        <h2 className="mb-3 font-semibold text-primary">Transportation</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Vehicle Type</Label>
                                <div className="flex flex-wrap gap-4">
                                    {vehicles.map(v => (
                                        <label key={v.id} className="flex items-center gap-1.5 text-sm">
                                            <input type="radio" name="vehicle_id" value={String(v.id)}
                                                checked={data.vehicle_id === String(v.id)}
                                                onChange={e => { setData('vehicle_id', e.target.value); setData('trip_id', ''); }} />
                                            {v.name}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label>Trip</Label>
                                <select value={data.trip_id} onChange={e => setData('trip_id', e.target.value)}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                    <option value="">— Select Trip —</option>
                                    {filteredTrips.map(t => <option key={t.id} value={String(t.id)}>{t.name}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Package / Hotels */}
                    <div className="rounded-lg border p-4">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="font-semibold text-primary">Package Detail</h2>
                            <div className="flex items-center gap-3">
                                <div className="space-y-1">
                                    <Label>Package</Label>
                                    <select value={data.pkg_type} onChange={e => setData('pkg_type', e.target.value)}
                                        className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                                        <option value="">All</option>
                                        {tourPackages.map(p => <option key={p.id} value={String(p.id)}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <Label>Group Head Phone</Label>
                                    <Input value={data.gp_hd_no} onChange={e => setData('gp_hd_no', e.target.value)} maxLength={30} className="w-36" />
                                </div>
                            </div>
                        </div>

                        {/* Hotel rows */}
                        <div className="space-y-2">
                            <div className="grid grid-cols-6 gap-2 text-xs font-medium text-muted-foreground">
                                <span>City</span><span>Nights</span><span>Check In</span><span>Check Out</span><span>Hotel</span><span>Room Type</span>
                            </div>
                            {data.hotels.map((row, idx) => (
                                <div key={idx} className="grid grid-cols-6 gap-2 items-center">
                                    <select value={row.city_name} onChange={e => setHotel(idx, 'city_name', e.target.value)}
                                        className="rounded-md border border-input bg-background px-2 py-1.5 text-sm">
                                        <option value="">Select City</option>
                                        <option value="Makkah">Makkah</option>
                                        <option value="Madina">Madina</option>
                                    </select>
                                    <Input type="number" min={0} value={row.city_nights}
                                        onChange={e => setHotel(idx, 'city_nights', e.target.value)} />
                                    <Input type="date" value={row.check_in}
                                        onChange={e => setHotel(idx, 'check_in', e.target.value)} />
                                    <Input type="date" value={row.check_out}
                                        onChange={e => setHotel(idx, 'check_out', e.target.value)} />
                                    <select value={row.hotel_id} onChange={e => setHotel(idx, 'hotel_id', e.target.value)}
                                        className="rounded-md border border-input bg-background px-2 py-1.5 text-sm">
                                        <option value="">Select</option>
                                        {hotels.map(h => <option key={h.id} value={String(h.id)}>{h.name}</option>)}
                                    </select>
                                    <div className="flex gap-1">
                                        <select value={row.room_type} onChange={e => setHotel(idx, 'room_type', e.target.value)}
                                            className="flex-1 rounded-md border border-input bg-background px-2 py-1.5 text-sm">
                                            {ROOM_TYPES.map(rt => <option key={rt} value={rt}>{rt.replace('_', ' ')}</option>)}
                                        </select>
                                        {idx > 0 && (
                                            <button type="button" onClick={() => removeHotelRow(idx)}
                                                className="rounded bg-red-100 px-1.5 text-red-700 hover:bg-red-200">−</button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-2 flex items-center gap-4">
                            <Button type="button" variant="outline" size="sm" onClick={addHotelRow}>+ Add Hotel</Button>
                            <span className="text-sm text-muted-foreground">Total Nights: <strong>{totalNights}</strong></span>
                        </div>
                    </div>

                    {/* Ziarat + Remarks */}
                    <div className="rounded-lg border p-4">
                        <h2 className="mb-3 font-semibold text-primary">Ziarat &amp; Remarks</h2>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Ziarat</Label>
                                <div className="space-y-1">
                                    {ziarats.map(z => (
                                        <label key={z.id} className="flex items-center gap-2 text-sm">
                                            <input type="checkbox" checked={data.ziarat_ids.includes(z.id)}
                                                onChange={() => toggleZiarat(z.id)} />
                                            {z.name}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <Label>Remarks</Label>
                                    <textarea value={data.remarks} onChange={e => setData('remarks', e.target.value)}
                                        rows={3} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                                </div>
                                <div className="space-y-1">
                                    <Label>Contact Type</Label>
                                    <div className="flex gap-4 text-sm">
                                        {['package_with_hotel','only_transport'].map(ct => (
                                            <label key={ct} className="flex items-center gap-1.5">
                                                <input type="radio" name="contact" value={ct}
                                                    checked={data.contact === ct}
                                                    onChange={e => setData('contact', e.target.value)} />
                                                {ct.replace('_', ' ')}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing} className="bg-teal-600 hover:bg-teal-700">Save Voucher</Button>
                        <Button type="button" variant="destructive" asChild>
                            <Link href="/admin/vouchers">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>

            {/* Pax Selection Modal */}
            {showPaxModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-4xl rounded-lg bg-background shadow-lg flex flex-col" style={{ maxHeight: '80vh' }}>
                        <div className="flex items-center justify-between border-b px-4 py-3">
                            <h2 className="font-semibold">Select Pax</h2>
                            <button onClick={closePax} className="text-muted-foreground hover:text-foreground">✕</button>
                        </div>
                        <div className="flex-1 overflow-auto p-4">
                            <table className="w-full text-xs">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="px-2 py-2 text-left">Select</th>
                                        <th className="px-2 py-2 text-left">Name</th>
                                        <th className="px-2 py-2 text-left">PP No</th>
                                        <th className="px-2 py-2 text-left">DOB</th>
                                        <th className="px-2 py-2 text-left">Age Group</th>
                                        <th className="px-2 py-2 text-left">Account PKG</th>
                                        <th className="px-2 py-2 text-left">Group Code</th>
                                        <th className="px-2 py-2 text-left">Group Name</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {eligibleClients.length === 0 && (
                                        <tr><td colSpan={8} className="px-4 py-6 text-center text-muted-foreground">
                                            {data.agent_id ? 'No eligible clients (visa approved, no voucher yet).' : 'Select an agent first.'}
                                        </td></tr>
                                    )}
                                    {eligibleClients.map(c => (
                                        <tr key={c.id} className="hover:bg-muted/30 cursor-pointer" onClick={() => toggleClient(c.id)}>
                                            <td className="px-2 py-1.5">
                                                <input type="checkbox" checked={selectedIds.has(c.id)} onChange={() => toggleClient(c.id)} onClick={e => e.stopPropagation()} />
                                            </td>
                                            <td className="px-2 py-1.5">{c.sr_name} {c.name} {c.last_name}</td>
                                            <td className="px-2 py-1.5">{c.ppno}</td>
                                            <td className="px-2 py-1.5">{c.dob?.substring(0, 10)}</td>
                                            <td className="px-2 py-1.5 capitalize">{c.age_group}</td>
                                            <td className="px-2 py-1.5">{c.account_pkg}</td>
                                            <td className="px-2 py-1.5">{c.group_code}</td>
                                            <td className="px-2 py-1.5">{c.group_name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-end gap-2 border-t px-4 py-3">
                            <Button variant="outline" onClick={closePax}>Close</Button>
                            <Button onClick={confirmPax}>Confirm ({selectedIds.size} selected)</Button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
