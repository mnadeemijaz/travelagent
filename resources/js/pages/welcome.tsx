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

// Hero slider slides — set `image` to a URL string when you have real photos
const heroSlides = [
    {
        image: "/storage/front/slide-1.jpg" as string | null,
        tag: "Pakistan's Trusted Travel Partner",
        title: 'AL Abrar Group\nof Travels',
        subtitle: 'Your gateway to the world — Umrah packages, international tours, airline tickets, visa services and hotel bookings at unbeatable PKR prices.',
    },
    {
        image: "/storage/front/slide-2.jpg" as string | null,
        tag: 'Sacred Journeys',
        title: 'Umrah &\nHajj Packages',
        subtitle: 'Complete guided Umrah packages with 5-star accommodation in Makkah & Madinah, visa assistance and group/family options.',
    },
    {
        image: "/storage/front/slide-3.jpg" as string | null,
        tag: 'Explore the World',
        title: 'International\nTour Packages',
        subtitle: 'Dubai, Turkey, Europe, Malaysia and beyond — curated holiday packages at the best PKR rates with full support.',
    },
];

// DB-driven types
interface DbDestination { id: number; name: string; country: string | null; price: string; image_url: string; }
interface DbPackage    { id: number; name: string; price: string; image_url: string; }
interface DbExperience  { id: number; name: string; image_url: string; }
interface DbHotelImage { id: number; name: string; city_name: string; price: number; image_url: string; }
interface CompanyConfig { company_name: string; address: string | null; tagline: string | null; phone: string | null; email: string | null; }

// About section slider images
const aboutSlides = [
    { image: '/storage/front/about.jpg',   alt: 'AL Abrar Travels Office' },
    { image: '/storage/front/about-2.jpg', alt: 'Umrah Services' },
    { image: '/storage/front/about-3.jpg', alt: 'Tour Packages' },
    { image: '/storage/front/about-4.jpg', alt: 'Hotel Bookings' },
    { image: '/storage/front/about-5.jpg', alt: 'Visa Services' },
    { image: '/storage/front/about-6.jpg', alt: 'Visa Services' },
    { image: '/storage/front/about-7.jpg', alt: 'Visa Services' },
];

// Flight / travel partners — set `image` to your logo URL when ready
const partners1 = [
    { name: 'IATA', fullName: 'International Air Transport Association', image: "storage/front/iata.png" as string | null },
    { name: 'PSA',  fullName: 'Pakistan Survey Authority',               image: "storage/front/psa.png" as string | null },
    { name: 'PIA',  fullName: 'Pakistan International Airlines',       image: "storage/front/pia.png" as string | null },
    { name: 'TAAP',  fullName: 'Travel Agents Association of Pakistan',       image: "storage/front/taap.png" as string | null },
];
const partners = [
    { name: 'Air Arabia', fullName: 'Air Arabia', image: "storage/front/airarabia.png" as string | null },
    { name: 'Air Sial',  fullName: 'Air Sial',               image: "storage/front/airsial.png" as string | null },
    { name: 'PIA',  fullName: 'Pakistan International Airlines',       image: "storage/front/pia.png" as string | null },
    { name: 'Air Blue',  fullName: 'Air Blue',       image: "storage/front/airblue.png" as string | null },
    { name: 'Fly Jinah',  fullName: 'Fly Jinah',       image: "storage/front/flyjinah.png" as string | null },
    { name: 'Air Araibia',  fullName: 'Air Araibia',       image: "storage/front/airarabia.png" as string | null },
    { name: 'Air Farance',  fullName: 'Air Farance',       image: "storage/front/airfarance.png" as string | null },
    { name: 'Emirates',  fullName: 'Emirates Air Line',       image: "storage/front/emirates.png" as string | null },
    { name: 'Ethihad',  fullName: 'Ethihad Air Line',       image: "storage/front/ethihad.png" as string | null },
    { name: 'Ethiopian',  fullName: 'Ethiopian Air Line',       image: "storage/front/ethiopian.png" as string | null },
    { name: 'K2 Airways',  fullName: 'K2 Airways',       image: "storage/front/k2airways.png" as string | null },
    { name: 'Malindo Air',  fullName: 'Malindo Air',       image: "storage/front/malindoair.png" as string | null },
    { name: 'Pegasus',  fullName: 'Pegasus Air',       image: "storage/front/pegasus.png" as string | null },
    { name: 'Qatar',  fullName: 'Qatar Airways',       image: "storage/front/qatar.png" as string | null },
    { name: 'Serence Air',  fullName: 'Serence Air',       image: "storage/front/serenceair.png" as string | null },
    { name: 'Srilankan',  fullName: 'Srilankan Air Line',       image: "storage/front/srilankan.png" as string | null },
    { name: 'Turkish',  fullName: 'Turkish Air Line',       image: "storage/front/turkish.png" as string | null },
    { name: 'Uzbekistan',  fullName: 'Uzbekistan Air Line',       image: "storage/front/uzbekistan.png" as string | null },
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
    hotelImages: DbHotelImage[];
    companyConfig: CompanyConfig;
}

export default function Welcome({ destinations, packages, experiences, hotelImages, companyConfig }: WelcomeProps) {
    const { auth } = usePage<SharedData>().props;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [authTab, setAuthTab] = useState<'login' | 'register'>('login');

    // About section image slider
    const [aboutSlide, setAboutSlide] = useState(0);
    const aboutTimer = useRef<ReturnType<typeof setInterval> | null>(null);

    const resetAboutTimer = useCallback(() => {
        if (aboutTimer.current) clearInterval(aboutTimer.current);
        aboutTimer.current = setInterval(() => setAboutSlide((s) => (s + 1) % aboutSlides.length), 4000);
    }, []);

    useEffect(() => {
        resetAboutTimer();
        return () => { if (aboutTimer.current) clearInterval(aboutTimer.current); };
    }, [resetAboutTimer]);

    function aboutPrev() { setAboutSlide((s) => (s - 1 + aboutSlides.length) % aboutSlides.length); resetAboutTimer(); }
    function aboutNext() { setAboutSlide((s) => (s + 1) % aboutSlides.length); resetAboutTimer(); }

    // Hero slider
    const [heroSlide, setHeroSlide] = useState(0);
    const heroTimer = useRef<ReturnType<typeof setInterval> | null>(null);

    const resetHeroTimer = useCallback(() => {
        if (heroTimer.current) clearInterval(heroTimer.current);
        heroTimer.current = setInterval(() => setHeroSlide((s) => (s + 1) % heroSlides.length), 5000);
    }, []);

    useEffect(() => {
        resetHeroTimer();
        return () => { if (heroTimer.current) clearInterval(heroTimer.current); };
    }, [resetHeroTimer]);

    function goPrev() { setHeroSlide((s) => (s - 1 + heroSlides.length) % heroSlides.length); resetHeroTimer(); }
    function goNext() { setHeroSlide((s) => (s + 1) % heroSlides.length); resetHeroTimer(); }

    // Package image lightbox
    const [lightboxPkg, setLightboxPkg] = useState<DbPackage | null>(null);
    const [zoomScale, setZoomScale] = useState(1);

    // About image lightbox
    const [lightboxAbout, setLightboxAbout] = useState<{ image: string; alt: string } | null>(null);
    const [aboutZoomScale, setAboutZoomScale] = useState(1);

    // Hotel city tabs
    const hotelCities = ['All', ...Array.from(new Set(hotelImages.map((h) => h.city_name)))];
    const [activeCity, setActiveCity] = useState('All');
    const visibleHotels = activeCity === 'All' ? hotelImages : hotelImages.filter((h) => h.city_name === activeCity);

    // Partners slider — infinite loop via cloned array
    // visibleCount is responsive: 1 on mobile, 2 on tablet, 3 on desktop.
    const [visibleCount, setVisibleCount] = useState(3);
    const partnerViewportRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function updateVisible() {
            const w = partnerViewportRef.current?.offsetWidth ?? window.innerWidth;
            setVisibleCount(w < 480 ? 1 : w < 768 ? 2 : 3);
        }
        updateVisible();
        window.addEventListener('resize', updateVisible);
        return () => window.removeEventListener('resize', updateVisible);
    }, []);

    const partnerExtended = [...partners, ...partners, ...partners]; // triple
    const [partnerSlide, setPartnerSlide] = useState(partners.length); // start in the middle copy
    const [partnerTransition, setPartnerTransition] = useState(true);
    const partnerTimer = useRef<ReturnType<typeof setInterval> | null>(null);

    const resetPartnerTimer = useCallback(() => {
        if (partnerTimer.current) clearInterval(partnerTimer.current);
        partnerTimer.current = setInterval(() => setPartnerSlide((s) => s + 1), 3000);
    }, []);

    useEffect(() => {
        resetPartnerTimer();
        return () => { if (partnerTimer.current) clearInterval(partnerTimer.current); };
    }, [resetPartnerTimer]);

    // After sliding to a clone, silently jump back to the real copy
    useEffect(() => {
        if (partnerSlide >= partners.length * 2) {
            const t = setTimeout(() => {
                setPartnerTransition(false);
                setPartnerSlide(partners.length);
            }, 500);
            return () => clearTimeout(t);
        }
        if (partnerSlide < partners.length) {
            const t = setTimeout(() => {
                setPartnerTransition(false);
                setPartnerSlide(partners.length * 2 - 1);
            }, 500);
            return () => clearTimeout(t);
        }
    }, [partnerSlide]);

    // Re-enable transition after silent jump
    useEffect(() => {
        if (!partnerTransition) {
            const t = setTimeout(() => setPartnerTransition(true), 50);
            return () => clearTimeout(t);
        }
    }, [partnerTransition]);

    function partnerPrev() { setPartnerSlide((s) => s - 1); resetPartnerTimer(); }
    function partnerNext() { setPartnerSlide((s) => s + 1); resetPartnerTimer(); }
    const partnerDotIndex = ((partnerSlide - partners.length) % partners.length + partners.length) % partners.length;

    function openLightbox(pkg: DbPackage) { setLightboxPkg(pkg); setZoomScale(1); }
    function closeLightbox() { setLightboxPkg(null); setZoomScale(1); }
    function zoomIn()  { setZoomScale((z) => Math.min(z + 0.25, 3)); }
    function zoomOut() { setZoomScale((z) => Math.max(z - 0.25, 0.5)); }

    function closeAboutLightbox() { setLightboxAbout(null); setAboutZoomScale(1); }
    function aboutZoomIn()  { setAboutZoomScale((z) => Math.min(z + 0.25, 3)); }
    function aboutZoomOut() { setAboutZoomScale((z) => Math.max(z - 0.25, 0.5)); }

    function openLogin() {
        setAuthTab('login');
        setModalOpen(true);
    }
    function openRegister() {
        setAuthTab('register');
        setModalOpen(true);
    }

    const navLinks = ['Home', 'About', 'Destinations', 'Packages', 'Services','Hotels', 'Contact'];
    const extraNavLinks = [
        { label: 'Group Ticket', href: '/group-tickets', requiresAuth: false },
        { label: 'Bank Details', href: '/bank-details', requiresAuth: true },
    ];

    function handleProtectedNav(href: string) {
        if (auth.user) {
            window.location.href = href;
        } else {
            openLogin();
        }
    }

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
                        {extraNavLinks.map((l) => (
                            l.requiresAuth ? (
                                <button
                                    key={l.label}
                                    onClick={() => handleProtectedNav(l.href)}
                                    className="text-sm font-semibold text-teal-600 transition-colors hover:text-teal-700"
                                >
                                    {l.label}
                                </button>
                            ) : (
                                <Link key={l.label} href={l.href}
                                    className="text-sm font-semibold text-teal-600 transition-colors hover:text-teal-700">
                                    {l.label}
                                </Link>
                            )
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
                            {extraNavLinks.map((l) => (
                                l.requiresAuth ? (
                                    <button
                                        key={l.label}
                                        onClick={() => { setMobileOpen(false); handleProtectedNav(l.href); }}
                                        className="text-sm font-semibold text-teal-600 text-left"
                                    >
                                        {l.label}
                                    </button>
                                ) : (
                                    <Link key={l.label} href={l.href} onClick={() => setMobileOpen(false)}
                                        className="text-sm font-semibold text-teal-600">
                                        {l.label}
                                    </Link>
                                )
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

            {/* ── HERO SLIDER ────────────────────────────────────────────── */}
            <section id="hero" className="relative min-h-screen overflow-hidden pt-16">
                {/* Slides */}
                <div className="relative h-screen w-full">
                    {heroSlides.map((slide, i) => (
                        <div
                            key={i}
                            className={`absolute inset-0 transition-opacity duration-700 ${i === heroSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                        >
                            {/* Background: real image or placeholder */}
                            {slide.image ? (
                                <img src={slide.image} alt={slide.tag} className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-teal-900 to-slate-800">
                                    {/* Placeholder blobs */}
                                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                                        <div className="absolute top-20 left-10 h-64 w-64 rounded-full bg-teal-400 blur-3xl" />
                                        <div className="absolute right-10 bottom-20 h-80 w-80 rounded-full bg-blue-400 blur-3xl" />
                                    </div>
                                    {/* Placeholder label */}
                                    <div className="relative z-10 flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-white/20 px-10 py-8 text-white/40">
                                        <svg className="h-12 w-12" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 9.75V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18V9.75M8.25 6.75h.008v.008H8.25V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                        </svg>
                                        <p className="text-sm font-medium">Slide {i + 1} — Upload your image here</p>
                                        <p className="text-xs">Set <code className="rounded bg-white/10 px-1">heroSlides[{i}].image</code> to your image URL</p>
                                    </div>
                                </div>
                            )}

                            {/* Dark overlay */}
                            <div className="absolute inset-0 bg-black/45" />

                            {/* Text content */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="mx-auto max-w-5xl px-4 text-center">
                                    <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-teal-300">
                                        {slide.tag}
                                    </p>
                                    <h1 className="mb-5 whitespace-pre-line text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                                        {slide.title.split('\n').map((line, li) => (
                                            <span key={li}>
                                                {li === 1 ? <span className="text-teal-400">{line}</span> : line}
                                                {li === 0 && <br />}
                                            </span>
                                        ))}
                                    </h1>
                                    <p className="mx-auto mb-8 max-w-2xl text-base text-gray-200 md:text-lg">
                                        {slide.subtitle}
                                    </p>
                                    {auth.user ? (
                                        <Link
                                            href={route('dashboard')}
                                            className="rounded-full bg-teal-500 px-8 py-3 text-base font-semibold text-white shadow-lg hover:bg-teal-400"
                                        >
                                            Go to Dashboard
                                        </Link>
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
                                                className="rounded-full border-2 border-white/50 px-8 py-3 text-base font-semibold text-white transition hover:border-white hover:bg-white/10"
                                            >
                                                Sign In
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Prev / Next arrows */}
                    <button
                        onClick={goPrev}
                        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition hover:bg-black/60 md:left-8 md:p-3"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                        onClick={goNext}
                        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition hover:bg-black/60 md:right-8 md:p-3"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>

                    {/* Dot indicators */}
                    <div className="absolute bottom-20 left-0 z-20 flex w-full justify-center gap-2">
                        {heroSlides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => { setHeroSlide(i); resetHeroTimer(); }}
                                className={`h-2 rounded-full transition-all ${i === heroSlide ? 'w-7 bg-teal-400' : 'w-2 bg-white/50 hover:bg-white/80'}`}
                                aria-label={`Go to slide ${i + 1}`}
                            />
                        ))}
                    </div>

                    {/* Stats bar */}
                    <div className="absolute bottom-6 left-0 z-20 w-full px-4">
                        <div className="mx-auto grid max-w-2xl grid-cols-3 gap-4 rounded-2xl border border-white/10 bg-black/30 p-4 backdrop-blur-sm">
                            {[
                                { value: '100,000+', label: 'Happy Travelers' },
                                { value: '50+', label: 'Destinations' },
                                { value: '20+ Years', label: 'Experience' },
                            ].map((s) => (
                                <div key={s.label} className="text-center">
                                    <p className="text-xl font-bold text-teal-400 sm:text-2xl">{s.value}</p>
                                    <p className="text-xs text-gray-300 sm:text-sm">{s.label}</p>
                                </div>
                            ))}
                        </div>
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
                        {/* Visual — image slider */}
                        <div className="relative">
                            {/* Slide track */}
                            <div className="relative h-72 overflow-hidden rounded-3xl shadow-xl md:h-96">
                                {aboutSlides.map((slide, i) => (
                                    <div
                                        key={i}
                                        className={`absolute inset-0 transition-opacity duration-700 ${i === aboutSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                                    >
                                        {/* Fallback gradient behind image */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-blue-700 flex flex-col items-center justify-center text-white">
                                            <div className="mb-3 text-6xl">✈️</div>
                                            <p className="text-base font-semibold">{slide.alt}</p>
                                        </div>
                                        <img
                                            src={slide.image}
                                            alt={slide.alt}
                                            className="absolute inset-0 h-full w-full object-cover cursor-zoom-in"
                                            onClick={() => { setLightboxAbout(slide); setAboutZoomScale(1); }}
                                        />
                                        {/* Subtle dark overlay */}
                                        <div className="absolute inset-0 bg-black/20" />
                                    </div>
                                ))}

                                {/* Prev arrow */}
                                <button
                                    onClick={aboutPrev}
                                    className="absolute left-3 top-1/2 z-10 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/70"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>

                                {/* Next arrow */}
                                <button
                                    onClick={aboutNext}
                                    className="absolute right-3 top-1/2 z-10 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/70"
                                    aria-label="Next image"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>

                                {/* Dot indicators */}
                                <div className="absolute bottom-3 left-0 z-10 flex w-full justify-center gap-1.5">
                                    {aboutSlides.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => { setAboutSlide(i); resetAboutTimer(); }}
                                            className={`h-1.5 rounded-full transition-all ${i === aboutSlide ? 'w-5 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'}`}
                                            aria-label={`Go to image ${i + 1}`}
                                        />
                                    ))}
                                </div>

                                {/* Slide counter */}
                                <div className="absolute top-3 right-3 z-10 rounded-full bg-black/40 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                                    {aboutSlide + 1} / {aboutSlides.length}
                                </div>
                            </div>

                            {/* Years badge */}
                            <div className="absolute -bottom-4 -right-4 rounded-2xl bg-teal-600 px-5 py-3 text-white shadow-lg">
                                <p className="text-2xl font-bold">20+</p>
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
                                    'IATA ACCREDITED AGENT',
                                    'PSA HOLDER',
                                    'PERSONLY UMRAH AGGREMENT',
                                    'Government approved AGENCY',
                                    '24/7 CUSTOMER SUPPORT'
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
                    {/* Accreditation logos */}
                            <div className="mt-8 border-t border-gray-200 pt-6">
                                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
                                    Accredited &amp; Partnered With
                                </p>
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                    {partners1.map((p) => (
                                        <div
                                            key={p.name}
                                            className="group flex flex-col items-center gap-2 rounded-xl border border-gray-100 bg-white px-2 py-3 shadow-sm transition hover:border-teal-200 hover:shadow-md"
                                        >
                                            {p.image ? (
                                                <img
                                                    src={p.image}
                                                    alt={p.name}
                                                    className="w-full object-contain  transition group-hover:grayscale-0"
                                                    style={{ height: '200px' }}
                                                />
                                            ) : (
                                                <div className="flex w-full items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 text-gray-300" style={{ height: '200px' }}>
                                                    <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 9.75V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18V9.75" />
                                                    </svg>
                                                </div>
                                            )}
                                            <span className="text-[10px] font-bold tracking-wide text-gray-600 group-hover:text-teal-600">
                                                {p.name}
                                            </span>
                                        </div>
                                    ))}
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
                                        
                                        {d.price && (
                                        <div className="mt-2 flex items-center justify-between">
                                            <span className="text-xs text-gray-300">Starting from</span>
                                            <span className="rounded-full bg-teal-500 px-3 py-1 text-xs font-bold text-white">
                                                {d.price}
                                            </span>
                                        </div>
                                        )}
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
                                    {/* Clickable image */}
                                    <div
                                        className="group relative w-full cursor-zoom-in overflow-hidden bg-gray-200"
                                        style={{ height: '500px' }}
                                        onClick={() => pkg.image_url && openLightbox(pkg)}
                                        title="Click to zoom"
                                    >
                                        {pkg.image_url && (
                                            <img
                                                src={pkg.image_url}
                                                alt={pkg.name}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        )}
                                        {/* Zoom hint overlay */}
                                        {pkg.image_url && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
                                                <ZoomIn className="h-8 w-8 text-white opacity-0 drop-shadow transition-opacity group-hover:opacity-100" />
                                            </div>
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

            {/* ── HOTELS ─────────────────────────────────────────────────── */}
            {hotelImages.length > 0 && (
                <section id="hotels" className="bg-gray-50 py-20">
                    <div className="mx-auto max-w-7xl px-4 md:px-6">
                        {/* Heading */}
                        <div className="mb-8 text-center">
                            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-teal-600">
                                Accommodation
                            </p>
                            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Hotels</h2>
                            <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-teal-500" />
                        </div>

                        {/* City Tabs */}
                        <div className="mb-8 flex flex-wrap justify-center gap-2">
                            {hotelCities.map((city) => (
                                <button
                                    key={city}
                                    onClick={() => setActiveCity(city)}
                                    className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200
                                        ${activeCity === city
                                            ? 'bg-teal-600 text-white shadow-md shadow-teal-200'
                                            : 'bg-white text-gray-600 border border-gray-200 hover:border-teal-400 hover:text-teal-600'
                                        }`}
                                >
                                    {city}
                                </button>
                            ))}
                        </div>

                        {/* Hotel Cards */}
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                            {visibleHotels.map((h) => (
                                <div
                                    key={h.id}
                                    className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                                >
                                    <div className="relative h-48 overflow-hidden bg-gray-200">
                                        {h.image_url ? (
                                            <img
                                                src={h.image_url}
                                                alt={h.name}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-gray-300">
                                                <Building2 className="h-12 w-12" />
                                            </div>
                                        )}
                                        {/* City badge */}
                                        <div className="absolute top-3 left-3">
                                            <span className="rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
                                                {h.city_name}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900 line-clamp-1">{h.name}</h3>
                                        <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                                            <MapPin className="h-3.5 w-3.5 text-teal-500" />
                                            <span>{h.city_name}</span>
                                        </div>
                                        <div className="mt-3 flex items-center justify-between">
                                            <p className="text-lg font-bold text-teal-600">
                                                PKR {Number(h.price).toLocaleString()}
                                            </p>
                                            {/* <button
                                                onClick={openRegister}
                                                className="rounded-full bg-teal-600 px-3 py-1 text-xs font-semibold text-white hover:bg-teal-700 transition-colors"
                                            >
                                                Book
                                            </button> */}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── FLIGHT PARTNERS SLIDER ─────────────────────────────────── */}
            <section className="bg-gray-50 py-16">
                <div className="mx-auto max-w-5xl px-4 md:px-6">
                    <div className="mb-10 text-center">
                        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-teal-600">
                            Accreditations &amp; Partners
                        </p>
                        <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Our Flight Partners</h2>
                        <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-teal-500" />
                    </div>

                    {/* Slider */}
                    <div className="relative px-8 md:px-10">
                        {/* Left arrow */}
                        <button
                            onClick={partnerPrev}
                            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md border border-gray-100 text-gray-600 transition hover:bg-teal-600 hover:text-white"
                            aria-label="Previous partner"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>

                        {/* Viewport — clips overflowing cards */}
                        <div className="overflow-hidden" ref={partnerViewportRef}>
                            <div
                                className="flex"
                                style={{
                                    transform: `translateX(-${partnerSlide * (100 / visibleCount)}%)`,
                                    transition: partnerTransition ? 'transform 500ms ease-in-out' : 'none',
                                }}
                            >
                                {partnerExtended.map((p, idx) => (
                                    <div
                                        key={idx}
                                        className="flex-shrink-0 px-3"
                                        style={{ width: `${100 / visibleCount}%` }}
                                    >
                                        <div className="flex flex-col items-center gap-4 rounded-2xl border border-gray-100 bg-white px-4 py-8 shadow-sm transition-shadow hover:shadow-md h-full">
                                            {p.image ? (
                                                <img src={p.image} alt={p.name} className="h-24 w-auto object-contain" />
                                            ) : (
                                                <div className="flex h-24 w-36 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-gray-300">
                                                    <svg className="mb-1 h-8 w-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 9.75V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18V9.75" />
                                                    </svg>
                                                    <span className="text-xs">Upload logo</span>
                                                </div>
                                            )}
                                            <div className="text-center">
                                                <p className="text-xl font-extrabold tracking-wide text-gray-900">{p.name}</p>
                                                <p className="mt-1 text-xs leading-snug text-gray-500">{p.fullName}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right arrow */}
                        <button
                            onClick={partnerNext}
                            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md border border-gray-100 text-gray-600 transition hover:bg-teal-600 hover:text-white"
                            aria-label="Next partner"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Dot indicators */}
                    <div className="mt-6 flex justify-center gap-2">
                        {partners.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => { setPartnerTransition(true); setPartnerSlide(partners.length + i); resetPartnerTimer(); }}
                                className={`h-2 rounded-full transition-all ${i === partnerDotIndex ? 'w-6 bg-teal-500' : 'w-2 bg-gray-300 hover:bg-gray-400'}`}
                                aria-label={`Go to partner ${i + 1}`}
                            />
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
                    {!auth.user && (
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
                    )}
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
                                <p className="font-bold text-white">
                                    {companyConfig.company_name || 'AL Abrar Group of Travels'}
                                </p>
                            </div>
                            {companyConfig.tagline && (
                                <p className="mb-4 text-sm leading-relaxed">{companyConfig.tagline}</p>
                            )}
                            <ul className="space-y-2 text-sm">
                                {companyConfig.address && (
                                    <li className="flex items-start gap-2">
                                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" />
                                        {companyConfig.address}
                                    </li>
                                )}
                                {companyConfig.phone && (
                                    <li className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 shrink-0 text-teal-500" />
                                        {companyConfig.phone}
                                    </li>
                                )}
                                {companyConfig.email && (
                                    <li className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 shrink-0 text-teal-500" />
                                        {companyConfig.email}
                                    </li>
                                )}
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
                                    { icon: Facebook, label: 'Facebook',href:"https://www.facebook.com/share/1CuBMcJ15D/" },
                                    // { icon: Twitter, label: 'Twitter',href:"https://www.twitter.com" },
                                    { icon: Instagram, label: 'Instagram',href:"https://www.instagram.com/alabrargroup_of_travels?utm_source=qr&igsh=MXRwem5ybW01cmRjbg==" },
                                    // { icon: Youtube, label: 'YouTube',href:"https://www.youtube.com" },
                                ].map(({ icon: Icon, label, href }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        aria-label={label}
                                        className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition-colors hover:bg-teal-600 hover:text-white"
                                        target='_blank'
                                    >
                                        <Icon className="h-4 w-4" />
                                    </a>
                                ))}
                            </div>
                            {/* <div className="rounded-xl border border-gray-700 p-4">
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
                            </div> */}
                        </div>
                    </div>

                    <div className="mt-10 border-t border-gray-800 pt-5 text-center text-xs">
                        © {new Date().getFullYear()} {companyConfig.company_name || 'AL Abrar Group of Travels'}. All rights reserved. |{' '}
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

            {/* ── ABOUT IMAGE LIGHTBOX ──────────────────────────────────── */}
            {lightboxAbout && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm"
                    onClick={closeAboutLightbox}
                >
                    <div
                        className="relative flex max-h-[90vh] max-w-[90vw] flex-col items-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Top bar */}
                        <div className="mb-3 flex w-full items-center justify-between gap-4 px-1">
                            <p className="truncate text-sm font-semibold text-white">{lightboxAbout.alt}</p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={aboutZoomOut}
                                    disabled={aboutZoomScale <= 0.5}
                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 disabled:opacity-40"
                                    title="Zoom out"
                                >
                                    <ZoomOut className="h-4 w-4" />
                                </button>
                                <span className="w-12 text-center text-xs text-white/70">{Math.round(aboutZoomScale * 100)}%</span>
                                <button
                                    onClick={aboutZoomIn}
                                    disabled={aboutZoomScale >= 3}
                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 disabled:opacity-40"
                                    title="Zoom in"
                                >
                                    <ZoomIn className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={closeAboutLightbox}
                                    className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-red-500"
                                    title="Close"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Scrollable image container */}
                        <div className="overflow-auto rounded-xl" style={{ maxHeight: 'calc(90vh - 80px)', maxWidth: '90vw' }}>
                            <img
                                src={lightboxAbout.image}
                                alt={lightboxAbout.alt}
                                style={{ transform: `scale(${aboutZoomScale})`, transformOrigin: 'top left', transition: 'transform 0.2s ease' }}
                                className="block max-w-none rounded-xl"
                                draggable={false}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* ── PACKAGE IMAGE LIGHTBOX ─────────────────────────────────── */}
            {lightboxPkg && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm"
                    onClick={closeLightbox}
                >
                    {/* Panel — stop propagation so inner clicks don't close */}
                    <div
                        className="relative flex max-h-[90vh] max-w-[90vw] flex-col items-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Top bar */}
                        <div className="mb-3 flex w-full items-center justify-between gap-4 px-1">
                            <p className="truncate text-sm font-semibold text-white">{lightboxPkg.name}</p>
                            <div className="flex items-center gap-2">
                                {/* Zoom controls */}
                                <button
                                    onClick={zoomOut}
                                    disabled={zoomScale <= 0.5}
                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 disabled:opacity-40"
                                    title="Zoom out"
                                >
                                    <ZoomOut className="h-4 w-4" />
                                </button>
                                <span className="w-12 text-center text-xs text-white/70">{Math.round(zoomScale * 100)}%</span>
                                <button
                                    onClick={zoomIn}
                                    disabled={zoomScale >= 3}
                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 disabled:opacity-40"
                                    title="Zoom in"
                                >
                                    <ZoomIn className="h-4 w-4" />
                                </button>
                                {/* Close */}
                                <button
                                    onClick={closeLightbox}
                                    className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-red-500"
                                    title="Close"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Scrollable image container */}
                        <div className="overflow-auto rounded-xl" style={{ maxHeight: 'calc(90vh - 80px)', maxWidth: '90vw' }}>
                            <img
                                src={lightboxPkg.image_url}
                                alt={lightboxPkg.name}
                                style={{ transform: `scale(${zoomScale})`, transformOrigin: 'top left', transition: 'transform 0.2s ease' }}
                                className="block max-w-none rounded-xl"
                                draggable={false}
                            />
                        </div>

                        {/* Price tag */}
                        <div className="mt-3 rounded-full bg-teal-600 px-5 py-1.5 text-sm font-bold text-white shadow">
                            Starting from {lightboxPkg.price}
                        </div>
                    </div>
                </div>
            )}

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
