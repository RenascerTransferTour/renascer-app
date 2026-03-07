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
} from 'lucide-react';

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
    changeColor: 'text-destructive'
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
];

const highlights = [
    {
        icon: Clock,
        title: "Atendimento 24h",
        description: "3 atendimentos na madrugada"
    },
    {
        icon: ThumbsUp,
        title: "Orçamento Rápido",
        description: "Média de 15 min para envio"
    },
    {
        icon: TrendingUp,
        title: "Serviços em Alta",
        description: "Transfer GRU e Viagens"
    }
]

export function StatsCards() {
  return (
    <>
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
                <span className={stat.changeColor || ''}>{stat.change}</span>
                {stat.description && ` ${stat.description}`}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
