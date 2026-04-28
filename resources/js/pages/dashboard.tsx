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

    const base   = isAgent ? '?agent=me' : '';
    const vBase  = '/admin/vouchers';
    const cBase  = '/admin/clients';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex flex-col gap-8 p-6">
                <div>
                    <h1 className="text-2xl font-semibold">Dashboard</h1>
                    {isAgent && (
                        <p className="mt-1 text-sm text-muted-foreground">
                            Welcome, <span className="font-medium">{auth.user.name}</span> — showing your data only.
                        </p>
                    )}
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
                <Section title="Information About Mofa">
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
                </Section>
            </div>
        </AppLayout>
    );
}
