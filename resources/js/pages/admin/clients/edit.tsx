import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

interface Agent { id: number; name: string; }
interface VisaCompany { id: number; name: string; }
interface Client {
    id: number;
    sr_name: string | null;
    name: string;
    last_name: string | null;
    cnic: string | null;
    dob: string | null;
    age_group: string | null;
    ppno: string | null;
    passport_issue_date: string | null;
    passport_exp_date: string | null;
    agent_id: number | null;
    visa_company_id: number | null;
    account_pkg: string | null;
    document: string | null;
    group_code: string | null;
    group_name: string | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Clients', href: '/admin/clients' },
    { title: 'Edit Client', href: '#' },
];

function toDateInput(val: string | null): string {
    if (!val) return '';
    return val.substring(0, 10);
}

function calcAgeGroup(dob: string): string {
    if (!dob) return '';
    const ms = Date.now() - new Date(dob).getTime();
    const days = ms / 86400000;
    if (days < 730) return 'infant';
    if (days < 3650) return 'child';
    return 'adult';
}

export default function ClientsEdit({
    client,
    agents,
    visaCompanies,
    flash,
}: {
    client: Client;
    agents: Agent[];
    visaCompanies: VisaCompany[];
    flash?: { success?: string };
}) {
    const { data, setData, put, processing, errors } = useForm({
        sr_name: client.sr_name ?? '',
        name: client.name,
        last_name: client.last_name ?? '',
        cnic: client.cnic ?? '',
        dob: toDateInput(client.dob),
        age_group: client.age_group ?? '',
        ppno: client.ppno ?? '',
        passport_issue_date: toDateInput(client.passport_issue_date),
        passport_exp_date: toDateInput(client.passport_exp_date),
        agent_id: client.agent_id ? String(client.agent_id) : '',
        visa_company_id: client.visa_company_id ? String(client.visa_company_id) : '',
        account_pkg: client.account_pkg ?? '',
        document: client.document === 'yes',
        group_code: client.group_code ?? '',
        group_name: client.group_name ?? '',
    });

    function handleDobChange(val: string) {
        setData('dob', val);
        setData('age_group', calcAgeGroup(val));
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        put(`/admin/clients/${client.id}`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Client" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Edit Client</h1>
                    <Button variant="outline" asChild><Link href="/admin/clients">Back</Link></Button>
                </div>

                {flash?.success && (
                    <div className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">{flash.success}</div>
                )}

                <form onSubmit={submit} className="max-w-2xl space-y-5">
                    {/* Title + Name */}
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-2 space-y-1">
                            <Label>Title</Label>
                            <select
                                value={data.sr_name}
                                onChange={e => setData('sr_name', e.target.value)}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                                <option value="">—</option>
                                <option value="Mr">Mr</option>
                                <option value="Miss">Miss</option>
                                <option value="Mrs">Mrs</option>
                            </select>
                        </div>
                        <div className="col-span-5 space-y-1">
                            <Label>First Name <span className="text-destructive">*</span></Label>
                            <Input value={data.name} onChange={e => setData('name', e.target.value)} maxLength={128} />
                            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                        </div>
                        <div className="col-span-5 space-y-1">
                            <Label>Last Name</Label>
                            <Input value={data.last_name} onChange={e => setData('last_name', e.target.value)} maxLength={128} />
                        </div>
                    </div>

                    {/* CNIC */}
                    <div className="space-y-1">
                        <Label>CNIC</Label>
                        <Input value={data.cnic} onChange={e => setData('cnic', e.target.value)} maxLength={20} />
                    </div>

                    {/* DOB + Age Group */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label>Date of Birth</Label>
                            <Input type="date" value={data.dob} onChange={e => handleDobChange(e.target.value)} />
                        </div>
                        <div className="space-y-1">
                            <Label>Age Group</Label>
                            <Input value={data.age_group} readOnly className="bg-muted capitalize" />
                        </div>
                    </div>

                    {/* PP No + Agent */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label>Passport No</Label>
                            <Input value={data.ppno} onChange={e => setData('ppno', e.target.value)} maxLength={50} />
                        </div>
                        <div className="space-y-1">
                            <Label>Agent</Label>
                            <select
                                value={data.agent_id}
                                onChange={e => setData('agent_id', e.target.value)}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                                <option value="">— Select Agent —</option>
                                {agents.map(a => (
                                    <option key={a.id} value={String(a.id)}>{a.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Passport Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label>Passport Issue Date</Label>
                            <Input type="date" value={data.passport_issue_date} onChange={e => setData('passport_issue_date', e.target.value)} />
                        </div>
                        <div className="space-y-1">
                            <Label>Passport Expiry Date</Label>
                            <Input type="date" value={data.passport_exp_date} onChange={e => setData('passport_exp_date', e.target.value)} />
                        </div>
                    </div>

                    {/* Visa Company + Account PKG */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label>Visa Company</Label>
                            <select
                                value={data.visa_company_id}
                                onChange={e => setData('visa_company_id', e.target.value)}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                                <option value="">— Select Company —</option>
                                {visaCompanies.map(vc => (
                                    <option key={vc.id} value={String(vc.id)}>{vc.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <Label>Account Package</Label>
                            <Input value={data.account_pkg} onChange={e => setData('account_pkg', e.target.value)} maxLength={128} />
                        </div>
                    </div>

                    {/* Group Code + Group Name */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label>Group Code</Label>
                            <Input value={data.group_code} onChange={e => setData('group_code', e.target.value)} maxLength={50} />
                        </div>
                        <div className="space-y-1">
                            <Label>Group Name</Label>
                            <Input value={data.group_name} onChange={e => setData('group_name', e.target.value)} maxLength={128} />
                        </div>
                    </div>

                    {/* Documentation checkbox */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="document"
                            checked={data.document}
                            onChange={e => setData('document', e.target.checked)}
                            className="rounded"
                        />
                        <Label htmlFor="document">Documentation Fee Received</Label>
                    </div>

                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing} className="bg-teal-600 hover:bg-teal-700">
                            Update Client
                        </Button>
                        <Button type="button" variant="destructive" asChild>
                            <Link href="/admin/clients">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
