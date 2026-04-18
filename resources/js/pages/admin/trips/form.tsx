import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

interface Vehicle { id: number; name: string; }
interface Trip { id: number; name: string; vehicle_id: number | null; price: string | null; }

export default function TripForm({ trip, vehicles }: { trip?: Trip; vehicles: Vehicle[] }) {
    const isEdit = !!trip;
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Trips', href: '/admin/trips' },
        { title: isEdit ? 'Edit' : 'Add', href: '#' },
    ];
    const { data, setData, post, put, processing, errors } = useForm({
        name: trip?.name ?? '',
        vehicle_id: trip?.vehicle_id ? String(trip.vehicle_id) : '',
        price: trip?.price ?? '',
    });
    function submit(e: React.FormEvent) {
        e.preventDefault();
        isEdit ? put(`/admin/trips/${trip!.id}`) : post('/admin/trips');
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Edit Trip' : 'Add Trip'} />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">{isEdit ? 'Edit Trip' : 'Add Trip'}</h1>
                    <Button variant="outline" asChild><Link href="/admin/trips">Back</Link></Button>
                </div>
                <form onSubmit={submit} className="max-w-lg space-y-4">
                    <div className="space-y-1">
                        <Label>Trip Name</Label>
                        <Input value={data.name} onChange={e => setData('name', e.target.value)} maxLength={128} />
                        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label>Vehicle <span className="text-destructive">*</span></Label>
                        <select value={data.vehicle_id} onChange={e => setData('vehicle_id', e.target.value)}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
                            <option value="">— Select Vehicle —</option>
                            {vehicles.map(v => <option key={v.id} value={String(v.id)}>{v.name}</option>)}
                        </select>
                        {errors.vehicle_id && <p className="text-xs text-destructive">{errors.vehicle_id}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label>Price <span className="text-destructive">*</span></Label>
                        <Input type="number" step="0.01" min="0" value={data.price} onChange={e => setData('price', e.target.value)} required />
                        {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
                    </div>
                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing} className="bg-teal-600 hover:bg-teal-700">{isEdit ? 'Update' : 'Save'}</Button>
                        <Button type="button" variant="destructive" asChild><Link href="/admin/trips">Cancel</Link></Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
