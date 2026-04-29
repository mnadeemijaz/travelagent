import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

interface HotelImg { id: number; name: string; city_name: string; price: number; image_url: string; active: boolean; }

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Hotel Images', href: '/admin/hotel-images' },
];

export default function HotelImagesIndex({ hotelImages, flash }: { hotelImages: HotelImg[]; flash?: { success?: string } }) {
    function destroy(id: number, name: string) {
        if (!confirm(`Delete "${name}"?`)) return;
        router.delete(`/admin/hotel-images/${id}`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <SettingsLayout wide>
            <Head title="Hotel Images" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Hotel Images</h1>
                    <Button asChild><Link href="/admin/hotel-images/create">Add Hotel Image</Link></Button>
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
                                <th className="px-4 py-3 text-left font-medium">City</th>
                                <th className="px-4 py-3 text-left font-medium">Price</th>
                                <th className="px-4 py-3 text-left font-medium">Status</th>
                                <th className="px-4 py-3 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {hotelImages.length === 0 && (
                                <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No hotel images yet.</td></tr>
                            )}
                            {hotelImages.map((h) => (
                                <tr key={h.id} className="hover:bg-muted/30">
                                    <td className="px-4 py-3">
                                        {h.image_url
                                            ? <img src={h.image_url} alt={h.name} className="h-12 w-16 rounded-md object-cover" />
                                            : <div className="h-12 w-16 rounded-md bg-gray-100" />}
                                    </td>
                                    <td className="px-4 py-3 font-medium">{h.name}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{h.city_name}</td>
                                    <td className="px-4 py-3">PKR {Number(h.price).toLocaleString()}</td>
                                    <td className="px-4 py-3">
                                        <Badge variant={h.active ? 'default' : 'secondary'}>
                                            {h.active ? 'Active' : 'Hidden'}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/admin/hotel-images/${h.id}/edit`}>Edit</Link>
                                            </Button>
                                            <Button variant="destructive" size="sm" onClick={() => destroy(h.id, h.name)}>
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
