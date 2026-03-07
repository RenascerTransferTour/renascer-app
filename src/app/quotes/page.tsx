import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import { Badge } from "@/components/ui/badge"
  import { Button } from "@/components/ui/button"
  import { quotes, customers } from "@/lib/data"
  import { format, parseISO } from 'date-fns';
  import { ptBR } from 'date-fns/locale';
  import { PlusCircle } from "lucide-react"
  import { getStatusBadgeClasses } from "@/lib/utils"

  export default function QuotesPage() {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Gestão de Orçamentos</h1>
                <p className="text-muted-foreground">
                Acompanhe todos os orçamentos enviados e seus status.
                </p>
            </div>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4"/>
                Criar Orçamento
            </Button>
        </div>
        
        <div className="border rounded-lg">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Resumo</TableHead>
                <TableHead>Faixa de Preço</TableHead>
                <TableHead>Situação</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead>Última Atualização</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {quotes.map((quote) => {
                const customer = customers.find(c => c.id === quote.customerId);
                return (
                    <TableRow key={quote.id}>
                    <TableCell className="font-medium">{customer?.name || 'N/A'}</TableCell>
                    <TableCell>{quote.summary}</TableCell>
                    <TableCell>{`R$ ${quote.priceRange[0]} - R$ ${quote.priceRange[1]}`}</TableCell>
                    <TableCell>
                        <Badge className={`${getStatusBadgeClasses(quote.status)} capitalize`}>{quote.status.replace('-', ' ')}</Badge>
                    </TableCell>
                    <TableCell>
                        <Badge variant="outline">Claudia</Badge>
                    </TableCell>
                    <TableCell>{format(parseISO(quote.createdAt), 'dd/MM/yyyy', { locale: ptBR })}</TableCell>
                    <TableCell>{format(parseISO(quote.updatedAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</TableCell>
                    </TableRow>
                )
                })}
            </TableBody>
            </Table>
        </div>
      </div>
    )
  }
  