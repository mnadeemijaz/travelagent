import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

interface Flight { id: number; name: string; bsp: string | null; }
export default function FlightForm({ flight }: { flight?: Flight }) {
    const isEdit = !!flight;
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Flights', href: '/admin/flights' },
        { title: isEdit ? 'Edit' : 'Add', href: '#' },
    ];
    const { data, setData, post, put, processing, errors } = useForm({ name: flight?.name ?? '', bsp: flight?.bsp ?? '' });
    function submit(e: React.FormEvent) {
        e.preventDefault();
        isEdit ? put(`/admin/flights/${flight!.id}`) : post('/admin/flights');
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Edit Flight' : 'Add Flight'} />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">{isEdit ? 'Edit Flight' : 'Add Flight'}</h1>
                    <Button variant="outline" asChild><Link href="/admin/flights">Back</Link></Button>
                </div>
                <form onSubmit={submit} className="max-w-md space-y-4">
                    <div className="space-y-1">
                        <Label>Flight Name <span className="text-destructive">*</span></Label>
                        <Input value={data.name} onChange={e => setData('name', e.target.value)} required maxLength={128} />
                        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label>BSP Code</Label>
                        <Input value={data.bsp} onChange={e => setData('bsp', e.target.value)} maxLength={50} placeholder="e.g. PK" />
                    </div>
                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing} className="bg-teal-600 hover:bg-teal-700">{isEdit ? 'Update' : 'Save'}</Button>
                        <Button type="button" variant="destructive" asChild><Link href="/admin/flights">Cancel</Link></Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
