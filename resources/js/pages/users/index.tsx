import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

interface User {
    id: number;
    name: string;
    email: string;
    roles: string[];
    is_approved: boolean;
    created_at: string;
    company_name: string | null;
    address: string | null;
    mobile: string | null;
    logo_url: string | null;
}

interface Props {
    users: User[];
    flash?: { success?: string };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'User Management', href: '/users' },
];

export default function UsersIndex({ users, flash }: Props) {
    const pending = users.filter(u => !u.is_approved);

    function handleDelete(id: number, name: string) {
        if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
        router.delete(`/users/${id}`);
    }

    function handleApprove(id: number, name: string) {
        if (!confirm(`Approve "${name}"? They will be able to login.`)) return;
        router.post(`/users/${id}/approve`, {}, { preserveScroll: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Management" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-semibold">User Management</h1>
                        {pending.length > 0 && (
                            <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-bold text-orange-700">
                                {pending.length} pending
                            </span>
                        )}
                    </div>
                    <Button asChild>
                        <Link href="/users/create">Add User</Link>
                    </Button>
                </div>

                {flash?.success && (
                    <div className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">
                        {flash.success}
                    </div>
                )}

                {/* Pending approvals banner */}
                {pending.length > 0 && (
                    <div className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-800">
                        <strong>{pending.length} user{pending.length > 1 ? 's' : ''} waiting for approval.</strong>
                        {' '}Review and approve them below.
                    </div>
                )}

                <div className="overflow-hidden rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">Logo</th>
                                <th className="px-4 py-3 text-left font-medium">Name</th>
                                <th className="px-4 py-3 text-left font-medium">Email</th>
                                <th className="px-4 py-3 text-left font-medium">Company</th>
                                <th className="px-4 py-3 text-left font-medium">Mobile</th>
                                <th className="px-4 py-3 text-left font-medium">Address</th>
                                <th className="px-4 py-3 text-left font-medium">Role</th>
                                <th className="px-4 py-3 text-center font-medium">Status</th>
                                <th className="px-4 py-3 text-left font-medium">Registered</th>
                                <th className="px-4 py-3 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={10} className="px-4 py-8 text-center text-muted-foreground">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                            {users.map((user) => (
                                <tr key={user.id}
                                    className={`hover:bg-muted/30 ${!user.is_approved ? 'bg-orange-50/60' : ''}`}>
                                    <td className="px-4 py-3">
                                        {user.logo_url ? (
                                            <img src={user.logo_url} alt="logo" className="h-8 w-8 rounded object-contain border" />
                                        ) : (
                                            <span className="text-muted-foreground">—</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 font-medium">{user.name}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{user.company_name ?? '—'}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{user.mobile ?? '—'}</td>
                                    <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate" title={user.address ?? ''}>{user.address ?? '—'}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-wrap gap-1">
                                            {user.roles.length > 0 ? (
                                                user.roles.map((role) => (
                                                    <Badge key={role} variant="secondary" className="capitalize">
                                                        {role}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <span className="text-muted-foreground">—</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        {user.is_approved ? (
                                            <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                                                Approved
                                            </span>
                                        ) : (
                                            <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-700">
                                                Pending
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">{user.created_at}</td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {!user.is_approved && (
                                                <Button
                                                    size="sm"
                                                    className="bg-green-600 hover:bg-green-700 h-7 px-3 text-xs"
                                                    onClick={() => handleApprove(user.id, user.name)}
                                                >
                                                    Approve
                                                </Button>
                                            )}
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/users/${user.id}/edit`}>Edit</Link>
                                            </Button>
                                            {!user.roles.includes('admin') && (
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDelete(user.id, user.name)}
                                                >
                                                    Delete
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
