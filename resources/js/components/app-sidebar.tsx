import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BadgeCheck, BarChart2, Building2, Car, FileText, LayoutGrid, MapPin, Plane, Receipt, ScrollText, Shield, Users, Wallet } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    { title: 'Dashboard',         url: '/dashboard',            icon: LayoutGrid },
    { title: 'User Management',   url: '/users',                icon: Users },
    { title: 'Client Management', url: '/admin/clients',        icon: BadgeCheck },
    { title: 'Vouchers',          url: '/admin/vouchers',       icon: ScrollText },
    { title: 'Transactions',      url: '/admin/transactions',   icon: Wallet },
    { title: 'Hotels',            url: '/admin/hotels',         icon: Building2 },
    { title: 'Flights',           url: '/admin/flights',        icon: Plane },
    { title: 'Sectors',           url: '/admin/sectors',        icon: MapPin },
    { title: 'Vehicles',          url: '/admin/vehicles',       icon: Car },
    { title: 'Trips',             url: '/admin/trips',          icon: FileText },
    { title: 'Ziarat',            url: '/admin/ziarat',         icon: MapPin },
    { title: 'Pkg Types',         url: '/admin/tour-packages',  icon: Receipt },
    { title: 'Visa Companies',    url: '/admin/visa-companies', icon: Shield },
];

const reportNavItems: NavItem[] = [
    { title: 'Pilgrim Report',    url: '/admin/reports/pilgrim',       icon: BarChart2 },
    { title: 'Arrival Report',    url: '/admin/reports/arrival',       icon: BarChart2 },
    { title: 'Departure Report',  url: '/admin/reports/departure',     icon: BarChart2 },
    { title: 'Visa Report',       url: '/admin/reports/visa',          icon: BarChart2 },
    { title: 'Agent-Wise Report', url: '/admin/reports/pilgrim-wise',  icon: BarChart2 },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} label="Platform" />
                <NavMain items={reportNavItems} label="Reports" />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
