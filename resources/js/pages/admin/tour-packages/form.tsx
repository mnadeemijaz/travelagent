import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

interface TourPkg { id: number; name: string; }
export default function TourPackageForm({ tourPackage }: { tourPackage?: TourPkg }) {
    const isEdit = !!tourPackage;
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Tour Packages', href: '/admin/tour-packages' },
        { title: isEdit ? 'Edit' : 'Add', href: '#' },
    ];
    const { data, setData, post, put, processing, errors } = useForm({ name: tourPackage?.name ?? '' });
    function submit(e: React.FormEvent) {
        e.preventDefault();
        isEdit ? put(`/admin/tour-packages/${tourPackage!.id}`) : post('/admin/tour-packages');
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Edit Tour Package' : 'Add Tour Package'} />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">{isEdit ? 'Edit Tour Package' : 'Add Tour Package'}</h1>
                    <Button variant="outline" asChild><Link href="/admin/tour-packages">Back</Link></Button>
                </div>
                <form onSubmit={submit} className="max-w-md space-y-4">
                    <div className="space-y-1">
                        <Label>Package Name <span className="text-destructive">*</span></Label>
                        <Input value={data.name} onChange={e => setData('name', e.target.value)} required maxLength={128} placeholder="e.g. Economy 15 Days" />
                        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                    </div>
                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing} className="bg-teal-600 hover:bg-teal-700">{isEdit ? 'Update' : 'Save'}</Button>
                        <Button type="button" variant="destructive" asChild><Link href="/admin/tour-packages">Cancel</Link></Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
