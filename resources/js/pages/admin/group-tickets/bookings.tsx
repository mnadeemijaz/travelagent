import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Booking {
    id: number;
    passengers: number;
    contact_phone: string | null;
    notes: string | null;
    status: 'pending' | 'approved' | 'rejected' | 'cancelled';
    expires_at: string | null;
    created_at: string;
    ticket: { id: number; airline: string; from_city: string; to_city: string; dep_date: string; category: string; price: number; };
    user: { id: number; name: string; email: string; };
}

interface Paginated<T> {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Group Tickets', href: '/admin/group-tickets' },
    { title: 'Bookings', href: '#' },
];

const statusColors: Record<Booking['status'], string> = {
    pending:   'bg-yellow-100 text-yellow-700',
    approved:  'bg-green-100 text-green-700',
    rejected:  'bg-red-100 text-red-700',
    cancelled: 'bg-gray-100 text-gray-500',
};

// ── Countdown cell ────────────────────────────────────────────────────────────
function CountdownCell({ expiresAt }: { expiresAt: string }) {
    const [remaining, setRemaining] = useState(() => {
        return Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
    });

    useEffect(() => {
        if (remaining <= 0) return;
        const id = setInterval(() => {
            setRemaining((s) => {
                if (s <= 1) { clearInterval(id); return 0; }
                return s - 1;
            });
        }, 1000);
        return () => clearInterval(id);
    }, [expiresAt]);

    if (remaining <= 0) {
        return <span className="text-xs font-semibold text-red-500">Expired</span>;
    }

    const mins = Math.floor(remaining / 60);
    const secs = remaining % 60;
    const urgent = remaining < 300; // less than 5 min

    return (
        <span className={`inline-flex items-center gap-1 text-xs font-mono font-semibold ${urgent ? 'text-red-600' : 'text-amber-600'}`}>
            <Clock className="h-3 w-3 shrink-0" />
            {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
        </span>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function GroupTicketBookings({
    bookings, categories, filters, flash, isAdmin,
}: {
    bookings: Paginated<Booking>;
    categories: string[];
    filters: { status?: string; category?: string };
    flash?: { success?: string };
    isAdmin: boolean;
}) {
    function approve(id: number) {
        router.post(`/admin/group-ticket-bookings/${id}/approve`, {}, { preserveScroll: true });
    }
    function reject(id: number) {
        if (!confirm('Reject this booking?')) return;
        router.post(`/admin/group-ticket-bookings/${id}/reject`, {}, { preserveScroll: true });
    }
    function filter(key: string, val: string) {
        router.get('/admin/group-ticket-bookings', { ...filters, [key]: val }, { preserveState: true, replace: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Group Ticket Bookings" />
            <div className="flex flex-col gap-4 p-6">
                <h1 className="text-2xl font-semibold">
                    {isAdmin ? 'All Group Ticket Bookings' : 'My Group Ticket Bookings'}
                </h1>

                {flash?.success && (
                    <div className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">{flash.success}</div>
                )}

                {/* Filters */}
                <div className="flex flex-wrap gap-3">
                    <select
                        value={filters.status ?? ''}
                        onChange={(e) => filter('status', e.target.value)}
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    <select
                        value={filters.category ?? ''}
                        onChange={(e) => filter('category', e.target.value)}
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm capitalize"
                    >
                        <option value="">All Categories</option>
                        {categories.map((c) => (
                            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                        ))}
                    </select>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-muted-foreground">
                            <tr>
                                <th className="px-3 py-3 text-left font-medium">#</th>
                                {isAdmin && <th className="px-3 py-3 text-left font-medium">Booked By</th>}
                                <th className="px-3 py-3 text-left font-medium">Flight</th>
                                <th className="px-3 py-3 text-left font-medium">Date</th>
                                <th className="px-3 py-3 text-center font-medium">Pax</th>
                                <th className="px-3 py-3 text-right font-medium">Total</th>
                                <th className="px-3 py-3 text-left font-medium">Phone</th>
                                <th className="px-3 py-3 text-left font-medium">Notes</th>
                                <th className="px-3 py-3 text-center font-medium">Status</th>
                                <th className="px-3 py-3 text-center font-medium">Pay By</th>
                                {isAdmin && <th className="px-3 py-3 text-right font-medium">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {bookings.data.length === 0 && (
                                <tr>
                                    <td colSpan={isAdmin ? 11 : 9} className="px-4 py-8 text-center text-muted-foreground">
                                        No bookings found.
                                    </td>
                                </tr>
                            )}
                            {bookings.data.map((b, i) => (
                                <tr key={b.id} className={`hover:bg-muted/30 ${b.status === 'cancelled' ? 'opacity-60' : ''}`}>
                                    <td className="px-3 py-2 text-muted-foreground">{i + 1}</td>

                                    {isAdmin && (
                                        <td className="px-3 py-2">
                                            <div className="font-medium">{b.user.name}</div>
                                            <div className="text-xs text-muted-foreground">{b.user.email}</div>
                                        </td>
                                    )}

                                    <td className="px-3 py-2">
                                        <div className="font-semibold">{b.ticket.from_city}–{b.ticket.to_city}</div>
                                        <div className="text-xs text-muted-foreground capitalize">
                                            {b.ticket.airline} · {b.ticket.category}
                                        </div>
                                    </td>

                                    <td className="px-3 py-2 whitespace-nowrap">{b.ticket.dep_date}</td>

                                    <td className="px-3 py-2 text-center">{b.passengers}</td>

                                    <td className="px-3 py-2 text-right font-semibold text-teal-700">
                                        PKR {(b.ticket.price * b.passengers).toLocaleString()}
                                    </td>

                                    <td className="px-3 py-2 whitespace-nowrap">{b.contact_phone ?? '—'}</td>

                                    <td className="px-3 py-2 text-xs text-muted-foreground max-w-[140px] truncate">
                                        {b.notes ?? '—'}
                                    </td>

                                    <td className="px-3 py-2 text-center">
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${statusColors[b.status]}`}>
                                            {b.status}
                                        </span>
                                    </td>

                                    {/* Countdown — only for pending with expires_at */}
                                    <td className="px-3 py-2 text-center">
                                        {b.status === 'pending' && b.expires_at ? (
                                            <CountdownCell expiresAt={b.expires_at} />
                                        ) : (
                                            <span className="text-xs text-muted-foreground">—</span>
                                        )}
                                    </td>

                                    {isAdmin && (
                                        <td className="px-3 py-2 text-right">
                                            {b.status === 'pending' && (
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        className="h-7 px-3 text-xs bg-green-600 hover:bg-green-700"
                                                        onClick={() => approve(b.id)}
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        className="h-7 px-3 text-xs"
                                                        onClick={() => reject(b.id)}
                                                    >
                                                        Reject
                                                    </Button>
                                                </div>
                                            )}
                                            {b.status !== 'pending' && (
                                                <span className="text-xs text-muted-foreground">—</span>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {bookings.last_page > 1 && (
                    <div className="flex flex-wrap gap-1">
                        {bookings.links.map((link, i) => (
                            <Button
                                key={i}
                                size="sm"
                                variant={link.active ? 'default' : 'outline'}
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url, {}, { preserveScroll: true })}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
