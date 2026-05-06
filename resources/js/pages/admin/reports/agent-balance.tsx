import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

interface AgentRow {
    id: number;
    name: string;
    credit_total: number;
    debit_total: number;
    sale_amount: number;
    t_adult: number;
    t_child: number;
    t_infant: number;
    sr_rate: number | null;
}

interface BankRow {
    id: number;
    name: string;
    credit_total: number;
    debit_total: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Reports', href: '#' },
    { title: 'Agent Balance', href: '#' },
];

function fmt(n: number | null | undefined) {
    return (n ?? 0).toLocaleString();
}

export default function AgentBalanceReport({
    agentRows, bankRows,
}: { agentRows: AgentRow[]; bankRows: BankRow[] }) {

    const totalCr   = agentRows.reduce((s, r) => s + Number(r.credit_total), 0);
    const totalDr   = agentRows.reduce((s, r) => s + Number(r.debit_total), 0);
    const totalSale = agentRows.reduce((s, r) => s + Number(r.sale_amount), 0);

    const bankTotalCr = bankRows.reduce((s, r) => s + Number(r.credit_total), 0);
    const bankTotalDr = bankRows.reduce((s, r) => s + Number(r.debit_total), 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Agent Balance Report" />
            <div className="flex flex-col gap-8 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Agent Balance Report</h1>
                    <button onClick={() => window.print()}
                        className="no-print rounded-md bg-gray-700 px-3 py-1.5 text-sm text-white hover:bg-gray-800">
                        🖨 Print
                    </button>
                </div>

                {/* ── Agent Balance Table ─────────────────────────────────── */}
                <section>
                    <h2 className="mb-3 text-lg font-medium">Agent Ledger</h2>
                    <div className="overflow-x-auto rounded-lg border">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50 text-muted-foreground">
                                <tr>
                                    <th className="px-3 py-3 text-left font-medium">#</th>
                                    <th className="px-3 py-3 text-left font-medium">Agent</th>
                                    <th className="px-3 py-3 text-right font-medium">Credit (CR)</th>
                                    <th className="px-3 py-3 text-right font-medium">Debit (DR)</th>
                                    <th className="px-3 py-3 text-right font-medium">Balance</th>
                                    <th className="px-3 py-3 text-right font-medium">Ticket Sale</th>
                                    <th className="px-3 py-3 text-right font-medium">SR Rate</th>
                                    <th className="px-3 py-3 text-center font-medium">Adult</th>
                                    <th className="px-3 py-3 text-center font-medium">Child</th>
                                    <th className="px-3 py-3 text-center font-medium">Infant</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {agentRows.length === 0 && (
                                    <tr>
                                        <td colSpan={10} className="px-4 py-8 text-center text-muted-foreground">
                                            No agents found.
                                        </td>
                                    </tr>
                                )}
                                {agentRows.map((r, i) => {
                                    const balance = Number(r.credit_total) - Number(r.debit_total);
                                    return (
                                        <tr key={r.id} className="hover:bg-muted/30">
                                            <td className="px-3 py-2 text-muted-foreground">{i + 1}</td>
                                            <td className="px-3 py-2 font-medium">
                                                <Link href={`/admin/reports/agent-balance/${r.id}`}
                                                    className="text-teal-700 hover:underline">
                                                    {r.name}
                                                </Link>
                                            </td>
                                            <td className="px-3 py-2 text-right text-green-700 font-semibold">
                                                {fmt(r.credit_total)}
                                            </td>
                                            <td className="px-3 py-2 text-right text-red-700 font-semibold">
                                                {fmt(r.debit_total)}
                                            </td>
                                            <td className={`px-3 py-2 text-right font-bold ${balance >= 0 ? 'text-blue-700' : 'text-orange-600'}`}>
                                                {balance < 0 ? '−' : ''}{fmt(Math.abs(balance))}
                                            </td>
                                            <td className="px-3 py-2 text-right text-purple-700 font-semibold">
                                                {fmt(r.sale_amount)}
                                            </td>
                                            <td className="px-3 py-2 text-right">
                                                {r.sr_rate != null ? fmt(r.sr_rate) : '—'}
                                            </td>
                                            <td className="px-3 py-2 text-center">{r.t_adult}</td>
                                            <td className="px-3 py-2 text-center">{r.t_child}</td>
                                            <td className="px-3 py-2 text-center">{r.t_infant}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            {agentRows.length > 0 && (
                                <tfoot className="bg-muted/50 font-semibold">
                                    <tr>
                                        <td colSpan={2} className="px-3 py-2">Totals</td>
                                        <td className="px-3 py-2 text-right text-green-700">{fmt(totalCr)}</td>
                                        <td className="px-3 py-2 text-right text-red-700">{fmt(totalDr)}</td>
                                        <td className={`px-3 py-2 text-right font-bold ${totalCr - totalDr >= 0 ? 'text-blue-700' : 'text-orange-600'}`}>
                                            {fmt(totalCr - totalDr)}
                                        </td>
                                        <td className="px-3 py-2 text-right text-purple-700">{fmt(totalSale)}</td>
                                        <td colSpan={4} />
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>
                </section>

                {/* ── Bank Balance Table ──────────────────────────────────── */}
                <section>
                    <h2 className="mb-3 text-lg font-medium">Bank Balance</h2>
                    <div className="overflow-x-auto rounded-lg border">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50 text-muted-foreground">
                                <tr>
                                    <th className="px-3 py-3 text-left font-medium">#</th>
                                    <th className="px-3 py-3 text-left font-medium">Bank</th>
                                    <th className="px-3 py-3 text-right font-medium">Credit (CR)</th>
                                    <th className="px-3 py-3 text-right font-medium">Debit (DR)</th>
                                    <th className="px-3 py-3 text-right font-medium">Balance</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {bankRows.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                            No banks found.
                                        </td>
                                    </tr>
                                )}
                                {bankRows.map((b, i) => {
                                    const balance = Number(b.credit_total) - Number(b.debit_total);
                                    return (
                                        <tr key={b.id} className="hover:bg-muted/30">
                                            <td className="px-3 py-2 text-muted-foreground">{i + 1}</td>
                                            <td className="px-3 py-2 font-medium">
                                                <Link href={`/admin/bank-transections?bank_id=${b.id}`} className="text-blue-600 hover:underline">
                                                    {b.name}
                                                </Link>
                                            </td>
                                            <td className="px-3 py-2 text-right text-green-700 font-semibold">
                                                {fmt(b.credit_total)}
                                            </td>
                                            <td className="px-3 py-2 text-right text-red-700 font-semibold">
                                                {fmt(b.debit_total)}
                                            </td>
                                            <td className={`px-3 py-2 text-right font-bold ${balance >= 0 ? 'text-blue-700' : 'text-orange-600'}`}>
                                                {balance < 0 ? '−' : ''}{fmt(Math.abs(balance))}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            {bankRows.length > 0 && (
                                <tfoot className="bg-muted/50 font-semibold">
                                    <tr>
                                        <td colSpan={2} className="px-3 py-2">Totals</td>
                                        <td className="px-3 py-2 text-right text-green-700">{fmt(bankTotalCr)}</td>
                                        <td className="px-3 py-2 text-right text-red-700">{fmt(bankTotalDr)}</td>
                                        <td className={`px-3 py-2 text-right font-bold ${bankTotalCr - bankTotalDr >= 0 ? 'text-blue-700' : 'text-orange-600'}`}>
                                            {fmt(bankTotalCr - bankTotalDr)}
                                        </td>
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>
                </section>
            </div>

            <style>{`
                @media print {
                    aside, header { display: none !important; }
                    .no-print { display: none !important; }
                    main { max-width: 100% !important; }
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                }
            `}</style>
        </AppLayout>
    );
}
