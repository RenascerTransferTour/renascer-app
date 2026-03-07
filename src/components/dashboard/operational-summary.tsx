import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircle2, XCircle, AlertCircle, Clock, UserCheck } from "lucide-react"
import { conversations, bookings, quotes } from "@/lib/data"


export function OperationalSummary() {
    const confirmedToday = bookings.filter(b => b.status === 'confirmada' && new Date(b.createdAt).toDateString() === new Date().toDateString()).length;
    const unconfirmed = bookings.filter(b => b.status === 'não confirmado').length;
    const cancelled24h = bookings.filter(b => b.status === 'cancelada' && new Date(b.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length;
    const awaitingAction = conversations.filter(c => c.status === 'aguardando humano').length;

    const summaryItems = [
        { title: 'Confirmados Hoje', value: confirmedToday, icon: CheckCircle2, color: 'text-green-500' },
        { title: 'Aguardando Cliente', value: unconfirmed, icon: AlertCircle, color: 'text-yellow-500' },
        { title: 'Cancelados (24h)', value: cancelled24h, icon: XCircle, color: 'text-red-500' },
        { title: 'Aguardando Claudia', value: awaitingAction, icon: UserCheck, color: 'text-orange-500' },
    ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo Operacional</CardTitle>
        <CardDescription>Visão rápida do status atual das operações.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryItems.map(item => (
          <div key={item.title} className="p-4 rounded-lg bg-muted/50 flex flex-col justify-start items-start gap-2 hover:bg-muted transition-colors">
            <item.icon className={`h-7 w-7 ${item.color}`} />
            <div>
              <p className="text-2xl font-bold">{item.value}</p>
              <p className="text-sm text-muted-foreground">{item.title}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
