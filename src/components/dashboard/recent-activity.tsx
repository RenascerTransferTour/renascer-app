import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
  import { Badge } from '@/components/ui/badge';
  import { mockLeads } from '@/lib/mock-data';
  import { formatDistanceToNow } from 'date-fns';
  import { ptBR } from 'date-fns/locale';
  import { formatCurrency } from '@/lib/utils';
  
  export function RecentActivity() {
    const recentLeads = mockLeads.slice(0, 5);
  
    return (
        <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead className="hidden sm:table-cell">Origem</TableHead>
                <TableHead className="hidden sm:table-cell">Estágio</TableHead>
                <TableHead className="hidden md:table-cell">Atualizado</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {recentLeads.map((lead) => (
                <TableRow key={lead.id}>
                    <TableCell>
                    <div className="font-medium">{lead.name}</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                        {lead.agent.name}
                    </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                        <Badge className="text-xs" variant="secondary">
                            {lead.source}
                        </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                        <Badge className="text-xs" variant={lead.stage === 'won' ? 'default' : 'outline'}>
                            {lead.stage}
                        </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                        {formatDistanceToNow(new Date(lead.lastUpdate), { addSuffix: true, locale: ptBR })}
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(lead.value)}</TableCell>
                </TableRow>
                ))}
            </TableBody>
        </Table>
    );
  }
