import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

interface Hotel { id: number; name: string; city_name: string | null; room_type: string | null; pkg_type: string | null; }
interface TourPkg { id: number; name: string; }
const ROOM_TYPES = ['sharing','single_bed','double_bed','triple_bed','quad_bed','five_bed','six_bed'];

export default function HotelForm({ hotel, packages }: { hotel?: Hotel; packages?: TourPkg[] }) {
    const isEdit = !!hotel;
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Hotels', href: '/admin/hotels' },
        { title: isEdit ? 'Edit' : 'Add', href: '#' },
    ];
    const { data, setData, post, put, processing, errors } = useForm({
        name: hotel?.name ?? '',
        city_name: hotel?.city_name ?? '',
        room_type: hotel?.room_type ?? 'sharing',
        pkg_type: hotel?.pkg_type ?? '',
    });
    function submit(e: React.FormEvent) {
        e.preventDefault();
        isEdit ? put(`/admin/hotels/${hotel!.id}`) : post('/admin/hotels');
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Edit Hotel' : 'Add Hotel'} />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">{isEdit ? 'Edit Hotel' : 'Add Hotel'}</h1>
                    <Button variant="outline" asChild><Link href="/admin/hotels">Back</Link></Button>
                </div>
                <form onSubmit={submit} className="max-w-lg space-y-4">
                    <div className="space-y-1">
                        <Label>Hotel Name <span className="text-destructive">*</span></Label>
                        <Input value={data.name} onChange={e => setData('name', e.target.value)} maxLength={128} required />
                        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label>City <span className="text-destructive">*</span></Label>
                            <select value={data.city_name} onChange={e => setData('city_name', e.target.value)}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
                                <option value="">Select City</option>
                                <option value="Makkah">Makkah</option>
                                <option value="Madina">Madina</option>
                            </select>
                            {errors.city_name && <p className="text-xs text-destructive">{errors.city_name}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label>Room Type <span className="text-destructive">*</span></Label>
                            <select value={data.room_type} onChange={e => setData('room_type', e.target.value)}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
                                {ROOM_TYPES.map(rt => <option key={rt} value={rt}>{rt.replace('_', ' ')}</option>)}
                            </select>
                        </div>
                    </div>
                    {packages && packages.length > 0 && (
                        <div className="space-y-1">
                            <Label>Package</Label>
                            <select value={data.pkg_type} onChange={e => setData('pkg_type', e.target.value)}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                <option value="">All Packages</option>
                                {packages.map(p => <option key={p.id} value={String(p.id)}>{p.name}</option>)}
                            </select>
                        </div>
                    )}
                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing} className="bg-teal-600 hover:bg-teal-700">{isEdit ? 'Update Hotel' : 'Save Hotel'}</Button>
                        <Button type="button" variant="destructive" asChild><Link href="/admin/hotels">Cancel</Link></Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
