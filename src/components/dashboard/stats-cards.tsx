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
  Clock,
  ThumbsUp,
  TrendingUp,
  Ban,
  FileQuestion,
  UserCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { conversations, quotes, bookings } from '@/lib/data';

export function StatsCards() {
  const awaitingHuman = conversations.filter(c => c.status === 'aguardando humano').length;
  const unconfirmedBookings = bookings.filter(b => b.status === 'não confirmado').length;
  const canceledQuotes = quotes.filter(q => q.status === 'cancelado').length;

  const stats = [
    {
      title: 'Novos Contatos (Hoje)',
      value: '12',
      icon: Users,
      change: '+20%',
      description: 'em relação a ontem'
    },
    {
      title: 'Atendimentos Ativos',
      value: conversations.filter(c => c.status === 'open' || c.status === 'pending').length,
      icon: MessageCircle,
      change: '3 urgentes',
      changeColor: 'text-orange-500 font-semibold'
    },
    {
      title: 'Orçamentos (24h)',
      value: quotes.filter(q => new Date(q.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length,
      icon: FileText,
      change: 'R$ 25.4k',
      description: 'em valor'
    },
    {
      title: 'Reservas (Mês)',
      value: bookings.filter(b => new Date(b.createdAt).getMonth() === new Date().getMonth()).length,
      icon: Bookmark,
      change: '+10%',
      description: 'em relação ao mês passado'
    },
    {
      title: 'Faturamento (Mês)',
      value: 'R$ 82.3k',
      icon: DollarSign,
      change: '+30%',
      description: 'em relação ao mês passado'
    },
    {
      title: 'Aguardando Claudia',
      value: awaitingHuman,
      icon: UserCheck,
      change: 'Para criar orçamentos',
      changeColor: 'text-orange-500',
    },
    {
      title: 'Reservas Não Confirmadas',
      value: unconfirmedBookings,
      icon: FileQuestion,
      change: 'Aguardando cliente',
      changeColor: 'text-yellow-600 dark:text-yellow-400',
    },
    {
      title: 'Orçamentos Cancelados (Mês)',
      value: canceledQuotes,
      icon: Ban,
      change: '-5%',
      description: 'em relação ao mês passado',
      changeColor: 'text-destructive',
    },
  ];

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={cn(stat.changeColor)}>{stat.change}</span>
                {stat.description && ` ${stat.description}`}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
