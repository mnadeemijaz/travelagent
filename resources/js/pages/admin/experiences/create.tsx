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
    { title: 'Experiences', href: '/admin/experiences' },
    { title: 'Add', href: '#' },
];

export default function ExperiencesCreate() {
    const { data, setData, post, processing, errors } = useForm<{
        name: string; image: File | null; active: boolean;
    }>({ name: '', image: null, active: true });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/admin/experiences', { forceFormData: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <SettingsLayout wide>
            <Head title="Add Experience" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Add Experience</h1>
                    <Button variant="outline" asChild><Link href="/admin/experiences">Back</Link></Button>
                </div>

                <form onSubmit={submit} className="max-w-lg space-y-5">
                    <div className="space-y-1">
                        <Label>Experience Name <span className="text-muted-foreground text-xs">(optional)</span></Label>
                        <Input placeholder="e.g. Mountain Treks" value={data.name} onChange={e => setData('name', e.target.value)} />
                        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                    </div>

                    <div className="space-y-1">
                        <Label>Image <span className="text-muted-foreground text-xs">(optional)</span></Label>
                        <ImageUpload onChange={file => setData('image', file)} error={errors.image} />
                    </div>

                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="active" checked={data.active} onChange={e => setData('active', e.target.checked)} className="rounded" />
                        <Label htmlFor="active">Show on website</Label>
                    </div>

                    <Button type="submit" disabled={processing} className="bg-teal-600 hover:bg-teal-700">
                        Save Experience
                    </Button>
                </form>
            </div>
            </SettingsLayout>
        </AppLayout>
    );
}
