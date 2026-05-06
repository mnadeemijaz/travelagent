import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

interface Props {
    roles: string[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'User Management', href: '/users' },
    { title: 'Add User', href: '/users/create' },
];

export default function UsersCreate({ roles }: Props) {
    const { data, setData, post, processing, errors } = useForm<{
        name: string; email: string; password: string; role: string;
        company_name: string; address: string; mobile: string;
        company_logo: File | null;
    }>({
        name: '',
        email: '',
        password: '',
        role: '',
        company_name: '',
        address: '',
        mobile: '',
        company_logo: null,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/users');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add User" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Add User</h1>
                    <Button variant="outline" asChild>
                        <Link href="/users">Back</Link>
                    </Button>
                </div>

                <form onSubmit={submit} className="max-w-lg space-y-5">
                    <div className="space-y-1">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Full name"
                        />
                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="email@example.com"
                        />
                        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="company_logo">Company Logo</Label>
                        <Input
                            id="company_logo"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData('company_logo', e.target.files?.[0] ?? null)}
                        />
                        {errors.company_logo && <p className="text-sm text-destructive">{errors.company_logo}</p>}
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="company_name">Company Name</Label>
                        <Input
                            id="company_name"
                            value={data.company_name}
                            onChange={(e) => setData('company_name', e.target.value)}
                            placeholder="Company or agency name"
                        />
                        {errors.company_name && <p className="text-sm text-destructive">{errors.company_name}</p>}
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="mobile">Mobile</Label>
                        <Input
                            id="mobile"
                            value={data.mobile}
                            onChange={(e) => setData('mobile', e.target.value)}
                            placeholder="+92 300 0000000"
                        />
                        {errors.mobile && <p className="text-sm text-destructive">{errors.mobile}</p>}
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="address">Address</Label>
                        <Input
                            id="address"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            placeholder="Office / home address"
                        />
                        {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="role">Role</Label>
                        <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                            <SelectTrigger id="role">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((role) => (
                                    <SelectItem key={role} value={role} className="capitalize">
                                        {role}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.role && <p className="text-sm text-destructive">{errors.role}</p>}
                    </div>

                    <Button type="submit" disabled={processing}>
                        Create User
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
