import { ImageUpload } from '@/components/image-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

interface ExpProp { id: number; name: string; image_url: string; active: boolean; }

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Experiences', href: '/admin/experiences' },
    { title: 'Edit', href: '#' },
];

export default function ExperiencesEdit({ experience }: { experience: ExpProp }) {
    const { data, setData, post, processing, errors } = useForm<{
        name: string; image: File | null; active: boolean; _method: string;
    }>({ name: experience.name, image: null, active: experience.active, _method: 'PUT' });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(`/admin/experiences/${experience.id}`, { forceFormData: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <SettingsLayout wide>
            <Head title="Edit Experience" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Edit Experience</h1>
                    <Button variant="outline" asChild><Link href="/admin/experiences">Back</Link></Button>
                </div>

                <form onSubmit={submit} className="max-w-lg space-y-5">
                    <div className="space-y-1">
                        <Label>Experience Name <span className="text-muted-foreground text-xs">(optional)</span></Label>
                        <Input value={data.name} onChange={e => setData('name', e.target.value)} />
                        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                    </div>

                    <div className="space-y-1">
                        <Label>Image <span className="text-muted-foreground text-xs">(leave empty to keep current)</span></Label>
                        <ImageUpload currentUrl={experience.image_url} onChange={file => setData('image', file)} error={errors.image} />
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
            </SettingsLayout>
        </AppLayout>
    );
}
