'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Calendar,
  Briefcase,
  Settings,
  HelpCircle,
  GanttChartSquare,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const navItems = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/inbox', icon: MessageSquare, label: 'Caixa de Entrada' },
  { href: '/quotes', icon: FileText, label: 'Orçamentos' },
  { href: '/bookings', icon: Briefcase, label: 'Reservas' },
  { href: '/calendar', icon: Calendar, label: 'Calendário' },
  { href: '/pipeline', icon: GanttChartSquare, label: 'Pipeline de Vendas' },
  { href: '/kb', icon: HelpCircle, label: 'Base de Conhecimento' },
];

const settingsNav = {
  href: '/settings',
  icon: Settings,
  label: 'Configurações',
};

export function AppSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader className="h-14 items-center justify-center p-2 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:justify-center">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="size-6 text-sidebar-foreground" />
          <span className="text-lg font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            Renascer
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="flex-1 p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.href)}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive(settingsNav.href)}
              tooltip={settingsNav.label}
            >
              <Link href={settingsNav.href}>
                <settingsNav.icon />
                <span>{settingsNav.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
             <SidebarMenuButton asChild size="lg" tooltip="Meu Perfil">
                <Link href="#">
                    <Avatar className="size-8 group-data-[collapsible=icon]:size-6">
                        <AvatarImage src="https://picsum.photos/seed/99/100/100" alt="Admin" data-ai-hint="person avatar"/>
                        <AvatarFallback>A</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">Admin</span>
                        <span className="text-xs text-sidebar-foreground/70">admin@renascer.ai</span>
                    </div>
                </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
