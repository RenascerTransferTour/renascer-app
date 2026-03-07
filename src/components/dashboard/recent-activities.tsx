import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { customers } from '@/lib/data';

const activities = [
  {
    customer: customers[0],
    action: 'pediu um orçamento de transfer para GRU.',
    time: '5 minutos atrás',
  },
  {
    customer: customers[2],
    action: 'aprovou o orçamento para evento corporativo.',
    time: '1 hora atrás',
  },
  {
    customer: customers[1],
    action: 'foi transferido para um atendente humano.',
    time: '3 horas atrás',
  },
  {
    customer: {
        name: 'Novo Lead',
        avatar: 'https://picsum.photos/seed/10/100/100'
    },
    action: 'solicitou uma viagem para Campos do Jordão via Instagram.',
    time: '5 horas atrás',
  },
  {
    customer: customers[3],
    action: 'teve o atendimento sobre turismo encerrado.',
    time: '1 dia atrás',
  },
];

export function RecentActivities() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividades Recentes</CardTitle>
        <CardDescription>Últimas interações na plataforma.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {activities.map((activity, index) => (
          <div className="flex items-start gap-4" key={index}>
            <Avatar className="h-9 w-9 border">
              <AvatarImage src={activity.customer.avatar} alt="Avatar" data-ai-hint="person avatar"/>
              <AvatarFallback>{activity.customer.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <p className="text-sm font-medium leading-none">
                {activity.customer.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {activity.action}
              </p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
