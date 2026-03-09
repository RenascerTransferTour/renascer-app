'use client';
import { useState, useEffect } from 'react';
import { fetchWithDelay, mockLeads } from '@/lib/mock-data';
import type { Lead } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';
import { formatCurrency, getInitials } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import { MoreHorizontal, Tag, User } from 'lucide-react';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

const stages = [
    { id: 'new', title: 'Novos Leads' },
    { id: 'contacted', title: 'Contactados' },
    { id: 'qualified', title: 'Qualificados' },
    { id: 'proposal', title: 'Proposta Enviada' },
    { id: 'won', title: 'Ganhos' },
    { id: 'lost', title: 'Perdidos' },
];
  
const stageColors: { [key: string]: string } = {
    new: 'border-t-gray-400',
    contacted: 'border-t-blue-500',
    qualified: 'border-t-purple-500',
    proposal: 'border-t-yellow-500',
    won: 'border-t-green-500',
    lost: 'border-t-red-500',
};

function LeadCard({ lead }: { lead: Lead }) {
    return (
        <Card className="mb-3">
            <CardHeader className="p-3 pb-2">
                <div className="flex justify-between items-start">
                    <span className="font-semibold text-sm">{lead.name}</span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                            <DropdownMenuItem>Mover Para...</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Arquivar</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <p className="text-sm font-bold">{formatCurrency(lead.value)}</p>
            </CardHeader>
            <CardContent className="p-3 pt-0 text-xs text-muted-foreground space-y-2">
                <div className="flex items-center gap-2">
                    <User className="h-3 w-3" />
                    <span>{lead.agent.name}</span>
                </div>
                 <div className="flex items-center gap-2">
                    <Tag className="h-3 w-3" />
                    <Badge variant={lead.priority === 'high' ? 'destructive' : lead.priority === 'medium' ? 'secondary' : 'outline'} className="capitalize">
                        {lead.priority}
                    </Badge>
                </div>
            </CardContent>
        </Card>
    );
}

export function PipelineContent() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const loadData = async () => {
        setLoading(true);
        const data = await fetchWithDelay(mockLeads, 800);
        setLeads(data);
        setLoading(false);
      };
      loadData();
    }, []);
  
    return (
      <div className="flex flex-col h-full">
        <div className="mb-4">
          <h1 className="text-3xl font-bold">Pipeline de Vendas (CRM)</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie o fluxo de seus leads e oportunidades.
          </p>
        </div>
        <div className="flex-1 overflow-x-auto">
          <div className="grid grid-flow-col auto-cols-[280px] gap-4 h-full">
            {stages.map((stage) => (
              <div key={stage.id} className="flex flex-col rounded-lg bg-muted/50 h-full">
                <div className={`p-3 font-semibold border-t-4 rounded-t-lg ${stageColors[stage.id]}`}>
                  {stage.title}
                </div>
                <div className="p-2 flex-1 overflow-y-auto">
                  {loading
                    ? Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-24 mb-3" />)
                    : leads
                        .filter((lead) => lead.stage === stage.id)
                        .map((lead) => <LeadCard key={lead.id} lead={lead} />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
