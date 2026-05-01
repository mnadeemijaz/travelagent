import { Head } from '@inertiajs/react';
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
    agent_name: string | null;
}

interface Props {
    voucher: VoucherData;
    hotels: Hotel[];
    clients: Client[];
    ziarats: { name: string; amount: number }[];
    company: { name: string; address: string; phone: string; email: string };
}

function SectionHeading({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-gray-700 text-white text-sm font-semibold px-3 py-1 mt-3 mb-0">
            {children}
        </div>
    );
}

function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <th className={`border border-gray-400 bg-gray-100 px-2 py-1 text-xs font-semibold text-left ${className}`}>
            {children}
        </th>
    );
}

function Td({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <td className={`border border-gray-400 px-2 py-1 text-xs ${className}`}>
            {children}
        </td>
    );
}

export default function VoucherPublic({ voucher, hotels, clients, ziarats, company }: Props) {
    const ziaratList = ziarats.map(z => z.name).join(', ');

    return (
        <>
            <Head title={`Voucher #${voucher.id} — ${company.name}`} />

            {/* Minimal public header */}
            <div className="bg-gray-800 text-white text-xs px-4 py-2 flex items-center justify-between print:hidden">
                <span className="font-semibold">{company.name}</span>
                <span className="text-gray-400">Verified Voucher — Read Only</span>
            </div>

            <div className="p-4 max-w-5xl mx-auto">
                <div className="relative bg-white border border-gray-300 p-4">

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
                                    <img
                                        src="/storage/icon.png"
                                        alt="Company Logo"
                                        className="h-16 object-contain"
                                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                    />
                                </td>
                                <td className="text-center">
                                    <h2 className="text-lg font-bold m-0">{company.name}</h2>
                                    <p className="text-xs text-gray-600 m-0">{company.address}</p>
                                    <p className="text-xs text-gray-600 m-0">{company.phone} | {company.email}</p>
                                </td>
                                <td className="w-1/4 text-right align-top text-xs text-gray-600">
                                    <div className="flex flex-col items-end gap-1">
                                        <QRCodeSVG
                                            value={voucher.share_url}
                                            size={72}
                                            level="M"
                                            includeMargin={false}
                                        />
                                        <span className="text-[10px] text-gray-500">Scan to verify</span>
                                        <span>Agent: {voucher.agent_name}</span>
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
                        <span>Date Created: {voucher.date}</span>
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
                    <SectionHeading>KSA Arrival Information</SectionHeading>
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

                    {/* Departure */}
                    <SectionHeading>Departure Information</SectionHeading>
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
                            {hotels.length === 0 && (
                                <tr><Td className="text-center" children="—" /></tr>
                            )}
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

                    {/* Bottom image */}
                    <div className="mt-3">
                        <img
                            src="/storage/front/al_abrar.jpg"
                            alt="AL Abrar"
                            className="w-full block"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                    </div>

                    {/* Remarks */}
                    <table className="w-full border-collapse mt-1">
                        <tbody>
                            <tr>
                                <Td><span className="font-semibold">Remarks:</span> {voucher.remarks ?? '—'}</Td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Verified badge */}
                    <div className="mt-4 border-t border-gray-200 pt-2 text-center text-xs text-gray-400">
                        This is an officially issued voucher by {company.name}. Voucher #{voucher.id}.
                    </div>
                </div>
            </div>
        </>
    );
}
