import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

interface AgentBalance { id: number; name: string; total_dr: string | null; total_cr: string | null; }

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Transactions', href: '/admin/transactions' },
    { title: 'Agent Balance', href: '#' },
];

export default function AgentBalance({
    agentBalances, totalDr, totalCr, netBalance,
}: {
    agentBalances: AgentBalance[];
    totalDr: number;
    totalCr: number;
    netBalance: number;
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Agent Balance" />
            <div className="flex flex-col gap-5 p-6">
                <h1 className="text-2xl font-semibold">Agent Balance</h1>
                <div className="overflow-hidden rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 text-left w-10">Sr#</th>
                                <th className="px-4 py-3 text-left">Agent</th>
                                <th className="px-4 py-3 text-right">Total Debit (Dr)</th>
                                <th className="px-4 py-3 text-right">Total Credit (Cr)</th>
                                <th className="px-4 py-3 text-right">Balance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {agentBalances.length === 0 && (
                                <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No data.</td></tr>
                            )}
                            {agentBalances.map((b, i) => {
                                const dr  = parseFloat(b.total_dr ?? '0');
                                const cr  = parseFloat(b.total_cr ?? '0');
                                const bal = cr - dr;
                                return (
                                    <tr key={b.id} className="hover:bg-muted/30">
                                        <td className="px-4 py-2">{i + 1}</td>
                                        <td className="px-4 py-2 font-medium">{b.name}</td>
                                        <td className="px-4 py-2 text-right text-red-600">{dr.toFixed(2)}</td>
                                        <td className="px-4 py-2 text-right text-green-600">{cr.toFixed(2)}</td>
                                        <td className={`px-4 py-2 text-right font-semibold ${bal >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                            {bal.toFixed(2)}
                                        </td>
                                    </tr>
                                );
                            })}
                            <tr className="bg-muted/30 font-semibold">
                                <td colSpan={2} className="px-4 py-2 text-right text-muted-foreground">Total</td>
                                <td className="px-4 py-2 text-right text-red-700">{totalDr.toFixed(2)}</td>
                                <td className="px-4 py-2 text-right text-green-700">{totalCr.toFixed(2)}</td>
                                <td className={`px-4 py-2 text-right font-bold ${netBalance >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                    {netBalance.toFixed(2)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
