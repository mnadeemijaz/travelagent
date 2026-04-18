import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface Agent { id: number; name: string; }
interface Client {
    id: number;
    sr_name: string | null;
    name: string;
    last_name: string | null;
    ppno: string | null;
    dob: string | null;
    created_at: string | null;
    passport_issue_date: string | null;
    passport_exp_date: string | null;
    age_group: string | null;
    account_pkg: string | null;
    document: string | null;
    visa_approve: string;
    voucher_issue: string;
    agent: Agent | null;
}
interface Paginated<T> {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    links: { url: string | null; label: string; active: boolean }[];
}
interface Filters {
    searchText?: string;
    age_group?: string;
    visa_approve?: string;
    agent_id?: string;
    documentation?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Clients', href: '/admin/clients' },
];

function fmtDate(val: string | null): string {
    if (!val) return '—';
    return val.substring(0, 10);
}

export default function ClientsIndex({
    clients,
    agents,
    filters,
    flash,
}: {
    clients: Paginated<Client>;
    agents: Agent[];
    filters: Filters;
    flash?: { success?: string };
}) {
    const { data, setData, get, processing } = useForm({
        searchText: filters.searchText ?? '',
        age_group: filters.age_group ?? '',
        visa_approve: filters.visa_approve ?? '',
        agent_id: filters.agent_id ?? '',
        documentation: filters.documentation ?? '',
    });

    function search(e: React.FormEvent) {
        e.preventDefault();
        get('/admin/clients', { preserveState: true, replace: true });
    }

    const [visaModal, setVisaModal] = useState<{ id: number } | null>(null);
    const [visaNo, setVisaNo] = useState('');
    const [visaDate, setVisaDate] = useState('');

    function toggleVisa(client: Client) {
        if (client.visa_approve === 'no') {
            router.post('/admin/clients/approve-visa', { id: client.id }, { preserveScroll: true });
        } else {
            router.post('/admin/clients/reject-visa', { id: client.id }, { preserveScroll: true });
        }
    }

    function openVisaModal(id: number) {
        setVisaModal({ id });
        setVisaNo('');
        setVisaDate('');
    }

    function submitVisa(e: React.FormEvent) {
        e.preventDefault();
        if (!visaModal) return;
        router.post('/admin/clients/update-visa', { id: visaModal.id, visa_no: visaNo, visa_date: visaDate }, {
            preserveScroll: true,
            onSuccess: () => setVisaModal(null),
        });
    }

    function destroy(id: number, name: string) {
        if (!confirm(`Delete client "${name}"?`)) return;
        router.delete(`/admin/clients/${id}`, { preserveScroll: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Client Management" />
            <div className="flex flex-col gap-4 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Client Management</h1>
                    <Button asChild><Link href="/admin/clients/create">+ Add New</Link></Button>
                </div>

                {flash?.success && (
                    <div className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">{flash.success}</div>
                )}

                {/* Filters */}
                <form onSubmit={search} className="flex flex-wrap items-end gap-3">
                    <select
                        value={data.age_group}
                        onChange={e => setData('age_group', e.target.value)}
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                        <option value="">All Age Groups</option>
                        <option value="adult">Adult</option>
                        <option value="child">Child</option>
                        <option value="infant">Infant</option>
                    </select>

                    <select
                        value={data.visa_approve}
                        onChange={e => setData('visa_approve', e.target.value)}
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                        <option value="">All Visa Status</option>
                        <option value="yes">Approved</option>
                        <option value="no">Not Approved</option>
                    </select>

                    <select
                        value={data.agent_id}
                        onChange={e => setData('agent_id', e.target.value)}
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                        <option value="">All Agents</option>
                        {agents.map(a => (
                            <option key={a.id} value={String(a.id)}>{a.name}</option>
                        ))}
                    </select>

                    <select
                        value={data.documentation}
                        onChange={e => setData('documentation', e.target.value)}
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                        <option value="">Documentation</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>

                    <input
                        type="text"
                        placeholder="Search name / PPNO / CNIC..."
                        value={data.searchText}
                        onChange={e => setData('searchText', e.target.value)}
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm w-52"
                    />

                    <Button type="submit" disabled={processing} variant="outline">Search</Button>
                </form>

                {/* Table */}
                <div className="overflow-hidden rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-muted-foreground">
                            <tr>
                                <th className="px-3 py-3 text-left font-medium w-10">Sr#</th>
                                <th className="px-3 py-3 text-left font-medium">Visa</th>
                                <th className="px-3 py-3 text-left font-medium">Title</th>
                                <th className="px-3 py-3 text-left font-medium">Name</th>
                                <th className="px-3 py-3 text-left font-medium">PP Issue</th>
                                <th className="px-3 py-3 text-left font-medium">PP Exp</th>
                                <th className="px-3 py-3 text-left font-medium">DOB</th>
                                <th className="px-3 py-3 text-left font-medium">Created At</th>
                                <th className="px-3 py-3 text-left font-medium">PP No</th>
                                <th className="px-3 py-3 text-left font-medium">Age Group</th>
                                <th className="px-3 py-3 text-left font-medium">Agent</th>
                                <th className="px-3 py-3 text-left font-medium">Pkg</th>
                                <th className="px-3 py-3 text-left font-medium">Docs</th>
                                <th className="px-3 py-3 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {clients.data.length === 0 && (
                                <tr>
                                    <td colSpan={13} className="px-4 py-8 text-center text-muted-foreground">
                                        No clients found.
                                    </td>
                                </tr>
                            )}
                            {clients.data.map((c, i) => (
                                <tr key={c.id} className="hover:bg-muted/30">
                                    <td className="px-3 py-2">
                                        {(clients.current_page - 1) * clients.per_page + i + 1}
                                    </td>
                                    <td className="px-3 py-2">
                                        {c.voucher_issue === 'no' ? (
                                            c.visa_approve === 'no' ? (
                                                <button
                                                    onClick={() => toggleVisa(c)}
                                                    className="rounded bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700 hover:bg-emerald-200"
                                                >
                                                    ✓ Approve
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => toggleVisa(c)}
                                                    className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-700 hover:bg-red-200"
                                                >
                                                    ✗ Revoke
                                                </button>
                                            )
                                        ) : (
                                            <button
                                                onClick={() => openVisaModal(c.id)}
                                                className="rounded bg-sky-100 px-2 py-0.5 text-xs text-sky-700 hover:bg-sky-200"
                                            >
                                                Edit Visa
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-3 py-2 text-muted-foreground">{c.sr_name ?? '—'}</td>
                                    <td className="px-3 py-2 font-medium">{c.name} {c.last_name}</td>
                                    <td className="px-3 py-2 text-muted-foreground">{fmtDate(c.passport_issue_date)}</td>
                                    <td className="px-3 py-2 text-muted-foreground">{fmtDate(c.passport_exp_date)}</td>
                                    <td className="px-3 py-2 text-muted-foreground">{fmtDate(c.dob)}</td>
                                    <td className="px-3 py-2 text-muted-foreground">{fmtDate(c.created_at)}</td>
                                    <td className="px-3 py-2">{c.ppno ?? '—'}</td>
                                    <td className="px-3 py-2 capitalize">{c.age_group ?? '—'}</td>
                                    <td className="px-3 py-2">{c.agent?.name ?? '—'}</td>
                                    <td className="px-3 py-2">{c.account_pkg ?? '—'}</td>
                                    <td className="px-3 py-2">
                                        <span className={`rounded px-1.5 py-0.5 text-xs ${c.document === 'yes' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                            {c.document === 'yes' ? 'Yes' : 'No'}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/admin/clients/${c.id}/edit`}>Edit</Link>
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => destroy(c.id, c.name)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {clients.last_page > 1 && (
                    <div className="flex flex-wrap items-center gap-1">
                        {clients.links.map((link, i) => (
                            <button
                                key={i}
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                className={`rounded px-3 py-1 text-sm ${
                                    link.active
                                        ? 'bg-primary text-primary-foreground'
                                        : 'border hover:bg-muted/50 disabled:opacity-40'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Visa Number Modal */}
            {visaModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
                        <h2 className="mb-4 text-lg font-semibold">Update Visa Details</h2>
                        <form onSubmit={submitVisa} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Visa No</label>
                                <input
                                    type="text"
                                    value={visaNo}
                                    onChange={e => setVisaNo(e.target.value)}
                                    required
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Visa Date</label>
                                <input
                                    type="date"
                                    value={visaDate}
                                    onChange={e => setVisaDate(e.target.value)}
                                    required
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => setVisaModal(null)}>Cancel</Button>
                                <Button type="submit">Save</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
