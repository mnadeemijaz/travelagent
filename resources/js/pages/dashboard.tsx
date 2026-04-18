import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { BadgeCheck, FileCheck, FileX, ScrollText, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

interface Props {
    totalClients: number;
    visaNotApproved: number;
    totalVouchers: number;
    approvedVouchers: number;
    notApprovedVouchers: number;
}

function StatCard({ icon: Icon, label, value, href, color }: {
    icon: React.ElementType; label: string; value: number; href?: string; color: string;
}) {
    const inner = (
        <div className={`flex items-center gap-4 rounded-xl border p-5 transition-colors hover:bg-muted/40 ${href ? 'cursor-pointer' : ''}`}>
            <div className={`rounded-lg p-3 ${color}`}>
                <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
                <p className="text-2xl font-bold">{value.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
            </div>
        </div>
    );
    return href ? <Link href={href}>{inner}</Link> : <div>{inner}</div>;
}

export default function Dashboard({ totalClients, visaNotApproved, totalVouchers, approvedVouchers, notApprovedVouchers }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-6 p-6">
                <h1 className="text-2xl font-semibold">Dashboard</h1>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <StatCard
                        icon={Users}
                        label="Total Clients"
                        value={totalClients}
                        href="/admin/clients"
                        color="bg-blue-500"
                    />
                    <StatCard
                        icon={BadgeCheck}
                        label="Visa Pending"
                        value={visaNotApproved}
                        href="/admin/clients?visa_approve=no"
                        color="bg-yellow-500"
                    />
                    <StatCard
                        icon={ScrollText}
                        label="Total Vouchers"
                        value={totalVouchers}
                        href="/admin/vouchers"
                        color="bg-indigo-500"
                    />
                    <StatCard
                        icon={FileCheck}
                        label="Approved Vouchers"
                        value={approvedVouchers}
                        color="bg-green-500"
                    />
                    <StatCard
                        icon={FileX}
                        label="Pending Vouchers"
                        value={notApprovedVouchers}
                        color="bg-red-500"
                    />
                </div>
            </div>
        </AppLayout>
    );
}
