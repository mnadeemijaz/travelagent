import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

interface Vehicle { id: number; name: string; sharing: number; }

export default function VehicleForm({ vehicle }: { vehicle?: Vehicle }) {
    const isEdit = !!vehicle;
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Vehicles', href: '/admin/vehicles' },
        { title: isEdit ? 'Edit' : 'Add', href: '#' },
    ];
    const { data, setData, post, put, processing, errors } = useForm({
        name: vehicle?.name ?? '',
        sharing: String(vehicle?.sharing ?? '1'),
    });
    function submit(e: React.FormEvent) {
        e.preventDefault();
        isEdit ? put(`/admin/vehicles/${vehicle!.id}`) : post('/admin/vehicles');
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Edit Vehicle' : 'Add Vehicle'} />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">{isEdit ? 'Edit Vehicle' : 'Add Vehicle'}</h1>
                    <Button variant="outline" asChild><Link href="/admin/vehicles">Back</Link></Button>
                </div>
                <form onSubmit={submit} className="max-w-md space-y-4">
                    <div className="space-y-1">
                        <Label>Vehicle Name <span className="text-destructive">*</span></Label>
                        <Input value={data.name} onChange={e => setData('name', e.target.value)} maxLength={128} required />
                        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label>Sharing Capacity</Label>
                        <Input type="number" min={1} value={data.sharing} onChange={e => setData('sharing', e.target.value)} />
                    </div>
                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing} className="bg-teal-600 hover:bg-teal-700">{isEdit ? 'Update' : 'Save'}</Button>
                        <Button type="button" variant="destructive" asChild><Link href="/admin/vehicles">Cancel</Link></Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
