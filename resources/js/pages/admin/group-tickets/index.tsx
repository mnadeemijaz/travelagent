import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { X } from 'lucide-react';
import { useState } from 'react';
import GroupTicketForm, { type GtFormData } from './form';

interface Ticket {
    id: number; category: string; airline: string; from_city: string; to_city: string;
    booking_code: string | null; dep_date: string; dep_time: string; arr_time: string;
    flight_no: string | null; meal: string; baggage: string | null;
    price: number; seats_available: number; is_active: boolean; bookings_count: number;
}
interface Category { id: number; name: string; }
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

// ── Booking Modal ─────────────────────────────────────────────────────────────
function BookingModal({ ticket, onClose }: { ticket: Ticket; onClose: () => void }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        passengers: '1',
        contact_phone: '',
        notes: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(`/admin/group-tickets/${ticket.id}/book`, {
            onSuccess: () => { reset(); onClose(); },
        });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
                <div className="flex items-center justify-between border-b px-5 py-4">
                    <div>
                        <h3 className="font-semibold text-base">Book Ticket</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {ticket.from_city}→{ticket.to_city} · {ticket.airline} · {ticket.dep_date}
                        </p>
                    </div>
                    <button onClick={onClose} className="rounded p-1 hover:bg-gray-100"><X size={16} /></button>
                </div>
                <form onSubmit={submit} className="p-5 space-y-4">
                    <div className="space-y-1">
                        <Label>Passengers <span className="text-destructive">*</span></Label>
                        <Input type="number" min="1" value={data.passengers}
                            onChange={e => setData('passengers', e.target.value)} />
                        {errors.passengers && <p className="text-xs text-destructive">{errors.passengers}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label>Contact Phone <span className="text-destructive">*</span></Label>
                        <Input placeholder="+92 300 0000000" value={data.contact_phone}
                            onChange={e => setData('contact_phone', e.target.value)} />
                        {errors.contact_phone && <p className="text-xs text-destructive">{errors.contact_phone}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label>Notes</Label>
                        <Input placeholder="Optional notes…" value={data.notes}
                            onChange={e => setData('notes', e.target.value)} />
                        {errors.notes && <p className="text-xs text-destructive">{errors.notes}</p>}
                    </div>
                    <div className="flex gap-2 pt-1">
                        <Button type="submit" disabled={processing} className="bg-teal-600 hover:bg-teal-700">
                            {processing ? 'Booking…' : 'Confirm Booking'}
                        </Button>
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function GroupTicketsIndex({
    tickets, categories, filters, flash,
}: {
    tickets: Paginated<Ticket>;
    categories: Category[];
    filters: { category?: string };
    flash?: { success?: string; error?: string };
}) {
    const [showCatPanel, setShowCatPanel] = useState(false);
    const [showAddForm, setShowAddForm]   = useState(false);
    const [bookingTicket, setBookingTicket] = useState<Ticket | null>(null);
    const [newCatName, setNewCatName]     = useState('');

    const addForm = useForm<GtFormData>({
        category: '', airline: '', from_city: '', to_city: '',
        booking_code: '', dep_date: '', dep_time: '', arr_time: '',
        flight_no: '', meal: 'no', baggage: '',
        price: '', seats_available: '', is_active: true,
    });

    const catNames = categories.map(c => c.name);

    function filterCat(cat: string) {
        router.get('/admin/group-tickets', { category: cat }, { preserveState: true, replace: true });
    }

    function destroy(id: number) {
        if (!confirm('Delete this ticket?')) return;
        router.delete(`/admin/group-tickets/${id}`, { preserveScroll: true });
    }

    function addCategory() {
        const name = newCatName.trim().toLowerCase();
        if (!name) return;
        router.post('/admin/group-ticket-categories', { name }, {
            preserveScroll: true,
            onSuccess: () => setNewCatName(''),
        });
    }

    function removeCategory(id: number, name: string) {
        if (!confirm(`Delete category "${name}"?`)) return;
        router.delete(`/admin/group-ticket-categories/${id}`, { preserveScroll: true });
    }

    function submitAddForm(e: React.FormEvent) {
        e.preventDefault();
        addForm.post('/admin/group-tickets', {
            preserveScroll: true,
            onSuccess: () => {
                addForm.reset();
                setShowAddForm(false);
            },
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Group Tickets" />
            <div className="flex flex-col gap-4 p-6">

                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <h1 className="text-2xl font-semibold">Group Tickets</h1>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm"
                            onClick={() => { setShowCatPanel(v => !v); setShowAddForm(false); }}>
                            {showCatPanel ? 'Hide Categories' : 'Manage Categories'}
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/admin/group-ticket-bookings">Bookings</Link>
                        </Button>
                        <Button size="sm"
                            onClick={() => { setShowAddForm(v => !v); setShowCatPanel(false); }}
                            className="bg-teal-600 hover:bg-teal-700">
                            {showAddForm ? '✕ Cancel' : '+ Add Ticket'}
                        </Button>
                    </div>
                </div>

                {/* Flash messages */}
                {flash?.success && (
                    <div className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">{flash.success}</div>
                )}
                {flash?.error && (
                    <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{flash.error}</div>
                )}

                {/* ── Category Management Panel ── */}
                {showCatPanel && (
                    <div className="rounded-lg border bg-muted/20 p-4">
                        <h2 className="mb-3 text-sm font-semibold">Categories</h2>
                        <div className="mb-4 flex flex-wrap gap-2">
                            {categories.length === 0 && (
                                <span className="text-xs text-muted-foreground">No categories yet.</span>
                            )}
                            {categories.map(c => (
                                <span key={c.id}
                                    className="flex items-center gap-1 rounded-full bg-teal-100 px-3 py-1 text-sm text-teal-800 capitalize">
                                    {c.name}
                                    <button
                                        onClick={() => removeCategory(c.id, c.name)}
                                        className="ml-0.5 rounded-full p-0.5 hover:bg-teal-200"
                                        title="Delete category">
                                        <X size={11} />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <Input
                                value={newCatName}
                                onChange={e => setNewCatName(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                                placeholder="New category name…"
                                className="w-52"
                            />
                            <Button size="sm" onClick={addCategory} className="bg-teal-600 hover:bg-teal-700">
                                Add
                            </Button>
                        </div>
                    </div>
                )}

                {/* ── Inline Add Ticket Form ── */}
                {showAddForm && (
                    <div className="rounded-lg border bg-muted/10 p-5">
                        <h2 className="mb-4 text-base font-semibold">Add New Ticket</h2>
                        <GroupTicketForm
                            data={addForm.data}
                            setData={(key, value) => addForm.setData(key as keyof GtFormData, value as never)}
                            errors={addForm.errors}
                            processing={addForm.processing}
                            categories={catNames}
                            onSubmit={submitAddForm}
                            submitLabel="Create Ticket"
                        />
                    </div>
                )}

                {/* ── Category filter tabs ── */}
                <div className="flex gap-2 flex-wrap">
                    <button onClick={() => filterCat('')}
                        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${!filters.category ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                        All
                    </button>
                    {categories.map(c => (
                        <button key={c.id} onClick={() => filterCat(c.name)}
                            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${filters.category === c.name ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                            {catLabel(c.name)}
                        </button>
                    ))}
                </div>

                {/* ── Tickets Table ── */}
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
                                        <div>Dep: {t.dep_time.substring(0, 5)}</div>
                                        <div>Arr: {t.arr_time.substring(0, 5)}</div>
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
                                        <div className="flex items-center justify-end gap-1.5">
                                            <Button
                                                size="sm"
                                                className="h-7 bg-teal-600 hover:bg-teal-700 text-xs px-2"
                                                onClick={() => setBookingTicket(t)}>
                                                Book
                                            </Button>
                                            <Button variant="outline" size="sm" className="h-7 text-xs px-2" asChild>
                                                <Link href={`/admin/group-tickets/${t.id}/edit`}>Edit</Link>
                                            </Button>
                                            <Button variant="destructive" size="sm" className="h-7 text-xs px-2"
                                                onClick={() => destroy(t.id)}>
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
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

            {/* ── Booking Modal ── */}
            {bookingTicket && (
                <BookingModal ticket={bookingTicket} onClose={() => setBookingTicket(null)} />
            )}
        </AppLayout>
    );
}
