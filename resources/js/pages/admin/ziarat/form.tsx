import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

interface Ziarat { id: number; name: string; amount: string | null; }

export default function ZiaratForm({ ziarat }: { ziarat?: Ziarat }) {
    const isEdit = !!ziarat;
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Ziarat', href: '/admin/ziarat' },
        { title: isEdit ? 'Edit' : 'Add', href: '#' },
    ];
    const { data, setData, post, put, processing, errors } = useForm({
        name: ziarat?.name ?? '',
        amount: ziarat?.amount ?? '',
    });
    function submit(e: React.FormEvent) {
        e.preventDefault();
        isEdit ? put(`/admin/ziarat/${ziarat!.id}`) : post('/admin/ziarat');
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Edit Ziarat' : 'Add Ziarat'} />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">{isEdit ? 'Edit Ziarat' : 'Add Ziarat'}</h1>
                    <Button variant="outline" asChild><Link href="/admin/ziarat">Back</Link></Button>
                </div>
                <form onSubmit={submit} className="max-w-md space-y-4">
                    <div className="space-y-1">
                        <Label>Ziarat Name <span className="text-destructive">*</span></Label>
                        <Input value={data.name} onChange={e => setData('name', e.target.value)} maxLength={128} required />
                        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label>Amount <span className="text-destructive">*</span></Label>
                        <Input type="number" step="0.01" min="0" value={data.amount} onChange={e => setData('amount', e.target.value)} required />
                        {errors.amount && <p className="text-xs text-destructive">{errors.amount}</p>}
                    </div>
                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing} className="bg-teal-600 hover:bg-teal-700">{isEdit ? 'Update' : 'Save'}</Button>
                        <Button type="button" variant="destructive" asChild><Link href="/admin/ziarat">Cancel</Link></Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
