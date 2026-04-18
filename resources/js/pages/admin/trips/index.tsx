import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

interface Vehicle { id: number; name: string; }
interface Trip { id: number; name: string; vehicle: Vehicle | null; price: string | null; }
interface Paginated<T> { data: T[]; current_page: number; last_page: number; per_page: number; links: { url: string | null; label: string; active: boolean }[]; }

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }, { title: 'Trips', href: '/admin/trips' }];

export default function TripsIndex({ trips, flash }: { trips: Paginated<Trip>; flash?: { success?: string } }) {
    function destroy(id: number, name: string) {
        if (!confirm(`Delete "${name}"?`)) return;
        router.post('/admin/trips/delete', { id }, { preserveScroll: true });
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Trips" />
            <div className="flex flex-col gap-5 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Trips</h1>
                    <Button asChild><Link href="/admin/trips/create">+ Add Trip</Link></Button>
                </div>
                {flash?.success && <div className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">{flash.success}</div>}
                <div className="overflow-hidden rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 text-left w-10">Sr#</th>
                                <th className="px-4 py-3 text-left">Name</th>
                                <th className="px-4 py-3 text-left">Vehicle</th>
                                <th className="px-4 py-3 text-left">Price</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {trips.data.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No trips.</td></tr>}
                            {trips.data.map((t, i) => (
                                <tr key={t.id} className="hover:bg-muted/30">
                                    <td className="px-4 py-2">{(trips.current_page - 1) * trips.per_page + i + 1}</td>
                                    <td className="px-4 py-2 font-medium">{t.name}</td>
                                    <td className="px-4 py-2">{t.vehicle?.name ?? '—'}</td>
                                    <td className="px-4 py-2">{t.price ?? '—'}</td>
                                    <td className="px-4 py-2 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" size="sm" asChild><Link href={`/admin/trips/${t.id}/edit`}>Edit</Link></Button>
                                            <Button variant="destructive" size="sm" onClick={() => destroy(t.id, t.name)}>Delete</Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {trips.last_page > 1 && (
                    <div className="flex flex-wrap gap-1">
                        {trips.links.map((link, i) => (
                            <button key={i} disabled={!link.url} onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                className={`rounded px-3 py-1 text-sm ${link.active ? 'bg-primary text-primary-foreground' : 'border hover:bg-muted/50 disabled:opacity-40'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }} />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
