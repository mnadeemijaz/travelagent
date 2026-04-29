import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

interface Pkg { id: number; name: string; price: string; image_url: string; active: boolean; }

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Tour Packages', href: '/admin/packages' },
];

export default function PackagesIndex({ packages, flash }: { packages: Pkg[]; flash?: { success?: string } }) {
    function destroy(id: number, name: string) {
        if (!confirm(`Delete "${name}"?`)) return;
        router.delete(`/admin/packages/${id}`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <SettingsLayout wide>
            <Head title="Tour Packages" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Tour Packages</h1>
                    <Button asChild><Link href="/admin/packages/create">Add Package</Link></Button>
                </div>

                {flash?.success && (
                    <div className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">{flash.success}</div>
                )}

                <div className="overflow-hidden rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">Image</th>
                                <th className="px-4 py-3 text-left font-medium">Package Name</th>
                                <th className="px-4 py-3 text-left font-medium">Price</th>
                                <th className="px-4 py-3 text-left font-medium">Status</th>
                                <th className="px-4 py-3 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {packages.length === 0 && (
                                <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No packages yet.</td></tr>
                            )}
                            {packages.map((p) => (
                                <tr key={p.id} className="hover:bg-muted/30">
                                    <td className="px-4 py-3">
                                        {p.image_url
                                            ? <img src={p.image_url} alt={p.name} className="h-12 w-16 rounded-md object-cover" />
                                            : <div className="h-12 w-16 rounded-md bg-gray-100" />}
                                    </td>
                                    <td className="px-4 py-3 font-medium">{p.name}</td>
                                    <td className="px-4 py-3">{p.price}</td>
                                    <td className="px-4 py-3">
                                        <Badge variant={p.active ? 'default' : 'secondary'}>
                                            {p.active ? 'Active' : 'Hidden'}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/admin/packages/${p.id}/edit`}>Edit</Link>
                                            </Button>
                                            <Button variant="destructive" size="sm" onClick={() => destroy(p.id, p.name)}>
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
            </SettingsLayout>
        </AppLayout>
    );
}
