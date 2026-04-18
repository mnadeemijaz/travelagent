import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface Row { id: number; name: string; [key: string]: unknown; }

interface Column {
    key: string;
    label: string;
    render?: (row: Row) => React.ReactNode;
}

interface Field {
    key: string;
    label: string;
    type?: string;
    options?: { value: string; label: string }[];
    placeholder?: string;
}

export default function LookupIndex({
    title,
    items,
    createUrl,
    deleteUrl,
    editUrlFn,
    columns,
    flash,
}: {
    title: string;
    items: Row[];
    createUrl: string;
    deleteUrl: string;
    editUrlFn: (id: number) => string;
    columns: Column[];
    flash?: { success?: string };
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: title, href: '#' },
    ];

    function destroy(id: number, name: string) {
        if (!confirm(`Delete "${name}"?`)) return;
        router.post(deleteUrl, { id }, { preserveScroll: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={title} />
            <div className="flex flex-col gap-5 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">{title}</h1>
                    <Button onClick={() => router.get(createUrl)}>+ Add New</Button>
                </div>

                {flash?.success && (
                    <div className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">{flash.success}</div>
                )}

                <div className="overflow-hidden rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium w-10">Sr#</th>
                                {columns.map(c => (
                                    <th key={c.key} className="px-4 py-3 text-left font-medium">{c.label}</th>
                                ))}
                                <th className="px-4 py-3 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {items.length === 0 && (
                                <tr><td colSpan={columns.length + 2} className="px-4 py-8 text-center text-muted-foreground">No records.</td></tr>
                            )}
                            {items.map((row, i) => (
                                <tr key={row.id} className="hover:bg-muted/30">
                                    <td className="px-4 py-2">{i + 1}</td>
                                    {columns.map(c => (
                                        <td key={c.key} className="px-4 py-2">
                                            {c.render ? c.render(row) : String(row[c.key] ?? '—')}
                                        </td>
                                    ))}
                                    <td className="px-4 py-2 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="outline" size="sm" onClick={() => router.get(editUrlFn(row.id))}>
                                                Edit
                                            </Button>
                                            <Button variant="destructive" size="sm" onClick={() => destroy(row.id, row.name)}>
                                                Delete
                                            </Button>
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
