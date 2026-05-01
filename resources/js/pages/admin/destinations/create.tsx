import { ImageUpload } from '@/components/image-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Destinations', href: '/admin/destinations' },
    { title: 'Add', href: '#' },
];

export default function DestinationsCreate() {
    const { data, setData, post, processing, errors } = useForm<{
        name: string; country: string; price: string; image: File | null; active: boolean;
    }>({ name: '', country: '', price: '', image: null, active: true });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/admin/destinations', { forceFormData: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <SettingsLayout wide>
            <Head title="Add Destination" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Add Destination</h1>
                    <Button variant="outline" asChild><Link href="/admin/destinations">Back</Link></Button>
                </div>

                <form onSubmit={submit} className="max-w-lg space-y-5">
                    <div className="space-y-1">
                        <Label>Destination Name <span className="text-muted-foreground text-xs">(optional)</span></Label>
                        <Input placeholder="e.g. Dubai" value={data.name} onChange={e => setData('name', e.target.value)} />
                        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                    </div>

                    <div className="space-y-1">
                        <Label>Country <span className="text-muted-foreground text-xs">(optional)</span></Label>
                        <Input placeholder="e.g. UAE" value={data.country} onChange={e => setData('country', e.target.value)} />
                        {errors.country && <p className="text-xs text-destructive">{errors.country}</p>}
                    </div>

                    <div className="space-y-1">
                        <Label>Price <span className="text-muted-foreground text-xs">(optional)</span></Label>
                        <Input placeholder="e.g. PKR 85,000" value={data.price} onChange={e => setData('price', e.target.value)} />
                        {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
                    </div>

                    <div className="space-y-1">
                        <Label>Image <span className="text-muted-foreground text-xs">(optional)</span></Label>
                        <ImageUpload onChange={file => setData('image', file)} error={errors.image} />
                    </div>

                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="active" checked={data.active} onChange={e => setData('active', e.target.checked)} className="rounded" />
                        <Label htmlFor="active">Show on website</Label>
                    </div>

                    <Button type="submit" disabled={processing} className="bg-teal-600 hover:bg-teal-700">
                        Save Destination
                    </Button>
                </form>
            </div>
            </SettingsLayout>
        </AppLayout>
    );
}
