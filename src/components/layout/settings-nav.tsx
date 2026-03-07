'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Paintbrush, Sparkles, Share2 } from 'lucide-react';

const navItems = [
  { href: '/settings/ai', label: 'Controle da IA', icon: Sparkles },
  { href: '/settings/channels', label: 'Canais e Conexões', icon: Share2 },
  { href: '/settings/appearance', label: 'Aparência e Marca', icon: Paintbrush },
];

export function SettingsNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-2 border-b pb-2 overflow-x-auto">
      {navItems.map((item) => (
        <Button
          key={item.href}
          variant={pathname === item.href ? 'secondary' : 'ghost'}
          asChild
          className="gap-2"
        >
          <Link href={item.href}>
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        </Button>
      ))}
    </nav>
  );
}
