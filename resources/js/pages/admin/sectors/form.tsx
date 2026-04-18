import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

interface Sector { id: number; name: string; }
export default function SectorForm({ sector }: { sector?: Sector }) {
    const isEdit = !!sector;
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Sectors', href: '/admin/sectors' },
        { title: isEdit ? 'Edit' : 'Add', href: '#' },
    ];
    const { data, setData, post, put, processing, errors } = useForm({ name: sector?.name ?? '' });
    function submit(e: React.FormEvent) {
        e.preventDefault();
        isEdit ? put(`/admin/sectors/${sector!.id}`) : post('/admin/sectors');
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Edit Sector' : 'Add Sector'} />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">{isEdit ? 'Edit Sector' : 'Add Sector'}</h1>
                    <Button variant="outline" asChild><Link href="/admin/sectors">Back</Link></Button>
                </div>
                <form onSubmit={submit} className="max-w-md space-y-4">
                    <div className="space-y-1">
                        <Label>Sector Name <span className="text-destructive">*</span></Label>
                        <Input value={data.name} onChange={e => setData('name', e.target.value)} required maxLength={128} placeholder="e.g. LHE - JED" />
                        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                    </div>
                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing} className="bg-teal-600 hover:bg-teal-700">{isEdit ? 'Update' : 'Save'}</Button>
                        <Button type="button" variant="destructive" asChild><Link href="/admin/sectors">Cancel</Link></Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
