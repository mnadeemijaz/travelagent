import { ImageUpload } from '@/components/image-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

interface HotelImgProp { id: number; name: string; city_name: string; price: number; image_url: string; active: boolean; }

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Hotel Images', href: '/admin/hotel-images' },
    { title: 'Edit', href: '#' },
];

export default function HotelImagesEdit({ hotelImage }: { hotelImage: HotelImgProp }) {
    const { data, setData, post, processing, errors } = useForm<{
        name: string; city_name: string; price: string; image: File | null; active: boolean; _method: string;
    }>({
        name: hotelImage.name,
        city_name: hotelImage.city_name,
        price: String(hotelImage.price),
        image: null,
        active: hotelImage.active,
        _method: 'PUT',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(`/admin/hotel-images/${hotelImage.id}`, { forceFormData: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Hotel Image" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Edit Hotel Image</h1>
                    <Button variant="outline" asChild><Link href="/admin/hotel-images">Back</Link></Button>
                </div>

                <form onSubmit={submit} className="max-w-lg space-y-5">
                    <div className="space-y-1">
                        <Label>Hotel Name</Label>
                        <Input value={data.name} onChange={e => setData('name', e.target.value)} />
                        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                    </div>

                    <div className="space-y-1">
                        <Label>City Name</Label>
                        <Input value={data.city_name} onChange={e => setData('city_name', e.target.value)} />
                        {errors.city_name && <p className="text-xs text-destructive">{errors.city_name}</p>}
                    </div>

                    <div className="space-y-1">
                        <Label>Price (PKR)</Label>
                        <Input type="number" min="0" value={data.price} onChange={e => setData('price', e.target.value)} />
                        {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
                    </div>

                    <div className="space-y-1">
                        <Label>Image <span className="text-muted-foreground text-xs">(leave empty to keep current)</span></Label>
                        <ImageUpload currentUrl={hotelImage.image_url} onChange={file => setData('image', file)} error={errors.image} />
                    </div>

                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="active" checked={data.active} onChange={e => setData('active', e.target.checked)} className="rounded" />
                        <Label htmlFor="active">Show on website</Label>
                    </div>

                    <Button type="submit" disabled={processing} className="bg-teal-600 hover:bg-teal-700">
                        Save Changes
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
