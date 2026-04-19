import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

interface Bank { id: number; name: string; }

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Banks', href: '/admin/banks' },
    { title: 'Edit', href: '#' },
];

export default function BanksEdit({ bank }: { bank: Bank }) {
    const { data, setData, put, processing, errors } = useForm({ name: bank.name });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        put(`/admin/banks/${bank.id}`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Bank" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Edit Bank</h1>
                    <Button variant="outline" asChild><Link href="/admin/banks">Back</Link></Button>
                </div>

                <form onSubmit={submit} className="max-w-sm space-y-5">
                    <div className="space-y-1">
                        <Label>Bank Name <span className="text-destructive">*</span></Label>
                        <Input
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            autoFocus
                        />
                        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                    </div>

                    <Button type="submit" disabled={processing} className="bg-teal-600 hover:bg-teal-700">
                        Save Changes
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
