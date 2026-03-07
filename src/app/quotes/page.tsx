'use client';

import { useState, useEffect } from 'react';
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
  import { format, parseISO } from 'date-fns';
  import { ptBR } from 'date-fns/locale';
  import { PlusCircle, Bot } from "lucide-react"
  import { getStatusBadgeClasses, cn } from "@/lib/utils"
  import type { Quote, Contact } from '@/lib/db/data-model';
  import { Skeleton } from '@/components/ui/skeleton';

  type QuoteWithContact = Quote & { contact?: Contact, ownerName?: string };

  const StatusDisplay = ({ quote }: { quote: QuoteWithContact }) => {
    if (quote.status === 'rascunho' && quote.ownerId === 'IA') {
        return (
            <Badge className={cn(getStatusBadgeClasses('rascunho'), 'gap-1.5')}>
                <Bot className="h-3.5 w-3.5" />
                Rascunho gerado pela IA
            </Badge>
        );
    }

    const statusText = quote.status.replace('-', ' ');
    if (quote.status === 'aguardando aprovação') {
        return <Badge className={cn(getStatusBadgeClasses(quote.status), 'capitalize')}>Aguardando aprovação da Cláudia</Badge>;
    }
    
    return <Badge className={cn(getStatusBadgeClasses(quote.status), 'capitalize')}>{statusText}</Badge>;
};

  export default function QuotesPage() {
    const [quotes, setQuotes] = useState<QuoteWithContact[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuotes = async () => {
            try {
                const res = await fetch('/api/quotes');
                const data = await res.json();
                setQuotes(data);
            } catch (error) {
                console.error("Failed to fetch quotes", error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuotes();
    }, []);

    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Gestão de Orçamentos</h1>
                <p className="text-muted-foreground">
                Acompanhe todos os orçamentos. A finalização e o envio ao cliente continuam sendo um processo manual.
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
                {loading ? (
                     Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-36" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        </TableRow>
                    ))
                ) : (
                    quotes.map((quote) => (
                        <TableRow key={quote.id}>
                        <TableCell className="font-medium">{quote.contact?.fullName || 'N/A'}</TableCell>
                        <TableCell>{quote.summary}</TableCell>
                        <TableCell>{`R$ ${quote.priceRange[0]} - R$ ${quote.priceRange[1]}`}</TableCell>
                        <TableCell>
                           <StatusDisplay quote={quote} />
                        </TableCell>
                        <TableCell>
                            <Badge variant="outline">{quote.ownerName}</Badge>
                        </TableCell>
                        <TableCell>{format(parseISO(quote.createdAt), 'dd/MM/yyyy', { locale: ptBR })}</TableCell>
                        <TableCell>{format(parseISO(quote.updatedAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
            </Table>
        </div>
      </div>
    )
  }

    