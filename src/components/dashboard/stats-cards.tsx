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
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
    value: '8',
    icon: MessageCircle,
    change: '3 urgentes',
    changeColor: 'text-orange-500 font-semibold'
  },
  {
    title: 'Orçamentos (24h)',
    value: '23',
    icon: FileText,
    change: 'R$ 25.4k',
    description: 'em valor'
  },
  {
    title: 'Reservas (Mês)',
    value: '42',
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
    title: 'Orçamentos Cancelados (Mês)',
    value: '2',
    icon: Ban,
    change: '-5%',
    description: 'em relação ao mês passado',
    changeColor: 'text-destructive',
  },
  {
    title: 'Reservas Não Confirmadas',
    value: '3',
    icon: FileQuestion,
    change: 'Aguardando cliente',
    changeColor: 'text-yellow-600 dark:text-yellow-400',
  },
];

export function StatsCards() {
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
