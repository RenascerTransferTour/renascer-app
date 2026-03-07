'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { pipelineDeals, customers } from "@/lib/data"
import type { PipelineDeal } from "@/lib/types"
import { getStatusBadgeClasses } from "@/lib/utils"
import { cn } from "@/lib/utils"


const stages = [
  { id: 'new-lead', title: 'Novo Lead' },
  { id: 'qualified', title: 'Qualificado' },
  { id: 'quote-sent', title: 'Orçamento Enviado' },
  { id: 'negotiation', title: 'Negociação' },
  { id: 'unconfirmed', title: 'Não Confirmado' },
  { id: 'closed-won', title: 'Fechado' },
  { id: 'canceled', title: 'Cancelado' },
  { id: 'closed-lost', title: 'Perdido' },
]

const getStageColor = (stageId: string) => {
    switch (stageId) {
        case 'closed-won': return 'border-t-green-500';
        case 'closed-lost':
        case 'canceled': return 'border-t-red-500';
        case 'negotiation': 
        case 'unconfirmed': return 'border-t-yellow-500';
        case 'quote-sent': return 'border-t-purple-500';
        default: return 'border-t-blue-500';
    }
}

const DealCard = ({ deal }: { deal: PipelineDeal }) => {
  const customer = customers.find(c => c.id === deal.customerId)
  return (
    <Card className="mb-2 cursor-grab active:cursor-grabbing hover:bg-muted/80 transition-colors">
      <CardHeader className="p-3 pb-1">
        <CardTitle className="text-sm font-medium">{deal.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 text-xs">
        <p className="text-muted-foreground">{customer?.name}</p>
        <p className="font-bold text-primary mt-1">
          {deal.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </p>
      </CardContent>
    </Card>
  )
}

export default function PipelinePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pipeline de Vendas (CRM)</h1>
        <p className="text-muted-foreground">
          Gerencie seu processo comercial com o pipeline no estilo Kanban.
        </p>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map(stage => {
          const dealsInStage = pipelineDeals.filter(d => d.stage === stage.id);
          const totalValue = dealsInStage.reduce((sum, deal) => sum + deal.value, 0);
          return (
            <div key={stage.id} className={cn("bg-muted/50 rounded-lg min-w-[280px] border-t-4 flex flex-col", getStageColor(stage.id))}>
              <div className="p-3">
                <h3 className="font-semibold">{stage.title} <span className="text-muted-foreground font-normal">({dealsInStage.length})</span></h3>
                <p className="text-sm font-semibold text-muted-foreground">
                    {totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
              <div className="p-2 pt-0 space-y-2 flex-1 overflow-y-auto">
                {dealsInStage.map(deal => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
