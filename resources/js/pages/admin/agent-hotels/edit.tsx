import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

interface Hotel { id: number; name: string; city_name: string; }
interface AgentProp { id: number; name: string; }
interface AssignedRow { hotel_id: number; room_type: string; price: number; }

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Agent Hotels', href: '/admin/agent-hotels' },
    { title: 'Assign', href: '#' },
];

export default function AgentHotelsEdit({
    agent, hotels, assigned, roomTypes,
}: {
    agent: AgentProp;
    hotels: Hotel[];
    assigned: AssignedRow[];
    roomTypes: string[];
}) {
    // Build initial state: { hotelId: { roomType: price_string | null } }
    // null means not assigned, string means assigned with that price
    const buildInitial = () => {
        const state: Record<number, Record<string, string | null>> = {};
        for (const hotel of hotels) {
            state[hotel.id] = {};
            for (const rt of roomTypes) {
                state[hotel.id][rt] = null;
            }
        }
        for (const row of assigned) {
            if (state[row.hotel_id]) {
                state[row.hotel_id][row.room_type] = String(row.price);
            }
        }
        return state;
    };

    const [assignments, setAssignments] = useState<Record<number, Record<string, string | null>>>(buildInitial);
    const [processing, setProcessing] = useState(false);
    const [search, setSearch] = useState('');

    // A hotel is "selected" if any of its room types are enabled (non-null)
    function isHotelSelected(hotelId: number) {
        return Object.values(assignments[hotelId] ?? {}).some(v => v !== null);
    }

    function toggleHotel(hotelId: number) {
        setAssignments(prev => {
            const current = { ...prev[hotelId] };
            const anyEnabled = Object.values(current).some(v => v !== null);
            const next: Record<string, string | null> = {};
            for (const rt of roomTypes) {
                // If none were enabled → enable sharing with 0; if any enabled → clear all
                next[rt] = anyEnabled ? null : (rt === 'sharing' ? '0' : null);
            }
            return { ...prev, [hotelId]: next };
        });
    }

    function toggleRoomType(hotelId: number, roomType: string) {
        setAssignments(prev => {
            const current = prev[hotelId][roomType];
            return {
                ...prev,
                [hotelId]: {
                    ...prev[hotelId],
                    [roomType]: current === null ? '0' : null,
                },
            };
        });
    }

    function setPrice(hotelId: number, roomType: string, price: string) {
        setAssignments(prev => ({
            ...prev,
            [hotelId]: { ...prev[hotelId], [roomType]: price },
        }));
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        const rows: { hotel_id: number; room_type: string; price: string }[] = [];
        for (const [hotelId, rtMap] of Object.entries(assignments)) {
            for (const [rt, price] of Object.entries(rtMap)) {
                if (price !== null) {
                    rows.push({ hotel_id: Number(hotelId), room_type: rt, price: price || '0' });
                }
            }
        }
        setProcessing(true);
        router.put(`/admin/agent-hotels/${agent.id}`, { hotels: rows }, {
            onFinish: () => setProcessing(false),
        });
    }

    const filteredHotels = hotels.filter(h =>
        !search || h.name.toLowerCase().includes(search.toLowerCase()) || h.city_name.toLowerCase().includes(search.toLowerCase())
    );

    const selectedCount = hotels.filter(h => isHotelSelected(h.id)).length;
    const totalRows = Object.values(assignments).reduce((sum, rtMap) =>
        sum + Object.values(rtMap).filter(v => v !== null).length, 0
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Assign Hotels — ${agent.name}`} />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Assign Hotels &amp; Room Types</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Agent: <span className="font-medium text-foreground">{agent.name}</span>
                            &nbsp;·&nbsp;{selectedCount} hotel(s) · {totalRows} room type(s) selected
                        </p>
                    </div>
                    <Button variant="outline" asChild><Link href="/admin/agent-hotels">Back</Link></Button>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <Input
                        placeholder="Search hotels by name or city…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="max-w-sm"
                    />

                    <div className="rounded-lg border divide-y">
                        {filteredHotels.length === 0 && (
                            <p className="px-4 py-6 text-center text-muted-foreground">No hotels found.</p>
                        )}
                        {filteredHotels.map((hotel) => {
                            const selected = isHotelSelected(hotel.id);
                            return (
                                <div key={hotel.id} className={selected ? 'bg-teal-50/40 dark:bg-teal-950/20' : ''}>
                                    {/* Hotel header row */}
                                    <div className="flex items-center gap-3 px-4 py-2.5">
                                        <input
                                            type="checkbox"
                                            id={`hotel-${hotel.id}`}
                                            checked={selected}
                                            onChange={() => toggleHotel(hotel.id)}
                                            className="h-4 w-4 rounded accent-teal-600"
                                        />
                                        <label htmlFor={`hotel-${hotel.id}`} className="flex flex-1 cursor-pointer items-center gap-2">
                                            <span className="font-medium">{hotel.name}</span>
                                            <span className="text-xs text-muted-foreground">({hotel.city_name})</span>
                                        </label>
                                    </div>

                                    {/* Room type rows — only when hotel is selected */}
                                    {selected && (
                                        <div className="border-t bg-white/60 dark:bg-black/10">
                                            <div className="grid grid-cols-4 gap-0 border-b bg-muted/40 px-8 py-1 text-xs font-medium text-muted-foreground sm:grid-cols-7">
                                                {roomTypes.map(rt => (
                                                    <span key={rt} className="capitalize">{rt.replace(/_/g, ' ')}</span>
                                                ))}
                                            </div>
                                            <div className="grid grid-cols-1 gap-2 px-8 py-3 sm:grid-cols-1">
                                                <table className="w-full text-sm">
                                                    <tbody>
                                                        {roomTypes.map(rt => {
                                                            const price = assignments[hotel.id]?.[rt];
                                                            const enabled = price !== null;
                                                            return (
                                                                <tr key={rt} className={`border-b last:border-0 ${enabled ? '' : 'opacity-50'}`}>
                                                                    <td className="py-1.5 w-8">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={enabled}
                                                                            onChange={() => toggleRoomType(hotel.id, rt)}
                                                                            className="h-3.5 w-3.5 accent-teal-600"
                                                                        />
                                                                    </td>
                                                                    <td className="py-1.5 w-36 capitalize text-sm text-foreground">
                                                                        {rt.replace(/_/g, ' ')}
                                                                    </td>
                                                                    <td className="py-1.5">
                                                                        <div className="flex items-center gap-1.5">
                                                                            <span className="text-xs text-muted-foreground">PKR</span>
                                                                            <Input
                                                                                type="number"
                                                                                min="0"
                                                                                step="0.01"
                                                                                value={price ?? ''}
                                                                                disabled={!enabled}
                                                                                onChange={e => setPrice(hotel.id, rt, e.target.value)}
                                                                                className="w-32 h-7 text-sm"
                                                                                placeholder="0"
                                                                            />
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing} className="bg-teal-600 hover:bg-teal-700">
                            Save Assignments
                        </Button>
                        <Button type="button" variant="outline" asChild>
                            <Link href="/admin/agent-hotels">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
