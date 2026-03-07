'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { pipelineDeals, customers } from "@/lib/data"
import type { PipelineDeal } from "@/lib/types"

const stages = [
  { id: 'new-lead', title: 'Novo Lead' },
  { id: 'qualified', title: 'Qualificado' },
  { id: 'quote-sent', title: 'Orçamento Enviado' },
  { id: 'negotiation', title: 'Negociação' },
  { id: 'closed-won', title: 'Fechado' },
  { id: 'closed-lost', title: 'Perdido' },
]

const DealCard = ({ deal }: { deal: PipelineDeal }) => {
  const customer = customers.find(c => c.id === deal.customerId)
  return (
    <Card className="mb-2 cursor-grab active:cursor-grabbing">
      <CardHeader className="p-3">
        <CardTitle className="text-sm">{deal.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 text-xs text-muted-foreground">
        <p>{customer?.name}</p>
        <p className="font-bold text-primary">
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
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
        {stages.map(stage => {
          const dealsInStage = pipelineDeals.filter(d => d.stage === stage.id);
          const totalValue = dealsInStage.reduce((sum, deal) => sum + deal.value, 0);
          return (
            <div key={stage.id} className="bg-muted/50 rounded-lg p-2 min-w-[280px]">
              <h3 className="font-semibold p-2">{stage.title} ({dealsInStage.length})</h3>
              <p className="text-xs text-muted-foreground px-2 mb-2">
                {totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
              <div className="space-y-2">
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
