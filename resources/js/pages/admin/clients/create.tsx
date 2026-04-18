import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

interface Agent { id: number; name: string; }
interface VisaCompany { id: number; name: string; }

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Clients', href: '/admin/clients' },
    { title: 'Add Client', href: '#' },
];

function calcAgeGroup(dob: string): string {
    if (!dob) return '';
    const ms = Date.now() - new Date(dob).getTime();
    const days = ms / 86400000;
    if (days < 730) return 'infant';
    if (days < 3650) return 'child';
    return 'adult';
}

export default function ClientsCreate({
    agents,
    visaCompanies,
}: {
    agents: Agent[];
    visaCompanies: VisaCompany[];
}) {
    const { data, setData, post, processing, errors } = useForm({
        sr_name: '',
        name: '',
        last_name: '',
        cnic: '',
        dob: '',
        age_group: '',
        ppno: '',
        agent_id: '',
        visa_company_id: '',
    });

    function handleDobChange(val: string) {
        setData('dob', val);
        setData('age_group', calcAgeGroup(val));
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/admin/clients');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Client" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Add Client</h1>
                    <Button variant="outline" asChild><Link href="/admin/clients">Back</Link></Button>
                </div>

                <form onSubmit={submit} className="max-w-2xl space-y-5">
                    {/* Title + Name row */}
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
                            {errors.sr_name && <p className="text-xs text-destructive">{errors.sr_name}</p>}
                        </div>
                        <div className="col-span-5 space-y-1">
                            <Label>First Name <span className="text-destructive">*</span></Label>
                            <Input value={data.name} onChange={e => setData('name', e.target.value)} maxLength={128} />
                            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                        </div>
                        <div className="col-span-5 space-y-1">
                            <Label>Last Name</Label>
                            <Input value={data.last_name} onChange={e => setData('last_name', e.target.value)} maxLength={128} />
                            {errors.last_name && <p className="text-xs text-destructive">{errors.last_name}</p>}
                        </div>
                    </div>

                    {/* CNIC */}
                    <div className="space-y-1">
                        <Label>CNIC</Label>
                        <Input value={data.cnic} onChange={e => setData('cnic', e.target.value)} maxLength={20} placeholder="e.g. 3520212345678" />
                        {errors.cnic && <p className="text-xs text-destructive">{errors.cnic}</p>}
                    </div>

                    {/* DOB + Age Group */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label>Date of Birth</Label>
                            <Input type="date" value={data.dob} onChange={e => handleDobChange(e.target.value)} />
                            {errors.dob && <p className="text-xs text-destructive">{errors.dob}</p>}
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
                            {errors.ppno && <p className="text-xs text-destructive">{errors.ppno}</p>}
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
                            {errors.agent_id && <p className="text-xs text-destructive">{errors.agent_id}</p>}
                        </div>
                    </div>

                    {/* Visa Company */}
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
                        {errors.visa_company_id && <p className="text-xs text-destructive">{errors.visa_company_id}</p>}
                    </div>

                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing} className="bg-teal-600 hover:bg-teal-700">
                            Save Client
                        </Button>
                        <Button type="reset" variant="outline">Reset</Button>
                        <Button type="button" variant="destructive" asChild>
                            <Link href="/admin/clients">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
