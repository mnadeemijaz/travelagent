import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

interface Exp { id: number; name: string; image_url: string; active: boolean; }

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Experiences', href: '/admin/experiences' },
];

export default function ExperiencesIndex({ experiences, flash }: { experiences: Exp[]; flash?: { success?: string } }) {
    function destroy(id: number, name: string) {
        if (!confirm(`Delete "${name}"?`)) return;
        router.delete(`/admin/experiences/${id}`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <SettingsLayout wide>
            <Head title="Experiences" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Moments Worth Remembering</h1>
                    <Button asChild><Link href="/admin/experiences/create">Add Experience</Link></Button>
                </div>

                {flash?.success && (
                    <div className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">{flash.success}</div>
                )}

                <div className="overflow-hidden rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">Image</th>
                                <th className="px-4 py-3 text-left font-medium">Name</th>
                                <th className="px-4 py-3 text-left font-medium">Status</th>
                                <th className="px-4 py-3 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {experiences.length === 0 && (
                                <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No experiences yet.</td></tr>
                            )}
                            {experiences.map((e) => (
                                <tr key={e.id} className="hover:bg-muted/30">
                                    <td className="px-4 py-3">
                                        {e.image_url
                                            ? <img src={e.image_url} alt={e.name} className="h-12 w-16 rounded-md object-cover" />
                                            : <div className="h-12 w-16 rounded-md bg-gray-100" />}
                                    </td>
                                    <td className="px-4 py-3 font-medium">{e.name}</td>
                                    <td className="px-4 py-3">
                                        <Badge variant={e.active ? 'default' : 'secondary'}>
                                            {e.active ? 'Active' : 'Hidden'}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/admin/experiences/${e.id}/edit`}>Edit</Link>
                                            </Button>
                                            <Button variant="destructive" size="sm" onClick={() => destroy(e.id, e.name)}>
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
