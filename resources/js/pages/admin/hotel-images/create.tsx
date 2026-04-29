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
    { title: 'Hotel Images', href: '/admin/hotel-images' },
    { title: 'Add', href: '#' },
];

export default function HotelImagesCreate() {
    const { data, setData, post, processing, errors } = useForm<{
        name: string; city_name: string; price: string; image: File | null; active: boolean;
    }>({ name: '', city_name: '', price: '', image: null, active: true });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/admin/hotel-images', { forceFormData: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <SettingsLayout wide>
            <Head title="Add Hotel Image" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Add Hotel Image</h1>
                    <Button variant="outline" asChild><Link href="/admin/hotel-images">Back</Link></Button>
                </div>

                <form onSubmit={submit} className="max-w-lg space-y-5">
                    <div className="space-y-1">
                        <Label>Hotel Name</Label>
                        <Input placeholder="e.g. Makkah Grand Hotel" value={data.name} onChange={e => setData('name', e.target.value)} />
                        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                    </div>

                    <div className="space-y-1">
                        <Label>City Name</Label>
                        <Input placeholder="e.g. Makkah" value={data.city_name} onChange={e => setData('city_name', e.target.value)} />
                        {errors.city_name && <p className="text-xs text-destructive">{errors.city_name}</p>}
                    </div>

                    <div className="space-y-1">
                        <Label>Price (PKR)</Label>
                        <Input type="number" min="0" placeholder="e.g. 150000" value={data.price} onChange={e => setData('price', e.target.value)} />
                        {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
                    </div>

                    <div className="space-y-1">
                        <Label>Image</Label>
                        <ImageUpload onChange={file => setData('image', file)} error={errors.image} />
                    </div>

                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="active" checked={data.active} onChange={e => setData('active', e.target.checked)} className="rounded" />
                        <Label htmlFor="active">Show on website</Label>
                    </div>

                    <Button type="submit" disabled={processing} className="bg-teal-600 hover:bg-teal-700">
                        Save Hotel Image
                    </Button>
                </form>
            </div>
            </SettingsLayout>
        </AppLayout>
    );
}
