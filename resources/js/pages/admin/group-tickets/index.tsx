import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

interface Ticket {
    id: number; category: string; airline: string; from_city: string; to_city: string;
    booking_code: string | null; dep_date: string; dep_time: string; arr_time: string;
    flight_no: string | null; meal: string; baggage: string | null;
    price: number; seats_available: number; is_active: boolean; bookings_count: number;
}
interface Paginated<T> {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number; last_page: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Group Tickets', href: '/admin/group-tickets' },
];

function catLabel(c: string) { return c.charAt(0).toUpperCase() + c.slice(1); }

export default function GroupTicketsIndex({
    tickets, categories, filters, flash,
}: {
    tickets: Paginated<Ticket>; categories: string[];
    filters: { category?: string }; flash?: { success?: string };
}) {
    function filterCat(cat: string) {
        router.get('/admin/group-tickets', { category: cat }, { preserveState: true, replace: true });
    }

    function destroy(id: number) {
        if (!confirm('Delete this ticket?')) return;
        router.delete(`/admin/group-tickets/${id}`, { preserveScroll: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Group Tickets" />
            <div className="flex flex-col gap-4 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Group Tickets</h1>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/admin/group-ticket-bookings">Bookings</Link>
                        </Button>
                        <Button asChild><Link href="/admin/group-tickets/create">+ Add Ticket</Link></Button>
                    </div>
                </div>

                {flash?.success && (
                    <div className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">{flash.success}</div>
                )}

                {/* Category filter tabs */}
                <div className="flex gap-2 flex-wrap">
                    <button onClick={() => filterCat('')}
                        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${!filters.category ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                        All
                    </button>
                    {categories.map(c => (
                        <button key={c} onClick={() => filterCat(c)}
                            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${filters.category === c ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                            {catLabel(c)}
                        </button>
                    ))}
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-muted-foreground">
                            <tr>
                                <th className="px-3 py-3 text-left font-medium">Category</th>
                                <th className="px-3 py-3 text-left font-medium">Route</th>
                                <th className="px-3 py-3 text-left font-medium">Airline / Flight</th>
                                <th className="px-3 py-3 text-left font-medium">Date</th>
                                <th className="px-3 py-3 text-left font-medium">Time</th>
                                <th className="px-3 py-3 text-left font-medium">Meal / Baggage</th>
                                <th className="px-3 py-3 text-right font-medium">Price</th>
                                <th className="px-3 py-3 text-center font-medium">Seats</th>
                                <th className="px-3 py-3 text-center font-medium">Bookings</th>
                                <th className="px-3 py-3 text-center font-medium">Status</th>
                                <th className="px-3 py-3 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {tickets.data.length === 0 && (
                                <tr><td colSpan={11} className="px-4 py-8 text-center text-muted-foreground">No tickets found.</td></tr>
                            )}
                            {tickets.data.map(t => (
                                <tr key={t.id} className="hover:bg-muted/30">
                                    <td className="px-3 py-2">
                                        <span className="rounded-full bg-teal-100 px-2 py-0.5 text-xs font-semibold text-teal-700 capitalize">
                                            {t.category}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2 font-semibold">{t.from_city}–{t.to_city}</td>
                                    <td className="px-3 py-2">
                                        <div>{t.airline}</div>
                                        {t.flight_no && <div className="text-xs text-muted-foreground">{t.flight_no}</div>}
                                        {t.booking_code && <div className="text-xs text-muted-foreground">{t.booking_code}</div>}
                                    </td>
                                    <td className="px-3 py-2">{t.dep_date}</td>
                                    <td className="px-3 py-2 text-xs">
                                        <div>Dep: {t.dep_time.substring(0,5)}</div>
                                        <div>Arr: {t.arr_time.substring(0,5)}</div>
                                    </td>
                                    <td className="px-3 py-2 text-xs">
                                        <div>Meal: {t.meal.toUpperCase()}</div>
                                        {t.baggage && <div>{t.baggage}</div>}
                                    </td>
                                    <td className="px-3 py-2 text-right font-semibold text-teal-700">
                                        {t.price.toLocaleString()}
                                    </td>
                                    <td className="px-3 py-2 text-center">{t.seats_available}</td>
                                    <td className="px-3 py-2 text-center font-semibold">{t.bookings_count}</td>
                                    <td className="px-3 py-2 text-center">
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${t.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                            {t.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/admin/group-tickets/${t.id}/edit`}>Edit</Link>
                                            </Button>
                                            <Button variant="destructive" size="sm" onClick={() => destroy(t.id)}>Delete</Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {tickets.last_page > 1 && (
                    <div className="flex flex-wrap gap-1">
                        {tickets.links.map((link, i) => (
                            <Button key={i} size="sm" variant={link.active ? 'default' : 'outline'}
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url, {}, { preserveScroll: true })}
                                dangerouslySetInnerHTML={{ __html: link.label }} />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
