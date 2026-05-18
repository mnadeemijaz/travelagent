import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, LayoutGrid } from 'lucide-react';

export default function AppSidebarLayout({ children, breadcrumbs = [] }: { children: React.ReactNode; breadcrumbs?: BreadcrumbItem[] }) {
    const { auth } = usePage<SharedData>().props;
    const isAgent = auth.roles?.includes('agent');

    if (isAgent) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                {/* Minimal agent top bar */}
                <header className="bg-white border-b shadow-sm px-6 py-3 flex items-center justify-between sticky top-0 z-50">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <div className="flex aspect-square size-8 items-center justify-center rounded-md overflow-hidden bg-white border">
                                <img src="/storage/icon.png" alt="Al Abrar Travels" className="size-7 object-contain" />
                            </div>
                            <span className="font-bold text-gray-800 hidden sm:block">Al Abrar Group of Travels</span>
                        </Link>
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-md px-3 py-1.5 hover:bg-gray-100 transition-colors"
                        >
                            <LayoutGrid className="size-4" />
                            <span>Dashboard</span>
                        </Link>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-gray-100 transition-colors outline-none">
                            <UserInfo user={auth.user} />
                            <ChevronDown className="size-4 text-gray-500 shrink-0" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <UserMenuContent user={auth.user} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>
                <main className="flex-1">
                    {children}
                </main>
            </div>
        );
    }

    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}
