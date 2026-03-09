// This component still uses static data as a placeholder for a real-time activity feed.
// In a real application, this would be powered by a WebSocket or server-sent events.

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { originalContacts } from '@/lib/db/mock-data';

const activities = [
  {
    contact: originalContacts[0],
    action: 'pediu um orçamento de transfer para GRU.',
    time: '5 minutos atrás',
  },
  {
    contact: originalContacts[2],
    action: 'aprovou o orçamento para evento corporativo.',
    time: '1 hora atrás',
  },
  {
    contact: originalContacts[1],
    action: 'foi transferido para um atendente humano.',
    time: '3 horas atrás',
  },
  {
    contact: {
        fullName: 'Novo Lead',
        avatar: 'https://picsum.photos/seed/10/100/100'
    },
    action: 'solicitou uma viagem para Campos do Jordão via Instagram.',
    time: '5 horas atrás',
  },
  {
    contact: originalContacts[3],
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
              <AvatarImage src={activity.contact.avatar} alt="Avatar" data-ai-hint="person avatar"/>
              <AvatarFallback>{activity.contact.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <p className="text-sm font-medium leading-none">
                {activity.contact.fullName}
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
