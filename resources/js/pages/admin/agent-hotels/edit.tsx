import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

interface Hotel    { id: number; name: string; city_name: string; }
interface AgentProp { id: number; name: string; }

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Agent Hotels', href: '/admin/agent-hotels' },
    { title: 'Assign', href: '#' },
];

export default function AgentHotelsEdit({
    agent, hotels, assigned,
}: {
    agent: AgentProp;
    hotels: Hotel[];
    assigned: { hotel_id: number; price: number }[];
}) {
    const assignedMap: Record<number, number> = {};
    assigned.forEach((a) => { assignedMap[a.hotel_id] = a.price; });

    const [checked, setChecked]   = useState<Record<number, boolean>>(() => {
        const init: Record<number, boolean> = {};
        assigned.forEach((a) => { init[a.hotel_id] = true; });
        return init;
    });
    const [prices, setPrices]     = useState<Record<number, string>>(() => {
        const init: Record<number, string> = {};
        hotels.forEach((h) => { init[h.id] = String(assignedMap[h.id] ?? 0); });
        return init;
    });
    const [processing, setProcessing] = useState(false);

    function toggleHotel(hotelId: number) {
        setChecked((prev) => ({ ...prev, [hotelId]: !prev[hotelId] }));
    }

    function setPrice(hotelId: number, price: string) {
        setPrices((prev) => ({ ...prev, [hotelId]: price }));
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        const selected = hotels
            .filter((h) => checked[h.id])
            .map((h) => ({ hotel_id: h.id, price: prices[h.id] ?? '0' }));

        setProcessing(true);
        router.put(`/admin/agent-hotels/${agent.id}`, { hotels: selected }, {
            onFinish: () => setProcessing(false),
        });
    }

    const selectedCount = Object.values(checked).filter(Boolean).length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Assign Hotels — ${agent.name}`} />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Assign Hotels</h1>
                        <p className="mt-1 text-sm text-muted-foreground">Agent: <span className="font-medium text-foreground">{agent.name}</span></p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/admin/agent-hotels">Back</Link>
                    </Button>
                </div>

                <form onSubmit={submit}>
                    <div className="rounded-lg border">
                        <div className="border-b bg-muted/50 px-4 py-3">
                            <p className="text-sm text-muted-foreground">
                                Select hotels and set a price for each. <strong>{selectedCount}</strong> hotel(s) selected.
                            </p>
                        </div>

                        <div className="divide-y">
                            {hotels.length === 0 && (
                                <p className="px-4 py-6 text-center text-muted-foreground">No hotels available. Add hotels first.</p>
                            )}
                            {hotels.map((hotel) => {
                                const isChecked = !!checked[hotel.id];
                                return (
                                    <div
                                        key={hotel.id}
                                        className={`flex items-center gap-4 px-4 py-3 transition-colors ${isChecked ? 'bg-teal-50/50 dark:bg-teal-950/20' : ''}`}
                                    >
                                        <input
                                            type="checkbox"
                                            id={`hotel-${hotel.id}`}
                                            checked={isChecked}
                                            onChange={() => toggleHotel(hotel.id)}
                                            className="h-4 w-4 rounded accent-teal-600"
                                        />
                                        <label htmlFor={`hotel-${hotel.id}`} className="flex flex-1 cursor-pointer items-center gap-3">
                                            <div className="flex-1">
                                                <p className="font-medium">{hotel.name}</p>
                                                <p className="text-xs text-muted-foreground">{hotel.city_name}</p>
                                            </div>
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-muted-foreground">PKR</span>
                                            <Input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={prices[hotel.id] ?? '0'}
                                                onChange={(e) => setPrice(hotel.id, e.target.value)}
                                                disabled={!isChecked}
                                                className="w-32"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-4 flex gap-3">
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
