import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

interface Agent { id: number; name: string; }

interface DrTransaction {
    id: number; date: string; detail: string;
    amount: number; voucher_id: number | null;
    t_adult: number; t_child: number; t_infant: number;
}

interface CrTransaction {
    id: number; date: string; detail: string;
    amount: number; voucher_id: number | null;
}

interface ChargeWoVoucher {
    sr_rate: number | null;
    t_adult: number; t_child: number; t_infant: number;
}

interface TicketSale {
    id: number; date: string; name: string; ticket_no: string;
    pnr: string; ticket_from_to: string; category: string;
    purchase: number; sale: number;
    payment_status: string; paid_amount: number | null;
    flight_name: string | null;
}

function fmt(n: number | null | undefined) {
    return (n ?? 0).toLocaleString();
}

export default function AgentDetailReport({
    agent, drTransactions, crTransactions, chargesWoVoucher,
    ticketSales, totalCr, totalDr, balance,
}: {
    agent: Agent;
    drTransactions: DrTransaction[];
    crTransactions: CrTransaction[];
    chargesWoVoucher: ChargeWoVoucher[];
    ticketSales: TicketSale[];
    totalCr: number; totalDr: number; balance: number;
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Agent Balance', href: '/admin/reports/agent-balance' },
        { title: agent.name, href: '#' },
    ];

    const totalTicketSale = ticketSales.reduce((s, t) => s + Number(t.sale), 0);
    const totalTicketPurchase = ticketSales.reduce((s, t) => s + Number(t.purchase), 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${agent.name} — Account Detail`} />
            <div className="flex flex-col gap-8 p-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">{agent.name}</h1>
                        <p className="text-sm text-muted-foreground mt-0.5">Account Transaction Detail</p>
                    </div>
                    <Link href="/admin/reports/agent-balance"
                        className="text-sm text-teal-700 hover:underline">
                        ← Back to Agent Balance
                    </Link>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-lg border bg-green-50 p-4 text-center">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Credit (CR)</p>
                        <p className="mt-1 text-xl font-bold text-green-700">PKR {fmt(totalCr)}</p>
                    </div>
                    <div className="rounded-lg border bg-red-50 p-4 text-center">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Debit (DR)</p>
                        <p className="mt-1 text-xl font-bold text-red-700">PKR {fmt(totalDr)}</p>
                    </div>
                    <div className={`rounded-lg border p-4 text-center ${balance >= 0 ? 'bg-blue-50' : 'bg-orange-50'}`}>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Balance</p>
                        <p className={`mt-1 text-xl font-bold ${balance >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
                            {balance < 0 ? '−' : ''}PKR {fmt(Math.abs(balance))}
                        </p>
                    </div>
                </div>

                {/* Charges Without Voucher */}
                {chargesWoVoucher.length > 0 && (
                    <section>
                        <h2 className="mb-3 text-base font-semibold text-orange-700">
                            Pending Charges (Visa Approved — No Voucher Issued)
                        </h2>
                        <div className="overflow-x-auto rounded-lg border border-orange-200">
                            <table className="w-full text-sm">
                                <thead className="bg-orange-50 text-muted-foreground">
                                    <tr>
                                        <th className="px-3 py-2 text-right font-medium">SR Rate</th>
                                        <th className="px-3 py-2 text-center font-medium">Adults</th>
                                        <th className="px-3 py-2 text-center font-medium">Children</th>
                                        <th className="px-3 py-2 text-center font-medium">Infants</th>
                                        <th className="px-3 py-2 text-right font-medium">Est. Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {chargesWoVoucher.map((r, i) => {
                                        const est = (r.sr_rate ?? 0) * (r.t_adult + r.t_child + r.t_infant);
                                        return (
                                            <tr key={i} className="hover:bg-muted/30">
                                                <td className="px-3 py-2 text-right">{r.sr_rate != null ? fmt(r.sr_rate) : '—'}</td>
                                                <td className="px-3 py-2 text-center">{r.t_adult}</td>
                                                <td className="px-3 py-2 text-center">{r.t_child}</td>
                                                <td className="px-3 py-2 text-center">{r.t_infant}</td>
                                                <td className="px-3 py-2 text-right font-semibold text-orange-700">
                                                    {fmt(est)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {/* DR Transactions */}
                <section>
                    <h2 className="mb-3 text-base font-semibold text-red-700">
                        Debit Transactions (DR)
                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                            Total: PKR {fmt(totalDr)}
                        </span>
                    </h2>
                    <div className="overflow-x-auto rounded-lg border">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50 text-muted-foreground">
                                <tr>
                                    <th className="px-3 py-2 text-left font-medium">#</th>
                                    <th className="px-3 py-2 text-left font-medium">Date</th>
                                    <th className="px-3 py-2 text-left font-medium">Detail</th>
                                    <th className="px-3 py-2 text-left font-medium">Voucher</th>
                                    <th className="px-3 py-2 text-center font-medium">Adult</th>
                                    <th className="px-3 py-2 text-center font-medium">Child</th>
                                    <th className="px-3 py-2 text-center font-medium">Infant</th>
                                    <th className="px-3 py-2 text-right font-medium">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {drTransactions.length === 0 && (
                                    <tr><td colSpan={8} className="px-4 py-6 text-center text-muted-foreground">No debit transactions.</td></tr>
                                )}
                                {drTransactions.map((t, i) => (
                                    <tr key={t.id} className="hover:bg-muted/30">
                                        <td className="px-3 py-2 text-muted-foreground">{i + 1}</td>
                                        <td className="px-3 py-2">{t.date}</td>
                                        <td className="px-3 py-2">{t.detail}</td>
                                        <td className="px-3 py-2 text-muted-foreground">
                                            {t.voucher_id ? `#${t.voucher_id}` : '—'}
                                        </td>
                                        <td className="px-3 py-2 text-center">{t.t_adult}</td>
                                        <td className="px-3 py-2 text-center">{t.t_child}</td>
                                        <td className="px-3 py-2 text-center">{t.t_infant}</td>
                                        <td className="px-3 py-2 text-right font-semibold text-red-700">
                                            {fmt(t.amount)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            {drTransactions.length > 0 && (
                                <tfoot className="bg-muted/50 font-semibold">
                                    <tr>
                                        <td colSpan={7} className="px-3 py-2">Total DR</td>
                                        <td className="px-3 py-2 text-right text-red-700">{fmt(totalDr)}</td>
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>
                </section>

                {/* CR Transactions */}
                <section>
                    <h2 className="mb-3 text-base font-semibold text-green-700">
                        Credit Transactions (CR)
                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                            Total: PKR {fmt(totalCr)}
                        </span>
                    </h2>
                    <div className="overflow-x-auto rounded-lg border">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50 text-muted-foreground">
                                <tr>
                                    <th className="px-3 py-2 text-left font-medium">#</th>
                                    <th className="px-3 py-2 text-left font-medium">Date</th>
                                    <th className="px-3 py-2 text-left font-medium">Detail</th>
                                    <th className="px-3 py-2 text-left font-medium">Voucher</th>
                                    <th className="px-3 py-2 text-right font-medium">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {crTransactions.length === 0 && (
                                    <tr><td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">No credit transactions.</td></tr>
                                )}
                                {crTransactions.map((t, i) => (
                                    <tr key={t.id} className="hover:bg-muted/30">
                                        <td className="px-3 py-2 text-muted-foreground">{i + 1}</td>
                                        <td className="px-3 py-2">{t.date}</td>
                                        <td className="px-3 py-2">{t.detail}</td>
                                        <td className="px-3 py-2 text-muted-foreground">
                                            {t.voucher_id ? `#${t.voucher_id}` : '—'}
                                        </td>
                                        <td className="px-3 py-2 text-right font-semibold text-green-700">
                                            {fmt(t.amount)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            {crTransactions.length > 0 && (
                                <tfoot className="bg-muted/50 font-semibold">
                                    <tr>
                                        <td colSpan={4} className="px-3 py-2">Total CR</td>
                                        <td className="px-3 py-2 text-right text-green-700">{fmt(totalCr)}</td>
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>
                </section>

                {/* Ticket Sales */}
                <section>
                    <h2 className="mb-3 text-base font-semibold text-purple-700">
                        Ticket Sales
                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                            Sale: PKR {fmt(totalTicketSale)} / Purchase: PKR {fmt(totalTicketPurchase)}
                        </span>
                    </h2>
                    <div className="overflow-x-auto rounded-lg border">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50 text-muted-foreground">
                                <tr>
                                    <th className="px-3 py-2 text-left font-medium">#</th>
                                    <th className="px-3 py-2 text-left font-medium">Date</th>
                                    <th className="px-3 py-2 text-left font-medium">Name</th>
                                    <th className="px-3 py-2 text-left font-medium">Ticket No</th>
                                    <th className="px-3 py-2 text-left font-medium">PNR</th>
                                    <th className="px-3 py-2 text-left font-medium">Route</th>
                                    <th className="px-3 py-2 text-left font-medium">Flight</th>
                                    <th className="px-3 py-2 text-right font-medium">Purchase</th>
                                    <th className="px-3 py-2 text-right font-medium">Sale</th>
                                    <th className="px-3 py-2 text-right font-medium">Profit</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {ticketSales.length === 0 && (
                                    <tr><td colSpan={10} className="px-4 py-6 text-center text-muted-foreground">No ticket sales.</td></tr>
                                )}
                                {ticketSales.map((t, i) => {
                                    const profit = Number(t.sale) - Number(t.purchase);
                                    return (
                                        <tr key={t.id} className="hover:bg-muted/30">
                                            <td className="px-3 py-2 text-muted-foreground">{i + 1}</td>
                                            <td className="px-3 py-2">{t.date}</td>
                                            <td className="px-3 py-2">{t.name}</td>
                                            <td className="px-3 py-2">{t.ticket_no}</td>
                                            <td className="px-3 py-2">{t.pnr}</td>
                                            <td className="px-3 py-2">{t.ticket_from_to}</td>
                                            <td className="px-3 py-2">{t.flight_name ?? '—'}</td>
                                            <td className="px-3 py-2 text-right">{fmt(t.purchase)}</td>
                                            <td className="px-3 py-2 text-right">{fmt(t.sale)}</td>
                                            <td className={`px-3 py-2 text-right font-semibold ${profit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                                {profit < 0 ? '−' : ''}{fmt(Math.abs(profit))}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            {ticketSales.length > 0 && (
                                <tfoot className="bg-muted/50 font-semibold">
                                    <tr>
                                        <td colSpan={7} className="px-3 py-2">Totals</td>
                                        <td className="px-3 py-2 text-right">{fmt(totalTicketPurchase)}</td>
                                        <td className="px-3 py-2 text-right text-purple-700">{fmt(totalTicketSale)}</td>
                                        <td className={`px-3 py-2 text-right ${totalTicketSale - totalTicketPurchase >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                            {fmt(totalTicketSale - totalTicketPurchase)}
                                        </td>
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>
                </section>

            </div>
        </AppLayout>
    );
}
