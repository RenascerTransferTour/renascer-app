'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MessageCircle,
  GanttChartSquare,
  Bookmark,
  Calendar,
  FileText,
  BookOpen,
  Settings,
  LifeBuoy,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { NavItem } from '@/lib/types';
import { Logo } from '../icons';

const navItems: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/inbox', label: 'Inbox', icon: MessageCircle, badge: 3 },
  { href: '/pipeline', label: 'Pipeline (CRM)', icon: GanttChartSquare },
  { href: '/bookings', label: 'Agendamentos', icon: Bookmark },
  { href: '/calendar', label: 'Calendário', icon: Calendar },
  { href: '/quotes', label: 'Orçamentos', icon: FileText, badge: 5 },
  { href: '/kb', label: 'Conhecimento', icon: BookOpen },
];

const bottomNavItems: NavItem[] = [
  { href: '/settings', label: 'Configurações', icon: Settings },
  { href: '/support', label: 'Ajuda', icon: LifeBuoy },
];

export function AppSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const NavLink = ({ item }: { item: NavItem }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={item.href}
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
            isActive(item.href) && 'bg-accent text-accent-foreground'
          )}
        >
          <item.icon className="h-5 w-5" />
          <span className="sr-only">{item.label}</span>
          {item.badge && (
            <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {item.badge}
            </span>
          )}
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>
  );

  return (
    <TooltipProvider>
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="#"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Logo className="h-5 w-5 transition-all group-hover:scale-110 text-white" />
            <span className="sr-only">Renascer Tour</span>
          </Link>
          {navItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          {bottomNavItems.map((item) => (
             <NavLink key={item.href} item={item} />
          ))}
        </nav>
      </aside>
    </TooltipProvider>
  );
}
