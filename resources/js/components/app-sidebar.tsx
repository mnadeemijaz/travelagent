import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BadgeCheck, BarChart2, Building2, Car, FileText, Hotel, Landmark, LayoutGrid, MapPin, Plane, Receipt, ScrollText, Shield, Ticket, Users, Wallet, ArrowLeftRight } from 'lucide-react';
import AppLogo from './app-logo';

const allMainNavItems: NavItem[] = [
    { title: 'Dashboard',         url: '/dashboard',            icon: LayoutGrid },
    { title: 'User Management',   url: '/users',                icon: Users },
    { title: 'Client Management', url: '/admin/clients',        icon: BadgeCheck },
    { title: 'Vouchers',          url: '/admin/vouchers',       icon: ScrollText },
    { title: 'Ticket Sales',      url: '/admin/ticket-sales',   icon: Ticket },
    { title: 'Transactions',      url: '/admin/transactions',   icon: Wallet },
    { title: 'Hotels',            url: '/admin/hotels',         icon: Building2 },
    { title: 'Flights',           url: '/admin/flights',        icon: Plane },
    { title: 'Sectors',           url: '/admin/sectors',        icon: MapPin },
    { title: 'Vehicles',          url: '/admin/vehicles',       icon: Car },
    { title: 'Trips',             url: '/admin/trips',          icon: FileText },
    { title: 'Ziarat',            url: '/admin/ziarat',         icon: MapPin },
    { title: 'Pkg Types',         url: '/admin/tour-packages',  icon: Receipt },
    { title: 'Visa Companies',    url: '/admin/visa-companies', icon: Shield },
    { title: 'Agent Hotels',      url: '/admin/agent-hotels',   icon: Hotel },
    { title: 'Banks',                url: '/admin/banks',                icon: Landmark },
    // { title: 'Flight Transactions',  url: '/admin/flight-transections',  icon: ArrowLeftRight },
    { title: 'Bank Transactions',    url: '/admin/bank-transections',      icon: ArrowLeftRight },
    { title: 'Group Tickets',        url: '/admin/group-tickets',          icon: Ticket },
    { title: 'Group Bookings',       url: '/admin/group-ticket-bookings',  icon: Ticket },
    { title: 'Bank Details',         url: '/admin/bank-details',           icon: Landmark },
];

const agentNavItems: NavItem[] = [
    { title: 'Client Management', url: '/admin/clients',             icon: BadgeCheck },
    { title: 'Vouchers',          url: '/admin/vouchers',            icon: ScrollText },
    { title: 'Group Bookings',    url: '/admin/group-ticket-bookings', icon: Ticket },
];

const reportNavItems: NavItem[] = [
    { title: 'Pilgrim Report',    url: '/admin/reports/pilgrim',       icon: BarChart2 },
    { title: 'Arrival Report',    url: '/admin/reports/arrival',       icon: BarChart2 },
    { title: 'Departure Report',  url: '/admin/reports/departure',     icon: BarChart2 },
    { title: 'Visa Report',       url: '/admin/reports/visa',          icon: BarChart2 },
    { title: 'Agent-Wise Report', url: '/admin/reports/pilgrim-wise',  icon: BarChart2 },
    { title: 'Agent Balance',     url: '/admin/reports/agent-balance', icon: BarChart2 },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const isAgent = auth.roles?.includes('agent');

    const mainNavItems = isAgent ? agentNavItems : allMainNavItems;

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
                {!isAgent && <NavMain items={reportNavItems} label="Reports" />}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
