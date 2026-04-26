import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Copy, Landmark, Mail, MapPin, Menu, Phone, Plane, X } from 'lucide-react';
import { useState } from 'react';

interface BankDetailItem {
    id: number;
    bank_name: string;
    account_holder_name: string;
    account_number: string;
    iban_number: string | null;
    logo_url: string | null;
}

interface BankDetailsProps {
    bankDetails: BankDetailItem[];
}

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    function copy() {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }

    return (
        <button
            onClick={copy}
            title="Copy"
            className="ml-2 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs text-teal-600 transition hover:bg-teal-50"
        >
            <Copy className="h-3.5 w-3.5" />
            {copied ? 'Copied!' : 'Copy'}
        </button>
    );
}

export default function BankDetailsPage({ bankDetails }: BankDetailsProps) {
    const { auth } = usePage<SharedData>().props;
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <>
            <Head title="Bank Details — AL Abrar Group of Travels">
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
                        <Link href="/" className="text-sm font-medium text-gray-600 hover:text-teal-600">Home</Link>
                        <Link href="/group-tickets" className="text-sm font-medium text-gray-600 hover:text-teal-600">Group Tickets</Link>
                        <Link href="/bank-details" className="text-sm font-semibold text-teal-600">Bank Details</Link>
                    </nav>

                    <div className="flex items-center gap-2">
                        {auth.user ? (
                            <Link href={route('dashboard')} className="rounded-full bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700">
                                Dashboard
                            </Link>
                        ) : (
                            <Link href="/" className="rounded-full bg-teal-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-teal-700">
                                Login
                            </Link>
                        )}
                        <button
                            className="rounded-md p-2 text-gray-600 hover:bg-gray-100 md:hidden"
                            onClick={() => setMobileOpen(!mobileOpen)}
                        >
                            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                {mobileOpen && (
                    <div className="border-t bg-white px-4 py-4 md:hidden">
                        <nav className="flex flex-col gap-3">
                            <Link href="/" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-gray-700 hover:text-teal-600">Home</Link>
                            <Link href="/group-tickets" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-gray-700 hover:text-teal-600">Group Tickets</Link>
                            <Link href="/bank-details" onClick={() => setMobileOpen(false)} className="text-sm font-semibold text-teal-600">Bank Details</Link>
                        </nav>
                    </div>
                )}
            </header>

            {/* ── HERO STRIP ── */}
            <section className="bg-gradient-to-r from-teal-700 to-teal-900 pt-24 pb-12">
                <div className="mx-auto max-w-4xl px-4 text-center">
                    <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                        <Landmark className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white md:text-4xl">Bank Details</h1>
                    <p className="mt-3 text-teal-100">
                        Use the account details below to make your payment. Please share your receipt after transfer.
                    </p>
                </div>
            </section>

            {/* ── BANK CARDS ── */}
            <main className="bg-gray-50 py-16">
                <div className="mx-auto max-w-4xl px-4 md:px-6">
                    {bankDetails.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center text-gray-400">
                            <Landmark className="mx-auto mb-3 h-10 w-10 opacity-30" />
                            <p className="text-sm">No bank details available at this time.</p>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2">
                            {bankDetails.map((b) => (
                                <div
                                    key={b.id}
                                    className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
                                >
                                    {/* Card header */}
                                    <div className="flex items-center gap-4 border-b bg-teal-50 px-6 py-4">
                                        {b.logo_url ? (
                                            <img
                                                src={b.logo_url}
                                                alt={b.bank_name}
                                                className="h-12 w-20 rounded-lg border bg-white object-contain p-1"
                                            />
                                        ) : (
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-600">
                                                <Landmark className="h-6 w-6 text-white" />
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-lg font-bold text-gray-900">{b.bank_name}</p>
                                            <p className="text-sm text-teal-600">{b.account_holder_name}</p>
                                        </div>
                                    </div>

                                    {/* Card body */}
                                    <div className="divide-y px-6">
                                        <div className="flex items-center justify-between py-4">
                                            <div>
                                                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Account Holder</p>
                                                <p className="mt-0.5 font-semibold text-gray-900">{b.account_holder_name}</p>
                                            </div>
                                            <CopyButton text={b.account_holder_name} />
                                        </div>

                                        <div className="flex items-center justify-between py-4">
                                            <div>
                                                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Account Number</p>
                                                <p className="mt-0.5 font-mono font-semibold tracking-wide text-gray-900">{b.account_number}</p>
                                            </div>
                                            <CopyButton text={b.account_number} />
                                        </div>

                                        {b.iban_number && (
                                            <div className="flex items-center justify-between py-4">
                                                <div>
                                                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">IBAN Number</p>
                                                    <p className="mt-0.5 font-mono text-sm font-semibold tracking-wide text-gray-900">{b.iban_number}</p>
                                                </div>
                                                <CopyButton text={b.iban_number} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Note */}
                    <div className="mt-10 rounded-2xl border border-teal-100 bg-teal-50 px-6 py-5 text-sm text-teal-800">
                        <p className="font-semibold">Important Note</p>
                        <p className="mt-1 leading-relaxed text-teal-700">
                            After making the payment, please WhatsApp or email us your transaction receipt along with your name and booking reference. Your booking will be confirmed once the payment is verified.
                        </p>
                    </div>
                </div>
            </main>

            {/* ── FOOTER ── */}
            <footer className="bg-gray-900 py-8 text-center text-xs text-gray-500">
                <p>© {new Date().getFullYear()} AL Abrar Group of Travels. All rights reserved.</p>
                <div className="mt-2 flex items-center justify-center gap-4">
                    <Link href="/" className="hover:text-teal-400">Home</Link>
                    <Link href="/group-tickets" className="hover:text-teal-400">Group Tickets</Link>
                    <Link href="/bank-details" className="hover:text-teal-400">Bank Details</Link>
                </div>
            </footer>
        </>
    );
}
