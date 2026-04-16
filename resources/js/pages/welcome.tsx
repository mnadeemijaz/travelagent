import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type SharedData } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    Building2,
    ChevronLeft,
    ChevronRight,
    Facebook,
    FileCheck,
    Globe,
    Instagram,
    LoaderCircle,
    Mail,
    MapPin,
    Menu,
    Phone,
    Plane,
    Shield,
    Star,
    Twitter,
    Umbrella,
    X,
    Youtube,
    ZoomIn,
    ZoomOut,
} from 'lucide-react';
import { FormEventHandler, useCallback, useEffect, useRef, useState } from 'react';

// ─── Data ────────────────────────────────────────────────────────────────────

const services = [
    {
        icon: Umbrella,
        title: 'Umrah Services',
        desc: 'Complete Umrah packages with accommodation, guided tours and visa assistance from Pakistan.',
    },
    {
        icon: Plane,
        title: 'Ticket Booking',
        desc: 'Domestic and international air tickets at competitive prices with instant confirmation.',
    },
    {
        icon: Building2,
        title: 'Hotel Booking',
        desc: 'Handpicked hotels worldwide to suit every budget, from economy to 5-star luxury.',
    },
    {
        icon: FileCheck,
        title: 'Visa Services',
        desc: 'Hassle-free visa processing for all major destinations with high approval rates.',
    },
    {
        icon: Globe,
        title: 'Tour Packages',
        desc: 'Curated domestic and international tour packages for families, couples and groups.',
    },
    {
        icon: Shield,
        title: 'Travel Insurance',
        desc: 'Comprehensive travel insurance covering medical, trip cancellation and lost baggage.',
    },
];

// DB-driven types
interface DbDestination { id: number; name: string; country: string | null; price: string; image_url: string; }
interface DbPackage    { id: number; name: string; price: string; image_url: string; }
interface DbExperience { id: number; name: string; image_url: string; }

const testimonials = [
    {
        name: 'Farhan Ahmed',
        role: 'Lahore',
        text: '"Al Abrar made our family Umrah trip absolutely seamless. Everything from visa to hotel was perfectly arranged. Highly recommended!"',
        stars: 5,
    },
    {
        name: 'Sana Malik',
        role: 'Karachi',
        text: '"Booked a Dubai tour package and it exceeded our expectations. Excellent service, great hotels and very affordable prices in PKR."',
        stars: 5,
    },
    {
        name: 'Zubair Hassan',
        role: 'Islamabad',
        text: '"Professional team, prompt responses and transparent pricing. Got our Turkey visa approved in 5 days. Will book again for sure!"',
        stars: 5,
    },
];

// gallery is now DB-driven (passed as prop)

// ─── Auth Modal Forms ────────────────────────────────────────────────────────

function LoginForm({ onClose }: { onClose: () => void }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), { onSuccess: onClose, onFinish: () => reset('password') });
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-4">
            <div className="space-y-1">
                <Label htmlFor="login-email">Email</Label>
                <Input
                    id="login-email"
                    type="email"
                    required
                    autoFocus
                    placeholder="email@example.com"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>
            <div className="space-y-1">
                <Label htmlFor="login-password">Password</Label>
                <Input
                    id="login-password"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                />
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
            </div>
            <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        className="rounded"
                        checked={data.remember}
                        onChange={(e) => setData('remember', e.target.checked)}
                    />
                    Remember me
                </label>
                <Link href={route('password.request')} className="text-teal-600 hover:underline">
                    Forgot password?
                </Link>
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
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'user' as 'user' | 'agent',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), { onSuccess: onClose, onFinish: () => reset('password', 'password_confirmation') });
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-4">
            <div className="space-y-1">
                <Label htmlFor="reg-name">Full Name</Label>
                <Input
                    id="reg-name"
                    required
                    autoFocus
                    placeholder="Your full name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>
            <div className="space-y-1">
                <Label htmlFor="reg-email">Email</Label>
                <Input
                    id="reg-email"
                    type="email"
                    required
                    placeholder="email@example.com"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>
            <div className="space-y-1">
                <Label htmlFor="reg-password">Password</Label>
                <Input
                    id="reg-password"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                />
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
            </div>
            <div className="space-y-1">
                <Label htmlFor="reg-confirm">Confirm Password</Label>
                <Input
                    id="reg-confirm"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                />
                {errors.password_confirmation && <p className="text-xs text-red-500">{errors.password_confirmation}</p>}
            </div>
            <div className="space-y-1">
                <Label>Register As</Label>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => setData('role', 'user')}
                        className={`rounded-lg border-2 px-4 py-2 text-sm font-medium transition-colors ${
                            data.role === 'user'
                                ? 'border-teal-600 bg-teal-50 text-teal-700'
                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                    >
                        Traveler
                    </button>
                    <button
                        type="button"
                        onClick={() => setData('role', 'agent')}
                        className={`rounded-lg border-2 px-4 py-2 text-sm font-medium transition-colors ${
                            data.role === 'agent'
                                ? 'border-teal-600 bg-teal-50 text-teal-700'
                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                    >
                        Travel Agent
                    </button>
                </div>
                {errors.role && <p className="text-xs text-red-500">{errors.role}</p>}
            </div>
            <Button type="submit" disabled={processing} className="w-full bg-teal-600 hover:bg-teal-700">
                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
            </Button>
        </form>
    );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

interface WelcomeProps {
    destinations: DbDestination[];
    packages: DbPackage[];
    experiences: DbExperience[];
}

export default function Welcome({ destinations, packages, experiences }: WelcomeProps) {
    const { auth } = usePage<SharedData>().props;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [authTab, setAuthTab] = useState<'login' | 'register'>('login');

    function openLogin() {
        setAuthTab('login');
        setModalOpen(true);
    }
    function openRegister() {
        setAuthTab('register');
        setModalOpen(true);
    }

    const navLinks = ['Home', 'About', 'Destinations', 'Packages', 'Services', 'Contact'];

    return (
        <>
            <Head title="AL Abrar Group of Travels - Your Trusted Travel Partner">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />
            </Head>

            {/* ── NAVBAR ─────────────────────────────────────────────────── */}
            <header className="fixed top-0 z-50 w-full bg-white/95 shadow-sm backdrop-blur-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
                    {/* Logo */}
                    <a href="#hero" className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-600">
                            <Plane className="h-5 w-5 text-white" />
                        </div>
                        <div className="leading-tight">
                            <p className="text-sm font-bold text-gray-900">AL Abrar</p>
                            <p className="text-[10px] text-teal-600">Group of Travels</p>
                        </div>
                    </a>

                    {/* Desktop Nav */}
                    <nav className="hidden items-center gap-6 md:flex">
                        {navLinks.map((link) => (
                            <a
                                key={link}
                                href={`#${link.toLowerCase()}`}
                                className="text-sm font-medium text-gray-600 transition-colors hover:text-teal-600"
                            >
                                {link}
                            </a>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="rounded-full bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <button
                                    onClick={openLogin}
                                    className="hidden rounded-full border border-teal-600 px-4 py-1.5 text-sm font-medium text-teal-600 hover:bg-teal-50 md:block"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={openRegister}
                                    className="rounded-full bg-teal-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-teal-700"
                                >
                                    Register
                                </button>
                            </>
                        )}
                        <button
                            className="rounded-md p-2 text-gray-600 hover:bg-gray-100 md:hidden"
                            onClick={() => setMobileOpen(!mobileOpen)}
                        >
                            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileOpen && (
                    <div className="border-t bg-white px-4 py-4 md:hidden">
                        <nav className="flex flex-col gap-3">
                            {navLinks.map((link) => (
                                <a
                                    key={link}
                                    href={`#${link.toLowerCase()}`}
                                    onClick={() => setMobileOpen(false)}
                                    className="text-sm font-medium text-gray-700 hover:text-teal-600"
                                >
                                    {link}
                                </a>
                            ))}
                            {!auth.user && (
                                <button
                                    onClick={() => { openLogin(); setMobileOpen(false); }}
                                    className="mt-1 rounded-full border border-teal-600 px-4 py-2 text-sm font-medium text-teal-600"
                                >
                                    Login
                                </button>
                            )}
                        </nav>
                    </div>
                )}
            </header>

            {/* ── HERO ───────────────────────────────────────────────────── */}
            <section
                id="hero"
                className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-teal-900 to-slate-800 pt-16"
            >
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-10 h-64 w-64 rounded-full bg-teal-400 blur-3xl" />
                    <div className="absolute right-10 bottom-20 h-80 w-80 rounded-full bg-blue-400 blur-3xl" />
                </div>

                <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-teal-400">
                        Pakistan's Trusted Travel Partner
                    </p>
                    <h1 className="mb-4 text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                        AL Abrar Group
                        <br />
                        <span className="text-teal-400">of Travels</span>
                    </h1>
                    <p className="mx-auto mb-8 max-w-xl text-base text-gray-300 md:text-lg">
                        Your gateway to the world — Umrah packages, international tours, airline tickets, visa services
                        and hotel bookings at unbeatable PKR prices.
                    </p>

                    {/* CTA Buttons */}
                    {auth.user ? (
                        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <Link
                                href={route('dashboard')}
                                className="rounded-full bg-teal-500 px-8 py-3 text-base font-semibold text-white shadow-lg hover:bg-teal-400"
                            >
                                Go to Dashboard
                            </Link>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <button
                                onClick={openRegister}
                                className="rounded-full bg-teal-500 px-8 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-teal-400"
                            >
                                Start Your Journey
                            </button>
                            <button
                                onClick={openLogin}
                                className="rounded-full border-2 border-white/40 px-8 py-3 text-base font-semibold text-white transition hover:border-white hover:bg-white/10"
                            >
                                Sign In
                            </button>
                        </div>
                    )}

                    {/* Stats bar */}
                    <div className="mx-auto mt-14 grid max-w-2xl grid-cols-3 gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                        {[
                            { value: '10,000+', label: 'Happy Travelers' },
                            { value: '50+', label: 'Destinations' },
                            { value: '15 Years', label: 'Experience' },
                        ].map((s) => (
                            <div key={s.label} className="text-center">
                                <p className="text-xl font-bold text-teal-400 sm:text-2xl">{s.value}</p>
                                <p className="text-xs text-gray-400 sm:text-sm">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Wave divider */}
                <div className="absolute bottom-0 left-0 w-full">
                    <svg viewBox="0 0 1440 60" className="h-12 w-full fill-white" preserveAspectRatio="none">
                        <path d="M0,40 C360,0 1080,60 1440,20 L1440,60 L0,60 Z" />
                    </svg>
                </div>
            </section>

            {/* ── SERVICES ───────────────────────────────────────────────── */}
            <section id="services" className="bg-white py-20">
                <div className="mx-auto max-w-7xl px-4 md:px-6">
                    <div className="mb-12 text-center">
                        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-teal-600">
                            Our Services
                        </p>
                        <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">What We Offer For You</h2>
                        <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-teal-500" />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {services.map(({ icon: Icon, title, desc }) => (
                            <div
                                key={title}
                                className="group rounded-2xl border border-gray-100 p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-teal-200 hover:shadow-md"
                            >
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600 transition-colors group-hover:bg-teal-600 group-hover:text-white">
                                    <Icon className="h-6 w-6" />
                                </div>
                                <h3 className="mb-2 text-base font-semibold text-gray-900">{title}</h3>
                                <p className="text-sm leading-relaxed text-gray-500">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── ABOUT ──────────────────────────────────────────────────── */}
            <section id="about" className="bg-gray-50 py-20">
                <div className="mx-auto max-w-7xl px-4 md:px-6">
                    <div className="grid items-center gap-10 md:grid-cols-2">
                        {/* Visual */}
                        <div className="relative">
                            <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-teal-400 to-blue-600 p-1 shadow-xl">
                                <div className="flex h-72 items-center justify-center rounded-3xl bg-gradient-to-br from-teal-500/90 to-blue-700/90 md:h-96">
                                    <div className="text-center text-white">
                                        <div className="mb-4 text-7xl">✈️</div>
                                        <p className="text-lg font-semibold">Explore the World</p>
                                        <p className="text-sm opacity-80">with AL Abrar Travels</p>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -bottom-4 -right-4 rounded-2xl bg-teal-600 px-5 py-3 text-white shadow-lg">
                                <p className="text-2xl font-bold">15+</p>
                                <p className="text-xs">Years of Excellence</p>
                            </div>
                        </div>

                        {/* Text */}
                        <div>
                            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-teal-600">
                                About Us
                            </p>
                            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                                A Best Place to Book Your Desired Tickets &amp; Umrah Packages
                            </h2>
                            <p className="mb-4 leading-relaxed text-gray-600">
                                AL Abrar Group of Travels is a premier travel agency based in Pakistan, dedicated to
                                providing exceptional travel experiences at honest PKR prices. From Umrah pilgrimages to
                                international holiday packages, we handle every detail with care.
                            </p>
                            <p className="mb-6 leading-relaxed text-gray-600">
                                Our expert team offers personalized services including airline ticketing, hotel bookings,
                                visa processing for UAE, Saudi Arabia, Turkey, UK, and more. We pride ourselves on
                                transparency, reliability and customer satisfaction.
                            </p>
                            <ul className="mb-8 space-y-2">
                                {[
                                    'IATA Certified Travel Agency',
                                    'Umrah & Hajj Licensed Operator',
                                    'Visa Success Rate 98%',
                                    '24/7 Customer Support',
                                ].map((item) => (
                                    <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                                        <span className="h-2 w-2 rounded-full bg-teal-500" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={openRegister}
                                className="rounded-full bg-teal-600 px-7 py-3 text-sm font-semibold text-white shadow hover:bg-teal-700"
                            >
                                Start Planning →
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── DESTINATIONS ───────────────────────────────────────────── */}
            <section id="destinations" className="bg-white py-20">
                <div className="mx-auto max-w-7xl px-4 md:px-6">
                    <div className="mb-12 text-center">
                        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-teal-600">
                            Popular Destinations
                        </p>
                        <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Choose Your Country</h2>
                        <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-teal-500" />
                    </div>

                    {destinations.length === 0 ? (
                        <p className="text-center text-gray-400">Destinations coming soon.</p>
                    ) : (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {destinations.map((d) => (
                                <div
                                    key={d.id}
                                    className="group relative overflow-hidden rounded-2xl shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg"
                                >
                                    <div className="h-52 w-full bg-gray-200">
                                        {d.image_url && (
                                            <img src={d.image_url} alt={d.name} className="h-full w-full object-cover" />
                                        )}
                                    </div>
                                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent p-4">
                                        <p className="text-lg font-bold text-white">{d.name}</p>
                                        {d.country && <p className="text-sm text-gray-300">{d.country}</p>}
                                        <div className="mt-2 flex items-center justify-between">
                                            <span className="text-xs text-gray-300">Starting from</span>
                                            <span className="rounded-full bg-teal-500 px-3 py-1 text-xs font-bold text-white">
                                                {d.price}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ── PACKAGES ───────────────────────────────────────────────── */}
            <section id="packages" className="bg-gray-50 py-20">
                <div className="mx-auto max-w-7xl px-4 md:px-6">
                    <div className="mb-8 text-center">
                        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-teal-600">
                            Tour Packages
                        </p>
                        <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Explore Our Packages</h2>
                        <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-teal-500" />
                    </div>

                    {packages.length === 0 ? (
                        <p className="text-center text-gray-400">Tour packages coming soon.</p>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {packages.map((pkg) => (
                                <div
                                    key={pkg.id}
                                    className="overflow-hidden rounded-2xl bg-white shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg"
                                >
                                    <div className="h-44 w-full bg-gray-200">
                                        {pkg.image_url && (
                                            <img src={pkg.image_url} alt={pkg.name} className="h-full w-full object-cover" />
                                        )}
                                    </div>
                                    <div className="p-5">
                                        <h3 className="mb-1 font-bold text-gray-900">{pkg.name}</h3>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs text-gray-400">Starting from</p>
                                                <p className="text-base font-bold text-teal-600">{pkg.price}</p>
                                            </div>
                                            <button
                                                onClick={openRegister}
                                                className="rounded-full bg-teal-600 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-700"
                                            >
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ── EXPERIENCES GALLERY ────────────────────────────────────── */}
            <section className="bg-white py-20">
                <div className="mx-auto max-w-7xl px-4 md:px-6">
                    <div className="mb-12 text-center">
                        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-teal-600">
                            Travel Experiences
                        </p>
                        <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Moments Worth Remembering</h2>
                        <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-teal-500" />
                    </div>
                    {experiences.length === 0 ? (
                        <p className="text-center text-gray-400">Gallery coming soon.</p>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                            {experiences.map((item) => (
                                <div
                                    key={item.id}
                                    className="group relative h-40 cursor-pointer overflow-hidden rounded-2xl bg-gray-200 md:h-52"
                                >
                                    {item.image_url && (
                                        <img
                                            src={item.image_url}
                                            alt={item.name}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    )}
                                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-3">
                                        <p className="text-sm font-semibold text-white">{item.name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ── TESTIMONIALS ───────────────────────────────────────────── */}
            <section className="bg-gray-50 py-20">
                <div className="mx-auto max-w-7xl px-4 md:px-6">
                    <div className="mb-12 text-center">
                        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-teal-600">
                            What Our Clients Say
                        </p>
                        <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                            Our Clients are Important to Us
                        </h2>
                        <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-teal-500" />
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {testimonials.map((t) => (
                            <div key={t.name} className="rounded-2xl bg-white p-6 shadow-sm">
                                <div className="mb-3 flex gap-0.5">
                                    {Array.from({ length: t.stars }).map((_, i) => (
                                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <p className="mb-4 text-sm leading-relaxed text-gray-600 italic">{t.text}</p>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-base font-bold text-teal-700">
                                        {t.name[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                                        <p className="text-xs text-gray-400">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA BANNER ─────────────────────────────────────────────── */}
            <section className="bg-gradient-to-r from-teal-600 to-teal-800 py-16">
                <div className="mx-auto max-w-3xl px-4 text-center">
                    <h2 className="mb-3 text-2xl font-bold text-white md:text-3xl">
                        Ready to Plan Your Dream Trip?
                    </h2>
                    <p className="mb-7 text-teal-100">
                        Register today and get exclusive PKR rates on all destinations.
                    </p>
                    <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <button
                            onClick={openRegister}
                            className="rounded-full bg-white px-8 py-3 text-sm font-bold text-teal-700 shadow hover:bg-gray-100"
                        >
                            Register Now — It's Free
                        </button>
                        <button
                            onClick={openLogin}
                            className="rounded-full border-2 border-white/50 px-8 py-3 text-sm font-semibold text-white hover:border-white hover:bg-white/10"
                        >
                            Already a Member? Login
                        </button>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ─────────────────────────────────────────────────── */}
            <footer id="contact" className="bg-gray-900 pt-14 pb-6 text-gray-400">
                <div className="mx-auto max-w-7xl px-4 md:px-6">
                    <div className="grid gap-10 md:grid-cols-3">
                        {/* Contact */}
                        <div>
                            <div className="mb-4 flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600">
                                    <Plane className="h-4 w-4 text-white" />
                                </div>
                                <p className="font-bold text-white">AL Abrar Group of Travels</p>
                            </div>
                            <p className="mb-4 text-sm leading-relaxed">
                                Your trusted partner for Umrah, international tours, airline tickets and visa services.
                            </p>
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

                        {/* Useful Links */}
                        <div>
                            <h4 className="mb-4 font-semibold text-white">Useful Links</h4>
                            <ul className="space-y-2 text-sm">
                                {['About Us', 'Our Services', 'Tour Packages', 'Umrah Packages', 'Visa Services', 'Contact Us', 'Privacy Policy'].map(
                                    (link) => (
                                        <li key={link}>
                                            <a href="#" className="transition-colors hover:text-teal-400">
                                                {link}
                                            </a>
                                        </li>
                                    ),
                                )}
                            </ul>
                        </div>

                        {/* Social */}
                        <div>
                            <h4 className="mb-4 font-semibold text-white">Follow Us</h4>
                            <div className="mb-6 flex gap-3">
                                {[
                                    { icon: Facebook, label: 'Facebook' },
                                    { icon: Twitter, label: 'Twitter' },
                                    { icon: Instagram, label: 'Instagram' },
                                    { icon: Youtube, label: 'YouTube' },
                                ].map(({ icon: Icon, label }) => (
                                    <a
                                        key={label}
                                        href="#"
                                        aria-label={label}
                                        className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition-colors hover:bg-teal-600 hover:text-white"
                                    >
                                        <Icon className="h-4 w-4" />
                                    </a>
                                ))}
                            </div>
                            <div className="rounded-xl border border-gray-700 p-4">
                                <p className="mb-2 text-sm font-medium text-white">Newsletter</p>
                                <p className="mb-3 text-xs">Get exclusive travel deals in your inbox.</p>
                                <div className="flex gap-2">
                                    <input
                                        type="email"
                                        placeholder="Your email"
                                        className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-xs text-white placeholder-gray-500 focus:border-teal-500 focus:outline-none"
                                    />
                                    <button className="rounded-lg bg-teal-600 px-3 py-2 text-xs font-medium text-white hover:bg-teal-700">
                                        Go
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 border-t border-gray-800 pt-5 text-center text-xs">
                        © {new Date().getFullYear()} AL Abrar Group of Travels. All rights reserved. |{' '}
                        <a href="#" className="hover:text-teal-400">
                            Privacy Policy
                        </a>{' '}
                        |{' '}
                        <a href="#" className="hover:text-teal-400">
                            Terms &amp; Conditions
                        </a>
                    </div>
                </div>
            </footer>

            {/* ── AUTH MODAL ─────────────────────────────────────────────── */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="w-full max-w-md rounded-2xl p-0 overflow-hidden">
                    {/* Modal Header */}
                    <div className="bg-gradient-to-r from-teal-600 to-teal-800 px-6 pt-6 pb-5">
                        <DialogTitle className="text-lg font-bold text-white">
                            {authTab === 'login' ? 'Welcome Back!' : 'Create Your Account'}
                        </DialogTitle>
                        <p className="mt-1 text-sm text-teal-100">
                            {authTab === 'login'
                                ? 'Sign in to access your travel bookings'
                                : 'Join AL Abrar Travels today'}
                        </p>
                        {/* Tabs */}
                        <div className="mt-4 flex rounded-full bg-teal-700/50 p-1">
                            <button
                                onClick={() => setAuthTab('login')}
                                className={`flex-1 rounded-full py-1.5 text-sm font-medium transition-colors ${
                                    authTab === 'login' ? 'bg-white text-teal-700' : 'text-white hover:bg-white/10'
                                }`}
                            >
                                Login
                            </button>
                            <button
                                onClick={() => setAuthTab('register')}
                                className={`flex-1 rounded-full py-1.5 text-sm font-medium transition-colors ${
                                    authTab === 'register' ? 'bg-white text-teal-700' : 'text-white hover:bg-white/10'
                                }`}
                            >
                                Register
                            </button>
                        </div>
                    </div>

                    {/* Modal Body */}
                    <div className="px-6 py-5">
                        {authTab === 'login' ? (
                            <LoginForm onClose={() => setModalOpen(false)} />
                        ) : (
                            <RegisterForm onClose={() => setModalOpen(false)} />
                        )}
                        <p className="mt-4 text-center text-xs text-gray-500">
                            {authTab === 'login' ? (
                                <>
                                    Don't have an account?{' '}
                                    <button onClick={() => setAuthTab('register')} className="font-medium text-teal-600 hover:underline">
                                        Register here
                                    </button>
                                </>
                            ) : (
                                <>
                                    Already have an account?{' '}
                                    <button onClick={() => setAuthTab('login')} className="font-medium text-teal-600 hover:underline">
                                        Login here
                                    </button>
                                </>
                            )}
                        </p>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
