import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Landmark } from 'lucide-react';

interface BankDetailRow {
    id: number;
    bank_name: string;
    account_holder_name: string;
    account_number: string;
    iban_number: string | null;
    logo_url: string | null;
    active: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Bank Details', href: '/admin/bank-details' },
];

export default function BankDetailsIndex({ bankDetails, flash }: { bankDetails: BankDetailRow[]; flash?: { success?: string } }) {
    function destroy(id: number, name: string) {
        if (!confirm(`Delete "${name}"?`)) return;
        router.delete(`/admin/bank-details/${id}`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bank Details" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Bank Details</h1>
                    <Button asChild className="bg-teal-600 hover:bg-teal-700">
                        <Link href="/admin/bank-details/create">Add Bank Detail</Link>
                    </Button>
                </div>

                {flash?.success && (
                    <div className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">{flash.success}</div>
                )}

                <div className="overflow-hidden rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">Logo</th>
                                <th className="px-4 py-3 text-left font-medium">Bank Name</th>
                                <th className="px-4 py-3 text-left font-medium">Account Holder</th>
                                <th className="px-4 py-3 text-left font-medium">Account No.</th>
                                <th className="px-4 py-3 text-left font-medium">IBAN</th>
                                <th className="px-4 py-3 text-left font-medium">Status</th>
                                <th className="px-4 py-3 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {bankDetails.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                                        No bank details yet.
                                    </td>
                                </tr>
                            )}
                            {bankDetails.map((b) => (
                                <tr key={b.id} className="hover:bg-muted/30">
                                    <td className="px-4 py-3">
                                        {b.logo_url ? (
                                            <img src={b.logo_url} alt={b.bank_name} className="h-10 w-16 rounded-md object-contain" />
                                        ) : (
                                            <div className="flex h-10 w-16 items-center justify-center rounded-md bg-gray-100">
                                                <Landmark className="h-5 w-5 text-gray-400" />
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 font-medium">{b.bank_name}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{b.account_holder_name}</td>
                                    <td className="px-4 py-3 font-mono">{b.account_number}</td>
                                    <td className="px-4 py-3 font-mono text-xs">{b.iban_number ?? '—'}</td>
                                    <td className="px-4 py-3">
                                        <Badge variant={b.active ? 'default' : 'secondary'}>
                                            {b.active ? 'Active' : 'Hidden'}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/admin/bank-details/${b.id}/edit`}>Edit</Link>
                                            </Button>
                                            <Button variant="destructive" size="sm" onClick={() => destroy(b.id, b.bank_name)}>
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
