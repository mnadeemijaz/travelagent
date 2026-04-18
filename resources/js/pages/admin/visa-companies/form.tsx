import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

interface VisaCompany { id: number; name: string; contact: string | null; }
export default function VisaCompanyForm({ visaCompany }: { visaCompany?: VisaCompany }) {
    const isEdit = !!visaCompany;
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Visa Companies', href: '/admin/visa-companies' },
        { title: isEdit ? 'Edit' : 'Add', href: '#' },
    ];
    const { data, setData, post, put, processing, errors } = useForm({ name: visaCompany?.name ?? '', contact: visaCompany?.contact ?? '' });
    function submit(e: React.FormEvent) {
        e.preventDefault();
        isEdit ? put(`/admin/visa-companies/${visaCompany!.id}`) : post('/admin/visa-companies');
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Edit Visa Company' : 'Add Visa Company'} />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">{isEdit ? 'Edit Visa Company' : 'Add Visa Company'}</h1>
                    <Button variant="outline" asChild><Link href="/admin/visa-companies">Back</Link></Button>
                </div>
                <form onSubmit={submit} className="max-w-md space-y-4">
                    <div className="space-y-1">
                        <Label>Company Name <span className="text-destructive">*</span></Label>
                        <Input value={data.name} onChange={e => setData('name', e.target.value)} required maxLength={128} />
                        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label>Contact</Label>
                        <Input value={data.contact} onChange={e => setData('contact', e.target.value)} maxLength={100} placeholder="Phone / email" />
                    </div>
                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing} className="bg-teal-600 hover:bg-teal-700">{isEdit ? 'Update' : 'Save'}</Button>
                        <Button type="button" variant="destructive" asChild><Link href="/admin/visa-companies">Cancel</Link></Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
