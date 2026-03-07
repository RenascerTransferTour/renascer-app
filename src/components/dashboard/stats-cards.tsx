'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Users,
  MessageCircle,
  FileText,
  Bookmark,
  DollarSign,
  Bot,
  UserCheck,
  Lock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';


interface StatsData {
    newContactsToday: number;
    activeConversations: number;
    quotes24h: number;
    reservationsMonth: number;
    revenueMonth: number;
    awaitingHuman: number;
    concludedByAI: number;
    blockedActions: number;
}


export function StatsCards() {
    const [stats, setStats] = useState<StatsData | null>(null);
    const [loading, setLoading] = useState(true);

     useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/dashboard/stats');
                const data = await res.json();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);
    

  const statsCards = [
    {
      title: 'Novos Contatos (Hoje)',
      value: stats?.newContactsToday,
      icon: Users,
      change: '+20%',
      description: 'em relação a ontem'
    },
    {
      title: 'Atendimentos Ativos',
      value: stats?.activeConversations,
      icon: MessageCircle,
      change: '3 urgentes',
      changeColor: 'text-orange-500 font-semibold'
    },
    {
      title: 'Orçamentos (24h)',
      value: stats?.quotes24h,
      icon: FileText,
      change: 'R$ 25.4k',
      description: 'em valor'
    },
    {
      title: 'Reservas (Mês)',
      value: stats?.reservationsMonth,
      icon: Bookmark,
      change: '+10%',
      description: 'em relação ao mês passado'
    },
    {
      title: 'Faturamento (Mês)',
      value: `R$ ${(stats?.revenueMonth ?? 0 / 1000).toFixed(1)}k`,
      icon: DollarSign,
      change: '+30%',
      description: 'em relação ao mês passado'
    },
    {
      title: 'Aguardando Claudia',
      value: stats?.awaitingHuman,
      icon: UserCheck,
      change: 'Para aprovações',
      changeColor: 'text-orange-500',
    },
    {
      title: 'Concluído pela IA',
      value: stats?.concludedByAI,
      icon: Bot,
      change: 'Ações autônomas',
      changeColor: 'text-purple-600',
    },
    {
      title: 'Ações Bloqueadas',
      value: stats?.blockedActions,
      icon: Lock,
      change: 'Requerem autorização',
      changeColor: 'text-destructive',
    },
  ];

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
            Array.from({length: 8}).map((_, i) => (
                <Card key={i}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <Skeleton className="h-4 w-32"/>
                        <Skeleton className="h-4 w-4"/>
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-7 w-16"/>
                        <Skeleton className="h-3 w-24 mt-2"/>
                    </CardContent>
                </Card>
            ))
        ) : (
            statsCards.map((stat) => (
            <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{stat.value ?? 0}</div>
                <p className="text-xs text-muted-foreground">
                    <span className={cn(stat.changeColor)}>{stat.change}</span>
                    {stat.description && ` ${stat.description}`}
                </p>
                </CardContent>
            </Card>
            ))
        )}
      </div>
    </>
  );
}
