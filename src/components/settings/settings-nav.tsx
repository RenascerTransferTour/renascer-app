'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
    { href: '/settings/profile', label: 'Empresa' },
    { href: '/settings/users', label: 'Usuários' },
    { href: '/settings/channels', label: 'Canais' },
    { href: '/settings/ai', label: 'IA Magnus' },
    { href: '/settings/appearance', label: 'Aparência' },
    { href: '/settings/billing', label: 'Plano e Assinatura' },
    { href: '/settings/integrations', label: 'Integrações' },
]

export function SettingsNav() {
  const pathname = usePathname();
  return (
    <nav className="grid gap-4 text-sm text-muted-foreground">
      {navItems.map(item => (
        <Link 
            key={item.href} 
            href={item.href}
            className={cn(
                'font-semibold',
                pathname === item.href ? 'text-primary' : ''
            )}
        >
            {item.label}
        </Link>
      ))}
    </nav>
  );
}
