import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Baby,
    CheckCircle2,
    FileCheck,
    FileText,
    FileX,
    PersonStanding,
    Rocket,
    ScrollText,
    Users,
    XCircle,
} from 'lucide-react';

// ── Agent service cards ────────────────────────────────────────────────────────
const agentCards = [
    {
        title: 'Group Tickets',
        subtitle: 'Manage and book airline group tickets',
        href: '/group-tickets',
        image: '/storage/group-tickets.jpg',
    },
    {
        title: 'Vouchers',
        subtitle: 'See all your vouchers and their approval status',
        href: '/admin/vouchers',
        image: '/storage/voucher.jpg',
    },
    {
        title: 'Umrah Calculator',
        subtitle: 'Create Your Own Umrah Package',
        href: '/umrah-calculator',
        image: '/storage/umrah-calculator.jpg',
    },
    {
        title: 'Group Bookings',
        subtitle: 'JED-MAK-MED Round Trip',
        href: '/admin/group-ticket-bookings',
        image: '/storage/group-booking.jpg',
    },
    {
        title: 'Client Management',
        subtitle: 'manage your clients and their pilgrims',
        href: '/admin/clients',
        image: '/storage/client.jpg',
    },
    {
        title: 'Agent Balance',
        subtitle: 'View your account balance and reports',
        href: '/admin/reports/agent-balance',
        image: '/storage/balance.jpg',
    },
];

function AgentDashboard({ userName }: { userName: string }) {
    return (
        <div className="min-h-full bg-[#4a9aaa] p-6 md:p-10">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white">Welcome, {userName}</h1>
                    <p className="text-white/75 mt-1 text-sm">Select a service below to get started</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {agentCards.map((card) => (
                        <Link
                            key={card.href}
                            href={card.href}
                            className="block group"
                        >
                            <div className="bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-xl">
                                <div className="h-52 overflow-hidden bg-gray-100">
                                    <img
                                        src={card.image}
                                        alt={card.title}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="p-5 text-center">
                                    <h3 className="font-bold text-gray-900 text-lg leading-tight">{card.title}</h3>
                                    <p className="text-gray-500 text-sm mt-1">{card.subtitle}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

// ── Stat card matching the image layout ────────────────────────────────────────
function StatCard({
    value,
    label,
    href,
    bg,
    Icon,
}: {
    value: number;
    label: string;
    href: string;
    bg: string;       // Tailwind bg class e.g. "bg-green-500"
    Icon: React.ElementType;
}) {
    return (
        <Link href={href} className="block group">
            <div className={`relative overflow-hidden rounded-[2rem] px-6 py-5 shadow-md transition-transform duration-200 group-hover:-translate-y-1 group-hover:shadow-lg ${bg}`}>
                {/* Watermark icon */}
                <Icon className="absolute -right-4 -bottom-3 h-28 w-28 text-white/20 pointer-events-none" strokeWidth={1} />

                {/* Content */}
                <p className="text-4xl font-extrabold text-white drop-shadow">{value.toLocaleString()}</p>
                <p className="mt-1 text-sm font-semibold text-white/90">{label}</p>

                {/* More Info button */}
                <div className="mt-4">
                    <span className="inline-block rounded-full border border-white/60 bg-white/10 px-5 py-1 text-xs font-bold text-white backdrop-blur-sm transition group-hover:bg-white/25">
                        More Info
                    </span>
                </div>
            </div>
        </Link>
    );
}

// ── Section wrapper ────────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-gray-700">{title}</h2>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {children}
            </div>
        </div>
    );
}

// ── Props ──────────────────────────────────────────────────────────────────────
interface Props {
    isAgent: boolean;
    // Vouchers
    totalVouchers: number;
    approvedVouchers: number;
    notApprovedVouchers: number;
    // Pilgrims
    totalPilgrims: number;
    totalAdults: number;
    totalChild: number;
    totalInfant: number;
    // Mofa
    mofaApproved: number;
    mofaNotApproved: number;
    voucherCreated: number;
    mofaTotal: number;
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function Dashboard({
    isAgent,
    totalVouchers, approvedVouchers, notApprovedVouchers,
    totalPilgrims, totalAdults, totalChild, totalInfant,
    mofaApproved, mofaNotApproved, voucherCreated, mofaTotal,
}: Props) {
    const { auth } = usePage<SharedData>().props;

    const vBase  = '/admin/vouchers';
    const cBase  = '/admin/clients';

    // Agent: show visual service card grid (no stats)
    if (isAgent) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Dashboard" />
                <AgentDashboard userName={auth.user.name} />
            </AppLayout>
        );
    }

    // Admin: show statistics dashboard
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex flex-col gap-8 p-6">
                <div>
                    <h1 className="text-2xl font-semibold">Dashboard</h1>
                </div>

                {/* ── Vouchers ───────────────────────────────────────────── */}
                <Section title="Information About Vouchers">
                    <StatCard
                        value={totalVouchers}
                        label="Total Vouchers"
                        href={vBase}
                        bg="bg-green-500"
                        Icon={ScrollText}
                    />
                    <StatCard
                        value={approvedVouchers}
                        label="Approved Vouchers"
                        href={`${vBase}?approved=1`}
                        bg="bg-purple-400"
                        Icon={FileCheck}
                    />
                    <StatCard
                        value={notApprovedVouchers}
                        label="Not Approved Vouchers"
                        href={`${vBase}?approved=0`}
                        bg="bg-indigo-300"
                        Icon={FileX}
                    />
                </Section>

                {/* ── Pilgrims ───────────────────────────────────────────── */}
                <Section title="Information About Pilgrims">
                    <StatCard
                        value={totalPilgrims}
                        label="Total"
                        href={cBase}
                        bg="bg-cyan-500"
                        Icon={Users}
                    />
                    <StatCard
                        value={totalAdults}
                        label="Total Adults"
                        href={`${cBase}?age_group=adult`}
                        bg="bg-green-500"
                        Icon={Users}
                    />
                    <StatCard
                        value={totalChild}
                        label="Total Child"
                        href={`${cBase}?age_group=child`}
                        bg="bg-purple-400"
                        Icon={PersonStanding}
                    />
                    <StatCard
                        value={totalInfant}
                        label="Total Infant"
                        href={`${cBase}?age_group=infant`}
                        bg="bg-sky-400"
                        Icon={Baby}
                    />
                </Section>

                {/* ── Mofa ───────────────────────────────────────────────── */}
                {/* <Section title="Information About Mofa">
                    <StatCard
                        value={mofaApproved}
                        label="Approved"
                        href={`${cBase}?visa_approve=yes`}
                        bg="bg-cyan-400"
                        Icon={CheckCircle2}
                    />
                    <StatCard
                        value={mofaNotApproved}
                        label="Not Approved"
                        href={`${cBase}?visa_approve=no`}
                        bg="bg-sky-300"
                        Icon={XCircle}
                    />
                    <StatCard
                        value={voucherCreated}
                        label="Voucher Created"
                        href={`${cBase}?voucher_issue=yes`}
                        bg="bg-green-500"
                        Icon={FileText}
                    />
                    <StatCard
                        value={mofaTotal}
                        label="Total"
                        href={cBase}
                        bg="bg-purple-400"
                        Icon={Rocket}
                    />
                </Section> */}
            </div>
        </AppLayout>
    );
}
