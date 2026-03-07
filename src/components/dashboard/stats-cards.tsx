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
} from 'lucide-react';

const stats = [
  {
    title: 'Leads Recebidos (Hoje)',
    value: '12',
    icon: Users,
    change: '+20%',
  },
  {
    title: 'Atendimentos em Andamento',
    value: '8',
    icon: MessageCircle,
    change: '-5%',
  },
  {
    title: 'Orçamentos Enviados',
    value: '23',
    icon: FileText,
    change: '+15%',
  },
  {
    title: 'Reservas Confirmadas',
    value: '7',
    icon: Bookmark,
    change: '+10%',
  },
  {
    title: 'Vendas Fechadas (Mês)',
    value: 'R$ 12.345',
    icon: DollarSign,
    change: '+30%',
  },
];

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.change} em relação a ontem
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
