import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface Agent   { id: number; name: string; }
interface Flight  { id: number; name: string; }
interface Sector  { id: number; name: string; }
interface Vehicle { id: number; name: string; sharing: number; }
interface Trip    { id: number; name: string; vehicle_id: number; }
interface AgentHotelOption { id: number; name: string; city_name: string; room_type: string; price: number; }
interface TourPkg    { id: number; name: string; }
interface Ziarat     { id: number; name: string; amount: number; }
interface DefaultRates { adult_rate: number; child_rate: number; infant_rate: number; sr_rate: number; }

interface VoucherHotelRow {
    city_name: string; city_nights: number; check_in: string | null; check_out: string | null;
    hotel_id: number | null; price: number | null; room_type: string | null;
}
interface VoucherData {
    id: number; agent_id: number | null; date: string | null;
    dep_date: string | null; dep_time: string | null; arv_date: string | null; arv_time: string | null;
    ret_date: string | null; ret_time: string | null; ret_pnr_no: string | null;
    dep_flight: number | null; dep_flight_no: string | null; dep_pnr_no: string | null;
    dep_sector1: number | null; dep_sector2: string | null;
    ret_flight: number | null; ret_flight_no: string | null;
    ret_sector1: string | null; ret_sector2: number | null;
    vehicle_id: number | null; trip_id: number | null; pkg_type: number | null;
    total_nights: number; gp_hd_no: string | null; remarks: string | null; contact: string | null;
    adult_rate: number | null; child_rate: number | null; infant_rate: number | null; sr_rate: number | null;
    hotels: VoucherHotelRow[];
    clients: { id: number; name: string; last_name: string | null; ppno: string | null; age_group: string | null }[];
    ziarats: { id: number }[];
}

interface HotelRow {
    city_name: string; city_nights: string; check_in: string; check_out: string;
    hotel_id: string; price: string; room_type: string;
    [key: string]: string;
}

const ROOM_TYPES = ['sharing','single_bed','double_bed','triple_bed','quad_bed','five_bed','six_bed'];
const emptyHotel = (): HotelRow => ({ city_name: '', city_nights: '0', check_in: '', check_out: '', hotel_id: '', price: '', room_type: 'sharing' });
function d(v: string | null) { return v ? v.substring(0, 10) : ''; }

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Vouchers', href: '/admin/vouchers' },
    { title: 'Edit', href: '#' },
];

export default function VouchersEdit({
    voucher, agents, isAgent, agentHotels, flights, sectors, vehicles, trips,
    tourPackages, ziarats, selectedClients, selectedZiarats, defaultRates,
}: {
    voucher: VoucherData; agents: Agent[]; isAgent: boolean;
    agentHotels: Record<string, AgentHotelOption[]>;
    flights: Flight[]; sectors: Sector[]; vehicles: Vehicle[]; trips: Trip[];
    tourPackages: TourPkg[]; ziarats: Ziarat[];
    selectedClients: number[]; selectedZiarats: number[];
    defaultRates: DefaultRates;
}) {
    const { data, setData, put, processing, errors } = useForm<{
        agent_id: string; date: string;
        dep_date: string; dep_time: string; arv_date: string; arv_time: string;
        ret_date: string; ret_time: string; ret_pnr_no: string;
        dep_flight: string; dep_flight_no: string; dep_pnr_no: string;
        dep_sector1: string; dep_sector2: string;
        ret_flight: string; ret_flight_no: string;
        ret_sector1: string; ret_sector2: string;
        vehicle_id: string; trip_id: string; pkg_type: string;
        total_nights: string; gp_hd_no: string; remarks: string; contact: string;
        adult_rate: string; child_rate: string; infant_rate: string; sr_rate: string;
        client_ids: number[];
        hotels: HotelRow[];
        ziarat_ids: number[];
    }>({
        agent_id: voucher.agent_id ? String(voucher.agent_id) : '',
        date: d(voucher.date),
        dep_date: d(voucher.dep_date), dep_time: voucher.dep_time ?? '',
        arv_date: d(voucher.arv_date), arv_time: voucher.arv_time ?? '',
        ret_date: d(voucher.ret_date), ret_time: voucher.ret_time ?? '',
        ret_pnr_no: voucher.ret_pnr_no ?? '',
        dep_flight: voucher.dep_flight ? String(voucher.dep_flight) : '',
        dep_flight_no: voucher.dep_flight_no ?? '',
        dep_pnr_no: voucher.dep_pnr_no ?? '',
        dep_sector1: voucher.dep_sector1 ? String(voucher.dep_sector1) : '',
        dep_sector2: voucher.dep_sector2 ?? 'JED',
        ret_flight: voucher.ret_flight ? String(voucher.ret_flight) : '',
        ret_flight_no: voucher.ret_flight_no ?? '',
        ret_sector1: voucher.ret_sector1 ?? 'JED',
        ret_sector2: voucher.ret_sector2 ? String(voucher.ret_sector2) : '',
        vehicle_id: voucher.vehicle_id ? String(voucher.vehicle_id) : '',
        trip_id: voucher.trip_id ? String(voucher.trip_id) : '',
        pkg_type: voucher.pkg_type ? String(voucher.pkg_type) : '',
        total_nights: String(voucher.total_nights ?? 0),
        gp_hd_no: voucher.gp_hd_no ?? '',
        remarks: voucher.remarks ?? '',
        contact: voucher.contact ?? 'package_with_hotel',
        adult_rate:  String(voucher.adult_rate  ?? defaultRates.adult_rate),
        child_rate:  String(voucher.child_rate   ?? defaultRates.child_rate),
        infant_rate: String(voucher.infant_rate  ?? defaultRates.infant_rate),
        sr_rate:     String(voucher.sr_rate      ?? defaultRates.sr_rate),
        client_ids: selectedClients,
        hotels: voucher.hotels.length > 0
            ? voucher.hotels.map(h => ({
                city_name: h.city_name ?? '',
                city_nights: String(h.city_nights),
                check_in: d(h.check_in),
                check_out: d(h.check_out),
                hotel_id: h.hotel_id ? String(h.hotel_id) : '',
                price: h.price != null ? String(h.price) : '',
                room_type: h.room_type ?? 'sharing',
            }))
            : [emptyHotel()],
        ziarat_ids: selectedZiarats,
    });

    // Available hotels for the currently selected agent
    const availableHotels: AgentHotelOption[] = agentHotels[data.agent_id] ?? [];

    function handleAgentChange(agentId: string) {
        setData(d => ({ ...d, agent_id: agentId, hotels: [emptyHotel()] }));
    }

    function addHotelRow() { setData('hotels', [...data.hotels, emptyHotel()]); }
    function removeHotelRow(idx: number) { setData('hotels', data.hotels.filter((_, i) => i !== idx)); }
    function setHotel(idx: number, field: keyof HotelRow, val: string) {
        const rows = [...data.hotels];
        const updated = { ...rows[idx], [field]: val };

        if (field === 'check_in' || field === 'check_out') {
            const ci = field === 'check_in' ? val : updated.check_in;
            const co = field === 'check_out' ? val : updated.check_out;
            if (ci && co) {
                const nights = Math.round((new Date(co).getTime() - new Date(ci).getTime()) / 86400000);
                if (nights >= 0) updated.city_nights = String(nights);
            }
        }

        if (field === 'city_name') { updated.hotel_id = ''; updated.price = ''; updated.room_type = 'sharing'; }

        // Auto-fill room_type (first available) + price when hotel is selected
        if (field === 'hotel_id' && val) {
            const hotelEntries = availableHotels.filter(h => String(h.id) === val);
            const firstEntry = hotelEntries[0];
            if (firstEntry) {
                updated.room_type = firstEntry.room_type;
                updated.price = String(firstEntry.price);
            } else {
                updated.price = '';
            }
        }

        // Auto-fill price when room type changes (and hotel is already selected)
        if (field === 'room_type' && updated.hotel_id) {
            const found = availableHotels.find(h => String(h.id) === updated.hotel_id && h.room_type === val);
            if (found) updated.price = String(found.price);
        }

        rows[idx] = updated;
        setData('hotels', rows);
    }

    function cityHotels(cityName: string) {
        const filtered = cityName
            ? availableHotels.filter(h => h.city_name.toLowerCase() === cityName.toLowerCase())
            : availableHotels;
        // Deduplicate by hotel id (each hotel may appear once per room type)
        const seen = new Set<number>();
        return filtered.filter(h => { if (seen.has(h.id)) return false; seen.add(h.id); return true; });
    }

    function hotelRoomTypes(hotelId: string): string[] {
        if (!hotelId) return [];
        return availableHotels.filter(h => String(h.id) === hotelId).map(h => h.room_type);
    }

    function toggleZiarat(id: number) {
        const arr = data.ziarat_ids.includes(id) ? data.ziarat_ids.filter(z => z !== id) : [...data.ziarat_ids, id];
        setData('ziarat_ids', arr);
    }

    const totalNights = data.hotels.reduce((s, h) => s + (parseInt(h.city_nights) || 0), 0);
    const filteredTrips = data.vehicle_id ? trips.filter(t => t.vehicle_id === parseInt(data.vehicle_id)) : trips;

    function submit(e: React.FormEvent) {
        e.preventDefault();
        setData('total_nights', String(totalNights));
        put(`/admin/vouchers/${voucher.id}`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Voucher" />
            <div className="flex flex-col gap-5 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Edit Voucher #{voucher.id}</h1>
                    <Button variant="outline" asChild><Link href="/admin/vouchers">Back</Link></Button>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* Agent + Date */}
                    <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
                        <div className="space-y-1">
                            <Label>Agent / Party</Label>
                            {isAgent ? (
                                <div className="w-full rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground">
                                    {agents[0]?.name ?? '—'}
                                </div>
                            ) : (
                                <select value={data.agent_id} onChange={e => handleAgentChange(e.target.value)}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
                                    <option value="">— Select —</option>
                                    {agents.map(a => <option key={a.id} value={String(a.id)}>{a.name}</option>)}
                                </select>
                            )}
                        </div>
                        <div className="space-y-1">
                            <Label>Voucher Date</Label>
                            <Input type="date" value={data.date} onChange={e => setData('date', e.target.value)} />
                        </div>
                    </div>

                    {/* Flight */}
                    <div className="rounded-lg border p-4">
                        <h2 className="mb-3 font-semibold text-primary">Flight Information</h2>
                        <div className="mb-4">
                            <h3 className="mb-2 text-sm font-medium text-muted-foreground">Departure</h3>
                            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                                <div className="space-y-1"><Label>Dep. Date</Label><Input type="date" value={data.dep_date} onChange={e => setData('dep_date', e.target.value)} /></div>
                                <div className="space-y-1"><Label>Dep. Time</Label><Input type="time" value={data.dep_time} onChange={e => setData('dep_time', e.target.value)} /></div>
                                <div className="space-y-1"><Label>Arrival Date</Label><Input type="date" value={data.arv_date} onChange={e => setData('arv_date', e.target.value)} /></div>
                                <div className="space-y-1"><Label>Arrival Time</Label><Input type="time" value={data.arv_time} onChange={e => setData('arv_time', e.target.value)} /></div>
                                <div className="space-y-1"><Label>Sector From</Label>
                                    <select value={data.dep_sector1} onChange={e => setData('dep_sector1', e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                        <option value="">Select</option>{sectors.map(s => <option key={s.id} value={String(s.id)}>{s.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1"><Label>Sector To</Label>
                                    <select value={data.dep_sector2} onChange={e => setData('dep_sector2', e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                        <option value="JED">JED</option><option value="MED">MED</option>
                                    </select>
                                </div>
                                <div className="space-y-1"><Label>Flight</Label>
                                    <select value={data.dep_flight} onChange={e => setData('dep_flight', e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                        <option value="">Select</option>{flights.map(f => <option key={f.id} value={String(f.id)}>{f.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1"><Label>Flight No</Label><Input value={data.dep_flight_no} onChange={e => setData('dep_flight_no', e.target.value)} /></div>
                                <div className="space-y-1"><Label>PNR No</Label><Input value={data.dep_pnr_no} onChange={e => setData('dep_pnr_no', e.target.value)} /></div>
                            </div>
                        </div>
                        <div>
                            <h3 className="mb-2 text-sm font-medium text-muted-foreground">Return</h3>
                            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                                <div className="space-y-1"><Label>Ret. Date</Label><Input type="date" value={data.ret_date} onChange={e => setData('ret_date', e.target.value)} /></div>
                                <div className="space-y-1"><Label>Ret. Time</Label><Input type="time" value={data.ret_time} onChange={e => setData('ret_time', e.target.value)} /></div>
                                <div className="space-y-1"><Label>Sector From</Label>
                                    <select value={data.ret_sector1} onChange={e => setData('ret_sector1', e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                        <option value="JED">JED</option><option value="MED">MED</option>
                                    </select>
                                </div>
                                <div className="space-y-1"><Label>Sector To</Label>
                                    <select value={data.ret_sector2} onChange={e => setData('ret_sector2', e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                        <option value="">Select</option>{sectors.map(s => <option key={s.id} value={String(s.id)}>{s.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1"><Label>Flight</Label>
                                    <select value={data.ret_flight} onChange={e => setData('ret_flight', e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                        <option value="">Select</option>{flights.map(f => <option key={f.id} value={String(f.id)}>{f.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1"><Label>Flight No</Label><Input value={data.ret_flight_no} onChange={e => setData('ret_flight_no', e.target.value)} /></div>
                                <div className="space-y-1"><Label>PNR No</Label><Input value={data.ret_pnr_no} onChange={e => setData('ret_pnr_no', e.target.value)} /></div>
                            </div>
                        </div>
                    </div>

                    {/* Current Pax */}
                    <div className="rounded-lg border p-4">
                        <h2 className="mb-2 font-semibold text-primary">Mautamers ({voucher.clients.length})</h2>
                        {voucher.clients.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {voucher.clients.map(c => (
                                    <span key={c.id} className="rounded-full bg-muted px-2.5 py-1 text-xs">
                                        {c.name} {c.last_name} ({c.age_group})
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No clients attached.</p>
                        )}
                    </div>

                    {/* Transportation */}
                    <div className="rounded-lg border p-4">
                        <h2 className="mb-3 font-semibold text-primary">Transportation</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Vehicle</Label>
                                <div className="flex flex-wrap gap-4">
                                    {vehicles.map(v => (
                                        <label key={v.id} className="flex items-center gap-1.5 text-sm">
                                            <input type="radio" name="vehicle_id" value={String(v.id)} checked={data.vehicle_id === String(v.id)}
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
                                    <option value="">— Select —</option>
                                    {filteredTrips.map(t => <option key={t.id} value={String(t.id)}>{t.name}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Package / Hotels */}
                    <div className="rounded-lg border p-4">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="font-semibold text-primary">Package Detail</h2>
                            <div className="flex gap-3">
                                <select value={data.pkg_type} onChange={e => setData('pkg_type', e.target.value)}
                                    className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                                    <option value="">All</option>
                                    {tourPackages.map(p => <option key={p.id} value={String(p.id)}>{p.name}</option>)}
                                </select>
                                <Input value={data.gp_hd_no} onChange={e => setData('gp_hd_no', e.target.value)} placeholder="Group Head Phone" maxLength={30} className="w-36" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="grid grid-cols-7 gap-2 text-xs font-medium text-muted-foreground">
                                <span>City</span><span>Nights</span><span>Check In</span><span>Check Out</span><span>Hotel</span><span>Price / Night</span><span>Room Type</span>
                            </div>
                            {data.hotels.map((row, idx) => (
                                <div key={idx} className="grid grid-cols-7 gap-2 items-center">
                                    <select value={row.city_name} onChange={e => setHotel(idx, 'city_name', e.target.value)}
                                        className="rounded-md border border-input bg-background px-2 py-1.5 text-sm">
                                        <option value="">City</option>
                                        <option value="Makkah">Makkah</option>
                                        <option value="Madina">Madina</option>
                                    </select>
                                    <Input type="number" min={0} value={row.city_nights} onChange={e => setHotel(idx, 'city_nights', e.target.value)} />
                                    <Input type="date" value={row.check_in} onChange={e => setHotel(idx, 'check_in', e.target.value)} />
                                    <Input type="date" value={row.check_out} onChange={e => setHotel(idx, 'check_out', e.target.value)} />
                                    <select value={row.hotel_id} onChange={e => setHotel(idx, 'hotel_id', e.target.value)}
                                        className="rounded-md border border-input bg-background px-2 py-1.5 text-sm">
                                        <option value="">— Hotel —</option>
                                        {cityHotels(row.city_name).map(h => (
                                            <option key={h.id} value={String(h.id)}>{h.name}</option>
                                        ))}
                                    </select>
                                    <Input
                                        type="number" min={0} step="0.01"
                                        value={row.price}
                                        onChange={e => setHotel(idx, 'price', e.target.value)}
                                        placeholder="0.00"
                                        className={row.price ? '' : 'border-amber-300'}
                                    />
                                    <div className="flex gap-1">
                                        <select value={row.room_type} onChange={e => setHotel(idx, 'room_type', e.target.value)}
                                            className="flex-1 rounded-md border border-input bg-background px-2 py-1.5 text-sm">
                                            {(hotelRoomTypes(row.hotel_id).length > 0 ? hotelRoomTypes(row.hotel_id) : ROOM_TYPES).map(rt => (
                                                <option key={rt} value={rt}>{rt.replace(/_/g, ' ')}</option>
                                            ))}
                                        </select>
                                        {idx > 0 && <button type="button" onClick={() => removeHotelRow(idx)} className="rounded bg-red-100 px-1.5 text-red-700 hover:bg-red-200">−</button>}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-2 flex items-center gap-4">
                            <Button type="button" variant="outline" size="sm" onClick={addHotelRow}>+ Add Hotel</Button>
                            <span className="text-sm text-muted-foreground">Total Nights: <strong>{totalNights}</strong></span>
                        </div>
                    </div>

                    {/* Rates */}
                    <div className="rounded-lg border p-4">
                        <h2 className="mb-3 font-semibold text-primary">Rates</h2>
                        {(() => {
                            const sr = parseFloat(data.sr_rate) || 1;
                            return (
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                    <div className="space-y-1">
                                        <Label>Adult Rate</Label>
                                        <Input type="number" value={data.adult_rate} disabled
                                            className="bg-muted text-muted-foreground" placeholder="0.00" />
                                        <p className="text-xs text-muted-foreground">Effective: {((parseFloat(data.adult_rate) || 0) * sr).toLocaleString()}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Child Rate</Label>
                                        <Input type="number" value={data.child_rate} disabled
                                            className="bg-muted text-muted-foreground" placeholder="0.00" />
                                        <p className="text-xs text-muted-foreground">Effective: {((parseFloat(data.child_rate) || 0) * sr).toLocaleString()}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Infant Rate</Label>
                                        <Input type="number" value={data.infant_rate} disabled
                                            className="bg-muted text-muted-foreground" placeholder="0.00" />
                                        <p className="text-xs text-muted-foreground">Effective: {((parseFloat(data.infant_rate) || 0) * sr).toLocaleString()}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <Label>SR Rate <span className="text-xs text-muted-foreground">(multiplier)</span></Label>
                                        <Input type="number" min={0} step="0.0001" value={data.sr_rate}
                                            onChange={e => setData('sr_rate', e.target.value)} placeholder="1.00" />
                                    </div>
                                </div>
                            );
                        })()}
                    </div>

                    {/* Ziarat + Remarks */}
                    <div className="rounded-lg border p-4">
                        <h2 className="mb-3 font-semibold text-primary">Ziarat &amp; Remarks</h2>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <Label>Ziarat</Label>
                                {ziarats.map(z => (
                                    <label key={z.id} className="flex items-center gap-2 text-sm">
                                        <input type="checkbox" checked={data.ziarat_ids.includes(z.id)} onChange={() => toggleZiarat(z.id)} />
                                        {z.name}
                                        <span className="text-xs text-muted-foreground">({z.amount.toLocaleString()})</span>
                                    </label>
                                ))}
                                {data.ziarat_ids.length > 0 && (() => {
                                    const sr = parseFloat(data.sr_rate) || 1;
                                    const zTotal = ziarats.filter(z => data.ziarat_ids.includes(z.id))
                                        .reduce((s, z) => s + z.amount, 0) * sr;
                                    return (
                                        <p className="text-xs font-medium text-foreground pt-1">
                                            Ziarat Total (×SR): {zTotal.toLocaleString()}
                                        </p>
                                    );
                                })()}
                            </div>
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <Label>Remarks</Label>
                                    <textarea value={data.remarks} onChange={e => setData('remarks', e.target.value)} rows={3}
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                                </div>
                                <div className="space-y-1">
                                    <Label>Contact Type</Label>
                                    <div className="flex gap-4 text-sm">
                                        {['package_with_hotel','only_transport'].map(ct => (
                                            <label key={ct} className="flex items-center gap-1.5">
                                                <input type="radio" name="contact" value={ct} checked={data.contact === ct} onChange={e => setData('contact', e.target.value)} />
                                                {ct.replace(/_/g, ' ')}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing} className="bg-teal-600 hover:bg-teal-700">Update Voucher</Button>
                        <Button type="button" variant="destructive" asChild><Link href="/admin/vouchers">Cancel</Link></Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
