import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircle2, XCircle, AlertCircle, Clock } from "lucide-react"

const summaryItems = [
    { title: 'Confirmados Hoje', value: 5, icon: CheckCircle2, color: 'text-green-500' },
    { title: 'Não Confirmados', value: 3, icon: AlertCircle, color: 'text-yellow-500' },
    { title: 'Cancelados (24h)', value: 1, icon: XCircle, color: 'text-red-500' },
    { title: 'Aguardando Ação', value: 8, icon: Clock, color: 'text-blue-500' },
]

export function OperationalSummary() {
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
