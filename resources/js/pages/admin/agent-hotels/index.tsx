import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

interface AgentHotel { hotel_id: number; hotel_name: string; city_name: string; room_type: string; price: number; }
interface Agent { id: number; name: string; hotels: AgentHotel[]; }

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Agent Hotels', href: '/admin/agent-hotels' },
];

function groupByHotel(hotels: AgentHotel[]): { hotel_id: number; hotel_name: string; city_name: string; roomTypes: { room_type: string; price: number }[] }[] {
    const map = new Map<number, { hotel_id: number; hotel_name: string; city_name: string; roomTypes: { room_type: string; price: number }[] }>();
    for (const h of hotels) {
        if (!map.has(h.hotel_id)) {
            map.set(h.hotel_id, { hotel_id: h.hotel_id, hotel_name: h.hotel_name, city_name: h.city_name, roomTypes: [] });
        }
        map.get(h.hotel_id)!.roomTypes.push({ room_type: h.room_type, price: h.price });
    }
    return Array.from(map.values());
}

export default function AgentHotelsIndex({ agents, flash }: { agents: Agent[]; flash?: { success?: string } }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Agent Hotels" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Agent Hotels</h1>
                </div>

                {flash?.success && (
                    <div className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">{flash.success}</div>
                )}

                {agents.length === 0 && <p className="text-muted-foreground">No agents found.</p>}

                <div className="space-y-4">
                    {agents.map((agent) => {
                        const grouped = groupByHotel(agent.hotels);
                        return (
                            <div key={agent.id} className="rounded-lg border bg-card">
                                <div className="flex items-center justify-between border-b px-4 py-3">
                                    <h2 className="font-semibold">{agent.name}</h2>
                                    <Button size="sm" asChild>
                                        <Link href={`/admin/agent-hotels/${agent.id}/edit`}>Assign Hotels</Link>
                                    </Button>
                                </div>

                                {grouped.length === 0 ? (
                                    <p className="px-4 py-3 text-sm text-muted-foreground">No hotels assigned yet.</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead className="bg-muted/50 text-muted-foreground">
                                                <tr>
                                                    <th className="px-4 py-2 text-left font-medium">Hotel</th>
                                                    <th className="px-4 py-2 text-left font-medium">City</th>
                                                    <th className="px-4 py-2 text-left font-medium">Room Type</th>
                                                    <th className="px-4 py-2 text-right font-medium">Price (PKR)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y">
                                                {grouped.map((g) =>
                                                    g.roomTypes.map((rt, ri) => (
                                                        <tr key={`${g.hotel_id}-${rt.room_type}`} className="hover:bg-muted/20">
                                                            {ri === 0 && (
                                                                <>
                                                                    <td className="px-4 py-2 font-medium" rowSpan={g.roomTypes.length}>{g.hotel_name}</td>
                                                                    <td className="px-4 py-2 text-muted-foreground" rowSpan={g.roomTypes.length}>{g.city_name}</td>
                                                                </>
                                                            )}
                                                            <td className="px-4 py-2 capitalize text-muted-foreground">{rt.room_type.replace(/_/g, ' ')}</td>
                                                            <td className="px-4 py-2 text-right font-medium">{Number(rt.price).toLocaleString()}</td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
}
