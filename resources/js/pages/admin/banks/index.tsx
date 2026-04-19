import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

interface Bank { id: number; name: string; }

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Banks', href: '/admin/banks' },
];

export default function BanksIndex({ banks, flash }: { banks: Bank[]; flash?: { success?: string } }) {
    function destroy(id: number, name: string) {
        if (!confirm(`Delete bank "${name}"?`)) return;
        router.delete(`/admin/banks/${id}`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Banks" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Banks</h1>
                    <Button asChild><Link href="/admin/banks/create">Add Bank</Link></Button>
                </div>

                {flash?.success && (
                    <div className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">{flash.success}</div>
                )}

                <div className="overflow-hidden rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">#</th>
                                <th className="px-4 py-3 text-left font-medium">Bank Name</th>
                                <th className="px-4 py-3 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {banks.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                                        No banks added yet.
                                    </td>
                                </tr>
                            )}
                            {banks.map((bank, i) => (
                                <tr key={bank.id} className="hover:bg-muted/30">
                                    <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                                    <td className="px-4 py-3 font-medium">{bank.name}</td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/admin/banks/${bank.id}/edit`}>Edit</Link>
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => destroy(bank.id, bank.name)}
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
            </div>
        </AppLayout>
    );
}
