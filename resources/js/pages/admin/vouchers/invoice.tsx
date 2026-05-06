import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { QRCodeSVG } from 'qrcode.react';

interface Hotel {
    city_name: string;
    hotel_name: string | null;
    check_in: string | null;
    check_out: string | null;
    city_nights: number | null;
    room_type: string | null;
    price: number;
}

interface Client {
    sr_name: string | null;
    name: string;
    last_name: string | null;
    ppno: string | null;
    dob: string | null;
    age_group: string | null;
    visa_no: string | null;
    visa_date: string | null;
}

interface VoucherData {
    id: number;
    share_url: string;
    date: string | null;
    approved: boolean;
    t_adult: number;
    t_child: number;
    t_infant: number;
    arv_date: string | null;
    ret_date: string | null;
    dep_date: string | null;
    dep_time: string | null;
    arv_time: string | null;
    ret_time: string | null;
    dep_sector1: string | null;
    dep_sector2: string | null;
    ret_sector1: string | null;
    ret_sector2: string | null;
    dep_flight_name: string | null;
    dep_flight_no: string | null;
    dep_pnr_no: string | null;
    ret_flight_name: string | null;
    ret_flight_no: string | null;
    ret_pnr_no: string | null;
    vehicle_name: string | null;
    trip_name: string | null;
    gp_hd_no: string | null;
    remarks: string | null;
    contact: string | null;
    total_nights: number | null;
    adult_rate: number | null;
    child_rate: number | null;
    infant_rate: number | null;
    sr_rate: number | null;
    total: number | null;
    agent_name: string | null;
}

interface Props {
    voucher: VoucherData;
    hotels: Hotel[];
    clients: Client[];
    ziarats: { name: string; amount: number }[];
    company: {
        name: string; address: string; phone: string; email: string;
        makkah_contact1_name: string | null; makkah_contact1_phone: string | null;
        makkah_contact2_name: string | null; makkah_contact2_phone: string | null;
        madina_contact1_name: string | null; madina_contact1_phone: string | null;
        madina_contact2_name: string | null; madina_contact2_phone: string | null;
        contact_name: string | null; contact_phone: string | null;
        agent_company_name: string | null; agent_address: string | null;
        agent_mobile: string | null; agent_logo_url: string | null;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Vouchers', href: '/admin/vouchers' },
    { title: 'Invoice', href: '#' },
];

function SectionHeading({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-gray-700 text-white text-sm font-semibold px-3 py-1 mt-3 mb-0">
            {children}
        </div>
    );
}

function Th({ children, className = '', colSpan }: { children: React.ReactNode; className?: string; colSpan?: number }) {
    return (
        <th colSpan={colSpan} className={`border border-gray-400 bg-gray-100 px-2 py-1 text-xs font-semibold text-left ${className}`}>
            {children}
        </th>
    );
}

function Td({ children, className = '', colSpan }: { children: React.ReactNode; className?: string; colSpan?: number }) {
    return (
        <td colSpan={colSpan} className={`border border-gray-400 px-2 py-1 text-xs ${className}`}>
            {children}
        </td>
    );
}

export default function VoucherInvoice({ voucher, hotels, clients, ziarats, company }: Props) {
    const ziaratList = ziarats.map(z => z.name).join(', ');
    const sr = voucher.sr_rate ?? 1;
    const adultAmt  = (voucher.adult_rate  ?? 0) * sr * voucher.t_adult;
    const childAmt  = (voucher.child_rate  ?? 0) * sr * voucher.t_child;
    const infantAmt = (voucher.infant_rate ?? 0) * sr * voucher.t_infant;
    const visaTotal = adultAmt + childAmt + infantAmt;
    // Accommodation: price/night × sr_rate × nights
    const accommodationTotal = hotels.reduce((sum, h) => sum + (h.price ?? 0) * sr * (h.city_nights ?? 0), 0);
    // Ziarat total: sum of each ziarat amount × sr_rate
    const ziaratTotal = ziarats.reduce((sum, z) => sum + z.amount, 0) * sr;
    const grandTotal = visaTotal + accommodationTotal + ziaratTotal;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Invoice #${voucher.id}`} />

            <div className="p-4 max-w-5xl mx-auto">
                {/* Action buttons */}
                <div className="flex gap-2 mb-4 no-print">
                    <Link
                        href={route('admin.vouchers.view', voucher.id)}
                        className="px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                    >
                        View Voucher
                    </Link>
                    <a
                        href={route('admin.vouchers.invoice-pdf', voucher.id)}
                        className="px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                        Download PDF
                    </a>
                    <button
                        onClick={() => window.print()}
                        className="px-3 py-1.5 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                    >
                        Print
                    </button>
                    <Link
                        href={route('admin.vouchers.index')}
                        className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                    >
                        Back
                    </Link>
                </div>

                {/* Printable area */}
                <div id="invoice-print" className="relative bg-white border border-gray-300 p-4 print:border-0 print:p-0">

                    {/* Not Approved Watermark */}
                    {!voucher.approved && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 rotate-[-30deg]">
                            <span className="text-red-500 text-6xl font-extrabold uppercase opacity-20 whitespace-nowrap select-none">
                                Not Approved
                            </span>
                        </div>
                    )}

                    {/* Header */}
                    <table className="w-full mb-2">
                        <tbody>
                            <tr>
                                <td className="w-1/4 align-bottom">
                                    {company.agent_logo_url ? (
                                        <img
                                            src={company.agent_logo_url}
                                            alt="Company Logo"
                                            className="h-16 object-contain"
                                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                        />
                                    ) : null}
                                </td>
                                <td className="text-center">
                                    <h2 className="text-lg font-bold m-0">{company.agent_company_name}</h2>
                                    {company.agent_address && <p className="text-xs text-gray-600 m-0">{company.agent_address}</p>}
                                    {company.agent_mobile && <p className="text-xs text-gray-600 m-0">{company.agent_mobile}</p>}
                                </td>
                                <td className="w-1/4 text-right align-top">
                                    <div className="flex flex-col items-end gap-1">
                                        <QRCodeSVG
                                            value={voucher.share_url}
                                            size={72}
                                            level="M"
                                            includeMargin={false}
                                        />
                                        <span className="text-[10px] text-gray-500">Scan to verify</span>
                                        {/* <span className="text-xs text-gray-600">Agent: {voucher.agent_name}</span> */}
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {!voucher.approved && (
                        <p className="text-center font-bold text-red-600 text-sm mb-1">Voucher Not Approved</p>
                    )}

                    {/* Voucher No & Date */}
                    <div className="flex justify-between bg-gray-200 px-3 py-1 text-sm font-semibold mb-0">
                        <span>Voucher No: {voucher.id}</span>
                        <span>Date: {voucher.date}</span>
                    </div>
                    <div className="flex justify-between px-3 py-0.5 text-xs text-gray-600 border-b border-gray-300 mb-0">
                        <span>Group Head Phone: {voucher.gp_hd_no ?? '—'}</span>
                        <span>Party: {voucher.agent_name}</span>
                    </div>

                    {/* General Information */}
                    <SectionHeading>General Information About Service</SectionHeading>
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <Th>Adults</Th><Th>Child</Th><Th>Infant</Th>
                                <Th>Arrival Date</Th><Th>Dep. Date</Th><Th>Nights</Th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <Td>{voucher.t_adult}</Td>
                                <Td>{voucher.t_child}</Td>
                                <Td>{voucher.t_infant}</Td>
                                <Td>{voucher.arv_date ?? '—'}</Td>
                                <Td>{voucher.ret_date ?? '—'}</Td>
                                <Td>{voucher.total_nights ?? '—'}</Td>
                            </tr>
                        </tbody>
                    </table>

                    {/* KSA Arrival */}
                    <SectionHeading>Departure Information</SectionHeading>
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <Th>Sector</Th><Th>Flight No</Th><Th>Dep Date</Th>
                                <Th>Dep Time</Th><Th>Arrival Date</Th><Th>Arrival Time</Th><Th>PNR</Th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <Td>{[voucher.dep_sector1, voucher.dep_sector2].filter(Boolean).join(' - ') || '—'}</Td>
                                <Td>{[voucher.dep_flight_name, voucher.dep_flight_no].filter(Boolean).join(' - ') || '—'}</Td>
                                <Td>{voucher.dep_date ?? '—'}</Td>
                                <Td>{voucher.dep_time ?? '—'}</Td>
                                <Td>{voucher.arv_date ?? '—'}</Td>
                                <Td>{voucher.arv_time ?? '—'}</Td>
                                <Td>{voucher.dep_pnr_no ?? '—'}</Td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Return */}
                    <SectionHeading>Return Information</SectionHeading>
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <Th>Sector</Th><Th>Flight No</Th><Th>Dep Date</Th><Th>Dep Time</Th><Th>PNR</Th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <Td>{[voucher.ret_sector1, voucher.ret_sector2].filter(Boolean).join(' - ') || '—'}</Td>
                                <Td>{[voucher.ret_flight_name, voucher.ret_flight_no].filter(Boolean).join(' - ') || '—'}</Td>
                                <Td>{voucher.ret_date ?? '—'}</Td>
                                <Td>{voucher.ret_time ?? '—'}</Td>
                                <Td>{voucher.ret_pnr_no ?? '—'}</Td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Accommodation */}
                    <SectionHeading>Accommodation Detail</SectionHeading>
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <Th>City</Th><Th>Hotel</Th><Th>Check In</Th><Th>Check Out</Th><Th>Nights</Th><Th>Room Type</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {hotels.map((h, i) => (
                                <tr key={i}>
                                    <Td>{h.city_name}</Td>
                                    <Td>{h.hotel_name ?? '—'}</Td>
                                    <Td>{h.check_in ?? '—'}</Td>
                                    <Td>{h.check_out ?? '—'}</Td>
                                    <Td>{h.city_nights ?? '—'}</Td>
                                    <Td>{h.room_type ?? '—'}</Td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Transportation */}
                    <SectionHeading>Transportational Detail</SectionHeading>
                    <table className="w-full border-collapse">
                        <thead>
                            <tr><Th>Transport Trip</Th><Th>Transport By</Th></tr>
                        </thead>
                        <tbody>
                            <tr>
                                <Td>{voucher.trip_name ?? '—'}</Td>
                                <Td>{voucher.vehicle_name ?? '—'}</Td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Pilgrims */}
                    <SectionHeading>Mutamer's (Pilgrims) Detail</SectionHeading>
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <Th>Sr#</Th><Th>Pilgrim Name</Th><Th>Ziarat</Th>
                                <Th>Passport No</Th><Th>DOB</Th><Th>Age Group</Th>
                                <Th>Visa No</Th><Th>Issue Date</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map((c, i) => (
                                <tr key={i}>
                                    <Td>{i + 1}</Td>
                                    <Td>{[c.sr_name, c.name, c.last_name].filter(Boolean).join(' ')}</Td>
                                    <Td>{ziaratList || '—'}</Td>
                                    <Td>{c.ppno ?? '—'}</Td>
                                    <Td>{c.dob ?? '—'}</Td>
                                    <Td className="capitalize">{c.age_group ?? '—'}</Td>
                                    <Td>{c.visa_no ?? '—'}</Td>
                                    <Td>{c.visa_date ?? '—'}</Td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Remarks */}
                    <table className="w-full border-collapse mt-1">
                        <tbody>
                            <tr>
                                <Td><span className="font-semibold">Remarks:</span> {voucher.remarks ?? '—'}</Td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Accounts / Financial Summary */}
                    <SectionHeading>Accounts Detail</SectionHeading>

                    {/* Accommodation breakdown */}
                    {hotels.length > 0 && (
                        <table className="w-full border-collapse mt-1">
                            <thead>
                                <tr>
                                    <Th>Hotel</Th><Th>City</Th><Th>Room Type</Th>
                                    <Th>Nights</Th><Th>Rate / Night</Th><Th>Amount</Th>
                                </tr>
                            </thead>
                            <tbody>
                                {hotels.map((h, i) => (
                                    <tr key={i}>
                                        <Td>{h.hotel_name ?? '—'}</Td>
                                        <Td>{h.city_name}</Td>
                                        <Td>{h.room_type ?? '—'}</Td>
                                        <Td>{h.city_nights ?? 0}</Td>
                                        <Td>{((h.price ?? 0) * sr).toLocaleString()}</Td>
                                        <Td>{((h.price ?? 0) * sr * (h.city_nights ?? 0)).toLocaleString()}</Td>
                                    </tr>
                                ))}
                                <tr className="bg-gray-50">
                                    <Td colSpan={5} className="font-semibold text-right">Accommodation Total</Td>
                                    <Td className="font-semibold">{accommodationTotal.toLocaleString()}</Td>
                                </tr>
                            </tbody>
                        </table>
                    )}

                    {/* Visa summary */}
                    {(voucher.adult_rate || voucher.child_rate || voucher.infant_rate) ? (
                        <table className="w-full border-collapse mt-2">
                            <thead>
                                <tr>
                                    <Th>&nbsp;</Th><Th>Adult</Th><Th>Child</Th><Th>Infant</Th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <Td className="font-semibold">Count</Td>
                                    <Td>{voucher.t_adult}</Td><Td>{voucher.t_child}</Td><Td>{voucher.t_infant}</Td>
                                </tr>
                                <tr>
                                    <Td className="font-semibold">Rate</Td>
                                    <Td>{((voucher.adult_rate ?? 0) * sr).toLocaleString()}</Td>
                                    <Td>{((voucher.child_rate ?? 0) * sr).toLocaleString()}</Td>
                                    <Td>{((voucher.infant_rate ?? 0) * sr).toLocaleString()}</Td>
                                </tr>
                                <tr className="bg-gray-50">
                                    <Td className="font-semibold" colSpan={3}>Visa Amount</Td>
                                    <Td className="font-semibold">{visaTotal.toLocaleString()}</Td>
                                </tr>
                            </tbody>
                        </table>
                    ) : null}

                    {/* Ziarat Total */}
                    {ziarats.length > 0 && (
                        <table className="w-full border-collapse mt-2">
                            <tbody>
                                <tr>
                                    <Td className="font-semibold">Ziarat</Td>
                                    <Td>{ziaratList}</Td>
                                    <Td className="font-semibold text-right">Ziarat Total</Td>
                                    <Td className="font-semibold">{ziaratTotal.toLocaleString()}</Td>
                                </tr>
                            </tbody>
                        </table>
                    )}

                    {/* Grand Total */}
                    <table className="w-full border-collapse mt-2">
                        <tbody>
                            <tr className="bg-gray-200">
                                <Td className="font-bold text-base" colSpan={3}>Grand Total</Td>
                                <Td className="font-bold text-base">{grandTotal.toLocaleString()}</Td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Bottom image */}
                    <div className="mt-3">
                        <img
                            src="/storage/front/al_abrar.jpg"
                            alt="AL Abrar"
                            className="w-full block"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                    </div>

                    {/* Helper Contacts */}
                    {voucher.contact === 'only_transport' ? (
                        company.contact_name || company.contact_phone ? (
                            <div className="mt-3 border-t border-gray-300 pt-2">
                                <div className="bg-gray-700 text-white text-xs font-semibold px-3 py-1 mb-1">Helper Contacts</div>
                                <table className="w-full border-collapse">
                                    <tbody>
                                        <tr>
                                            <td className="border border-gray-400 px-2 py-1 text-xs">
                                                {company.contact_name && <span>{company.contact_name}: </span>}
                                                <span className="font-semibold">{company.contact_phone}</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        ) : null
                    ) : (
                        (company.makkah_contact1_name || company.makkah_contact2_name || company.madina_contact1_name || company.madina_contact2_name) && (
                            <div className="mt-3 border-t border-gray-300 pt-2">
                                <div className="bg-gray-700 text-white text-xs font-semibold px-3 py-1 mb-1">Helper Contacts</div>
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="border border-gray-400 bg-gray-100 px-2 py-1 text-xs font-semibold text-left w-1/2">Makkah</th>
                                            <th className="border border-gray-400 bg-gray-100 px-2 py-1 text-xs font-semibold text-left w-1/2">Madina</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border border-gray-400 px-2 py-1 text-xs">
                                                {company.makkah_contact1_name && <div>{company.makkah_contact1_name}: <span className="font-semibold">{company.makkah_contact1_phone}</span></div>}
                                                {company.makkah_contact2_name && <div>{company.makkah_contact2_name}: <span className="font-semibold">{company.makkah_contact2_phone}</span></div>}
                                            </td>
                                            <td className="border border-gray-400 px-2 py-1 text-xs">
                                                {company.madina_contact1_name && <div>{company.madina_contact1_name}: <span className="font-semibold">{company.madina_contact1_phone}</span></div>}
                                                {company.madina_contact2_name && <div>{company.madina_contact2_name}: <span className="font-semibold">{company.madina_contact2_phone}</span></div>}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )
                    )}
                </div>
            </div>

            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    #invoice-print, #invoice-print * { visibility: visible; }
                    #invoice-print { position: absolute; top: 0; left: 0; width: 100%; margin: 0; padding: 8px; border: none !important; }
                    .no-print { display: none !important; }
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                }
            `}</style>
        </AppLayout>
    );
}
