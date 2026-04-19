import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

interface AgentHotel { hotel_id: number; hotel_name: string; city_name: string; price: number; }
interface Agent { id: number; name: string; hotels: AgentHotel[]; }

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Agent Hotels', href: '/admin/agent-hotels' },
];

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

                {agents.length === 0 && (
                    <p className="text-muted-foreground">No agents found.</p>
                )}

                <div className="space-y-4">
                    {agents.map((agent) => (
                        <div key={agent.id} className="rounded-lg border bg-card">
                            <div className="flex items-center justify-between border-b px-4 py-3">
                                <h2 className="font-semibold">{agent.name}</h2>
                                <Button size="sm" asChild>
                                    <Link href={`/admin/agent-hotels/${agent.id}/edit`}>
                                        Assign Hotels
                                    </Link>
                                </Button>
                            </div>

                            {agent.hotels.length === 0 ? (
                                <p className="px-4 py-3 text-sm text-muted-foreground">No hotels assigned yet.</p>
                            ) : (
                                <div className="overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead className="bg-muted/50 text-muted-foreground">
                                            <tr>
                                                <th className="px-4 py-2 text-left font-medium">Hotel</th>
                                                <th className="px-4 py-2 text-left font-medium">City</th>
                                                <th className="px-4 py-2 text-right font-medium">Price (PKR)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {agent.hotels.map((h) => (
                                                <tr key={h.hotel_id} className="hover:bg-muted/20">
                                                    <td className="px-4 py-2">{h.hotel_name}</td>
                                                    <td className="px-4 py-2 text-muted-foreground">{h.city_name}</td>
                                                    <td className="px-4 py-2 text-right font-medium">
                                                        {Number(h.price).toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
