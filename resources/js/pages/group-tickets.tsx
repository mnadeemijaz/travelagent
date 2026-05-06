import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { type SharedData } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    Briefcase,
    Check,
    Copy,
    Facebook,
    Instagram,
    LoaderCircle,
    Mail,
    MapPin,
    Menu,
    Phone,
    Plane,
    Twitter,
    Umbrella,
    Youtube,
    X,
} from 'lucide-react';
import { FormEventHandler, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Ticket {
    id: number;
    category: string;
    airline: string;
    from_city: string;
    to_city: string;
    booking_code: string | null;
    dep_date: string;
    dep_time: string;
    arr_time: string;
    flight_no: string | null;
    meal: 'yes' | 'no';
    baggage: string | null;
    price: number;
    seats_available: number;
    remaining_seats: number;
}

// ─── Auth Modal ───────────────────────────────────────────────────────────────

function LoginForm({ onClose }: { onClose: () => void }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '', password: '', remember: false,
    });
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), { onSuccess: onClose, onFinish: () => reset('password') });
    };
    return (
        <form onSubmit={submit} className="flex flex-col gap-4">
            <div className="space-y-1">
                <Label>Email</Label>
                <Input type="email" required placeholder="email@example.com" value={data.email}
                    onChange={e => setData('email', e.target.value)} />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>
            <div className="space-y-1">
                <Label>Password</Label>
                <Input type="password" required placeholder="••••••••" value={data.password}
                    onChange={e => setData('password', e.target.value)} />
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
            </div>
            <Button type="submit" disabled={processing} className="w-full bg-teal-600 hover:bg-teal-700">
                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                Log In
            </Button>
        </form>
    );
}

function RegisterForm({ onClose }: { onClose: () => void }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '', email: '', password: '', password_confirmation: '',
        role: 'user' as 'user' | 'agent',
    });
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), { onSuccess: onClose, onFinish: () => reset('password', 'password_confirmation') });
    };
    return (
        <form onSubmit={submit} className="flex flex-col gap-4">
            <div className="space-y-1">
                <Label>Full Name</Label>
                <Input required placeholder="Your full name" value={data.name}
                    onChange={e => setData('name', e.target.value)} />
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>
            <div className="space-y-1">
                <Label>Email</Label>
                <Input type="email" required placeholder="email@example.com" value={data.email}
                    onChange={e => setData('email', e.target.value)} />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>
            <div className="space-y-1">
                <Label>Password</Label>
                <Input type="password" required placeholder="••••••••" value={data.password}
                    onChange={e => setData('password', e.target.value)} />
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
            </div>
            <div className="space-y-1">
                <Label>Confirm Password</Label>
                <Input type="password" required placeholder="••••••••" value={data.password_confirmation}
                    onChange={e => setData('password_confirmation', e.target.value)} />
            </div>
            <Button type="submit" disabled={processing} className="w-full bg-teal-600 hover:bg-teal-700">
                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
            </Button>
        </form>
    );
}

// ─── Flight Ticket Card ───────────────────────────────────────────────────────

function formatTime(t: string) {
    // "20:50:00" → "08:50 PM"
    const [hStr, mStr] = t.split(':');
    let h = parseInt(hStr, 10);
    const m = mStr;
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${String(h).padStart(2, '0')}:${m} ${ampm}`;
}

function formatDate(d: string) {
    // "2026-04-16" → "16 Apr 2026"
    const date = new Date(d);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function TicketCard({
    ticket,
    onBookNow,
}: {
    ticket: Ticket;
    onBookNow: (ticket: Ticket) => void;
}) {
    const [copied, setCopied] = useState(false);

    function copyCode() {
        if (ticket.booking_code) {
            navigator.clipboard.writeText(ticket.booking_code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }

    return (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-md overflow-hidden transition-shadow hover:shadow-lg">
            {/* ── Card Header ── */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
                {/* Airline */}
                <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-400">
                        <Plane className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-800">{ticket.airline}</p>
                        <p className="text-xs capitalize text-teal-600 font-medium">{ticket.category}</p>
                    </div>
                </div>

                {/* Route */}
                <div className="text-right">
                    <p className="text-lg font-black tracking-wide text-gray-900">
                        {ticket.from_city}–{ticket.to_city}
                    </p>
                    <p className="text-xs text-gray-400">{formatDate(ticket.dep_date)}</p>
                </div>
            </div>

            {/* ── Card Body ── */}
            <div className="px-5 py-4">
                {/* Booking code row */}
                <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-gray-400 italic">Departure</span>
                    {ticket.booking_code && (
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded">
                                {ticket.booking_code}
                            </span>
                            <button
                                onClick={copyCode}
                                className="flex items-center gap-1 rounded bg-teal-600 px-2 py-1 text-[10px] font-semibold text-white hover:bg-teal-700 transition-colors"
                            >
                                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                {copied ? 'Copied' : 'Copy'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Timeline */}
                <div className="flex items-center gap-3">
                    {/* Departure */}
                    <div className="text-left min-w-[70px]">
                        <p className="text-base font-black text-gray-900">{formatTime(ticket.dep_time)}</p>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{ticket.from_city}</p>
                    </div>

                    {/* Progress line */}
                    <div className="flex-1 flex flex-col items-center gap-1">
                        <div className="relative w-full flex items-center">
                            <div className="h-px flex-1 bg-gray-300" />
                            <div className="mx-2 flex h-6 w-6 items-center justify-center rounded-full bg-teal-500 shadow-sm">
                                <Plane className="h-3 w-3 rotate-90 text-white" />
                            </div>
                            <div className="h-px flex-1 bg-gray-300" />
                        </div>
                        {ticket.flight_no && (
                            <span className="text-[10px] font-bold text-teal-600 tracking-widest">
                                {ticket.flight_no}
                            </span>
                        )}
                    </div>

                    {/* Arrival */}
                    <div className="text-right min-w-[70px]">
                        <p className="text-base font-black text-gray-900">{formatTime(ticket.arr_time)}</p>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{ticket.to_city}</p>
                    </div>
                </div>
            </div>

            {/* ── Card Footer ── */}
            <div className="flex items-center justify-between gap-3 border-t border-gray-100 bg-gray-50 px-5 py-3">
                {/* Meal & Baggage */}
                <div className="flex items-center gap-4 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                        <Umbrella className="h-3.5 w-3.5 text-teal-500" />
                        <span className="font-semibold">Meal:</span>
                        <span className="uppercase">{ticket.meal}</span>
                    </div>
                    {ticket.baggage && (
                        <div className="flex items-center gap-1">
                            <Briefcase className="h-3.5 w-3.5 text-teal-500" />
                            <span>{ticket.baggage}</span>
                        </div>
                    )}
                    <div className={`text-xs font-semibold ${ticket.remaining_seats <= 5 ? 'text-red-500' : 'text-gray-400'}`}>
                        {ticket.remaining_seats} seat{ticket.remaining_seats !== 1 ? 's' : ''} left
                    </div>
                </div>

                {/* Price + Book */}
                <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                        <p className="text-[10px] text-gray-400">per person</p>
                        <p className="text-base font-black text-gray-900">
                            PKR {ticket.price.toLocaleString()}
                        </p>
                    </div>
                    <button
                        onClick={() => onBookNow(ticket)}
                        className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-bold text-white shadow hover:bg-teal-700 active:scale-95 transition-all"
                    >
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Booking Modal ────────────────────────────────────────────────────────────

function BookingModal({
    ticket,
    onClose,
    onSuccess,
}: {
    ticket: Ticket | null;
    onClose: () => void;
    onSuccess: () => void;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        passengers: '1',
        contact_phone: '',
        notes: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(`/group-tickets/${ticket!.id}/book`, {
            onSuccess: () => { reset(); onSuccess(); },
        });
    }

    if (!ticket) return null;

    return (
        <DialogContent className="max-w-md">
            <DialogTitle className="text-lg font-bold">
                Book — {ticket.from_city} → {ticket.to_city}
            </DialogTitle>
            <div className="mb-4 rounded-lg bg-teal-50 px-4 py-3 text-sm text-teal-800">
                <div className="font-semibold">{ticket.airline} · {ticket.flight_no ?? ''}</div>
                <div>{formatDate(ticket.dep_date)} · {formatTime(ticket.dep_time)}</div>
                <div className="mt-1 text-base font-bold">PKR {ticket.price.toLocaleString()} / person</div>
            </div>
            <form onSubmit={submit} className="flex flex-col gap-4">
                <div className="space-y-1">
                    <Label>
                        Number of Passengers <span className="text-destructive">*</span>
                        <span className={`ml-2 text-xs font-normal ${ticket.remaining_seats <= 5 ? 'text-red-500' : 'text-gray-400'}`}>
                            (max {ticket.remaining_seats} available)
                        </span>
                    </Label>
                    <Input type="number" min="1" max={ticket.remaining_seats} required value={data.passengers}
                        onChange={e => setData('passengers', e.target.value)} />
                    {errors.passengers && <p className="text-xs text-red-500">{errors.passengers}</p>}
                </div>
                <div className="space-y-1">
                    <Label>Contact Phone <span className="text-destructive">*</span></Label>
                    <Input placeholder="+92 311 1234567" required value={data.contact_phone}
                        onChange={e => setData('contact_phone', e.target.value)} />
                    {errors.contact_phone && <p className="text-xs text-red-500">{errors.contact_phone}</p>}
                </div>
                <div className="space-y-1">
                    <Label>Notes (optional)</Label>
                    <textarea rows={2} placeholder="Any special requirements…"
                        value={data.notes} onChange={e => setData('notes', e.target.value)}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none" />
                </div>
                {data.passengers && (
                    <div className="rounded-lg bg-gray-50 px-3 py-2 text-sm">
                        <span className="text-gray-500">Estimated Total: </span>
                        <span className="font-bold text-teal-700">
                            PKR {(ticket.price * (parseInt(data.passengers) || 0)).toLocaleString()}
                        </span>
                    </div>
                )}
                <div className="flex gap-3">
                    <Button type="submit" disabled={processing} className="flex-1 bg-teal-600 hover:bg-teal-700">
                        {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                        Confirm Booking
                    </Button>
                    <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                </div>
            </form>
        </DialogContent>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const CAT_LABELS: Record<string, string> = {
    umrah: 'Umrah', visit: 'KSA One Way Groups', hajj: 'UAE One Way Groups', tour: 'UK One Way Groups', '': 'All Type',
};

export default function GroupTicketsPage({
    tickets, categories, activeCategory,
}: {
    tickets: Ticket[];
    categories: string[];
    activeCategory: string;
}) {
    const { auth } = usePage<SharedData>().props;

    const [mobileOpen, setMobileOpen]   = useState(false);
    const [authModal, setAuthModal]     = useState(false);
    const [authTab, setAuthTab]         = useState<'login' | 'register'>('login');
    const [bookingTicket, setBookingTicket] = useState<Ticket | null>(null);
    const [successMsg, setSuccessMsg]   = useState('');

    const navLinks = ['Home', 'About', 'Destinations', 'Packages', 'Services', 'Contact'];

    function selectCategory(cat: string) {
        router.get('/group-tickets', { category: cat }, { preserveState: true, replace: true });
    }

    function handleBookNow(ticket: Ticket) {
        if (!auth.user) {
            setAuthTab('login');
            setAuthModal(true);
        } else {
            setBookingTicket(ticket);
        }
    }

    function closeBooking() { setBookingTicket(null); }
    function onBookingSuccess() {
        setBookingTicket(null);
        setSuccessMsg('Booking submitted! Our team will contact you shortly.');
        setTimeout(() => setSuccessMsg(''), 6000);
    }

    return (
        <>
            <Head title="Group Tickets — AL Abrar Group of Travels">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />
            </Head>

            {/* ── NAVBAR ── */}
            <header className="fixed top-0 z-50 w-full bg-white/95 shadow-sm backdrop-blur-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-600">
                            <Plane className="h-5 w-5 text-white" />
                        </div>
                        <div className="leading-tight">
                            <p className="text-sm font-bold text-gray-900">AL Abrar</p>
                            <p className="text-[10px] text-teal-600">Group of Travels</p>
                        </div>
                    </Link>

                    <nav className="hidden items-center gap-6 md:flex">
                        {navLinks.map(link => (
                            <Link key={link} href={`/#${link.toLowerCase()}`}
                                className="text-sm font-medium text-gray-600 hover:text-teal-600">
                                {link}
                            </Link>
                        ))}
                        <Link href="/group-tickets"
                            className="text-sm font-semibold text-teal-600 underline underline-offset-4">
                            Group Ticket
                        </Link>
                        {auth.user ? (
                            <Link href="/bank-details" className="text-sm font-semibold text-teal-600">Bank Details</Link>
                        ) : (
                            <button
                                onClick={() => { setAuthTab('login'); setAuthModal(true); }}
                                className="text-sm font-semibold text-teal-600 hover:text-teal-700"
                            >
                                Bank Details
                            </button>
                        )}
                    </nav>

                    <div className="flex items-center gap-2">
                        {auth.user ? (
                            <Link href={route('dashboard')}
                                className="rounded-full bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700">
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <button onClick={() => { setAuthTab('login'); setAuthModal(true); }}
                                    className="hidden rounded-full border border-teal-600 px-4 py-1.5 text-sm font-medium text-teal-600 hover:bg-teal-50 md:block">
                                    Login
                                </button>
                                <button onClick={() => { setAuthTab('register'); setAuthModal(true); }}
                                    className="rounded-full bg-teal-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-teal-700">
                                    Register
                                </button>
                            </>
                        )}
                        <button className="rounded-md p-2 text-gray-600 hover:bg-gray-100 md:hidden"
                            onClick={() => setMobileOpen(!mobileOpen)}>
                            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                {mobileOpen && (
                    <div className="border-t bg-white px-4 py-4 md:hidden">
                        <nav className="flex flex-col gap-3">
                            {navLinks.map(link => (
                                <Link key={link} href={`/#${link.toLowerCase()}`}
                                    onClick={() => setMobileOpen(false)}
                                    className="text-sm font-medium text-gray-700 hover:text-teal-600">
                                    {link}
                                </Link>
                            ))}
                            <Link href="/group-tickets" onClick={() => setMobileOpen(false)}
                                className="text-sm font-semibold text-teal-600">
                                Group Ticket
                            </Link>
                            {auth.user ? (
                                <Link href="/bank-details" onClick={() => setMobileOpen(false)}
                                    className="text-sm font-semibold text-teal-600">
                                    Bank Details
                                </Link>
                            ) : (
                                <button
                                    onClick={() => { setAuthTab('login'); setAuthModal(true); setMobileOpen(false); }}
                                    className="text-sm font-semibold text-teal-600 text-left"
                                >
                                    Bank Details
                                </button>
                            )}
                            {!auth.user && (
                                <button onClick={() => { setAuthTab('login'); setAuthModal(true); setMobileOpen(false); }}
                                    className="mt-1 rounded-full border border-teal-600 px-4 py-2 text-sm font-medium text-teal-600">
                                    Login
                                </button>
                            )}
                        </nav>
                    </div>
                )}
            </header>

            {/* ── PAGE HERO ── */}
            <section className="bg-gradient-to-br from-teal-700 to-teal-900 pt-28 pb-12 text-center text-white">
                <div className="mx-auto max-w-3xl px-4">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-teal-200">
                        AL Abrar Group of Travels
                    </p>
                    <h1 className="text-3xl font-black md:text-5xl">Group Tickets</h1>
                    <p className="mt-3 text-teal-200 text-sm md:text-base">
                        Book your seat on our group flights — Umrah, Visit, Hajj and more at the best PKR rates.
                    </p>
                </div>
            </section>

            {/* ── TABS ── */}
            <div className="sticky top-[65px] z-40 bg-white border-b shadow-sm">
                <div className="mx-auto max-w-7xl px-4 md:px-6">
                    <div className="flex gap-1 overflow-x-auto py-3 scrollbar-none">
                        {categories.map(cat => (
                            <button key={cat} onClick={() => selectCategory(cat)}
                                className={`shrink-0 rounded-full px-5 py-2 text-sm font-semibold capitalize transition-colors
                                    ${activeCategory === cat
                                        ? 'bg-teal-600 text-white shadow-sm'
                                        : 'bg-gray-100 text-gray-600 hover:bg-teal-50 hover:text-teal-700'}`}>
                                {CAT_LABELS[cat] ?? cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── MAIN CONTENT ── */}
            <main className="min-h-[60vh] bg-gray-50 py-10">
                <div className="mx-auto max-w-7xl px-4 md:px-6">

                    {successMsg && (
                        <div className="mb-6 rounded-xl bg-green-50 border border-green-200 px-5 py-4 text-sm text-green-700 font-medium flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-600 shrink-0" />
                            {successMsg}
                        </div>
                    )}

                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-800 capitalize">
                            {CAT_LABELS[activeCategory] ?? activeCategory} Tickets
                            <span className="ml-2 text-sm font-normal text-gray-400">({tickets.length} available)</span>
                        </h2>
                    </div>

                    {tickets.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center text-gray-400">
                            <Plane className="h-12 w-12 mb-4 opacity-30" />
                            <p className="text-lg font-semibold">No tickets available</p>
                            <p className="text-sm mt-1">Check back soon or try another category.</p>
                        </div>
                    ) : (
                        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-2">
                            {tickets.map(ticket => (
                                <TicketCard key={ticket.id} ticket={ticket} onBookNow={handleBookNow} />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* ── FOOTER ── */}
            <footer className="bg-gray-900 pt-14 pb-6 text-gray-400">
                <div className="mx-auto max-w-7xl px-4 md:px-6">
                    <div className="grid gap-10 md:grid-cols-3">
                        <div>
                            <div className="mb-4 flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600">
                                    <Plane className="h-4 w-4 text-white" />
                                </div>
                                <p className="font-bold text-white">AL Abrar Group of Travels</p>
                            </div>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-start gap-2">
                                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" />
                                    Main Bazaar, Near Telecom Exchange, Islamabad
                                </li>
                                <li className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 shrink-0 text-teal-500" />
                                    +92 311 1234567
                                </li>
                                <li className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 shrink-0 text-teal-500" />
                                    info@alabrartravels.com
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="mb-4 font-semibold text-white">Quick Links</h4>
                            <ul className="space-y-2 text-sm">
                                {['Home', 'Group Tickets', 'Umrah Packages', 'Visa Services', 'Contact Us'].map(link => (
                                    <li key={link}>
                                        <a href="#" className="hover:text-teal-400 transition-colors">{link}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="mb-4 font-semibold text-white">Follow Us</h4>
                            <div className="flex gap-3">
                                {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                                    <a key={i} href="#"
                                        className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 hover:bg-teal-600 hover:text-white transition-colors">
                                        <Icon className="h-4 w-4" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="mt-10 border-t border-gray-800 pt-5 text-center text-xs">
                        © {new Date().getFullYear()} AL Abrar Group of Travels. All rights reserved.
                    </div>
                </div>
            </footer>

            {/* ── AUTH MODAL ── */}
            <Dialog open={authModal} onOpenChange={setAuthModal}>
                <DialogContent className="max-w-md">
                    <DialogTitle className="text-lg font-bold">
                        {authTab === 'login' ? 'Login to Book' : 'Create an Account'}
                    </DialogTitle>
                    <div className="mb-4 flex rounded-lg bg-gray-100 p-1">
                        <button onClick={() => setAuthTab('login')}
                            className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-colors ${authTab === 'login' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>
                            Login
                        </button>
                        <button onClick={() => setAuthTab('register')}
                            className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-colors ${authTab === 'register' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>
                            Register
                        </button>
                    </div>
                    {authTab === 'login'
                        ? <LoginForm onClose={() => setAuthModal(false)} />
                        : <RegisterForm onClose={() => setAuthModal(false)} />
                    }
                </DialogContent>
            </Dialog>

            {/* ── BOOKING MODAL ── */}
            <Dialog open={!!bookingTicket} onOpenChange={v => !v && closeBooking()}>
                <BookingModal ticket={bookingTicket} onClose={closeBooking} onSuccess={onBookingSuccess} />
            </Dialog>
        </>
    );
}
