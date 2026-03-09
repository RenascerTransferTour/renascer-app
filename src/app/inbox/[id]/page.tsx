'use client';

import { useParams } from 'next/navigation';
import {
  Bot,
  User,
  Send,
  Sparkles,
  UserCheck,
  LogOut,
  FileText,
  Bookmark,
  Phone,
  Mail,
  MoreVertical,
  Waypoints,
  Star,
  Zap,
  Lock,
  UserCircle,
  Loader2,
  MessageSquare,
  Clock,
  XCircle,
  CheckCircle2,
  History,
  FileEdit,
  UserCog,
  MessageCircleQuestion,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn, getStatusBadgeClasses } from '@/lib/utils';
import { useMemo, useState, useEffect, useRef } from 'react';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Message, Conversation, Customer, AiFlowPermission, AuditLog } from '@/lib/types';
  
const statusLabels: Record<string, string> = {
    open: 'Aberto',
    closed: 'Fechado',
    pending: 'Pendente',
    unconfirmed: 'Não Confirmado',
    canceled: 'Cancelado',
    'aguardando humano': 'Aguardando Humano',
    'IA assistida': 'IA Assistida',
    'IA bloqueada': 'IA Bloqueada',
    'IA autorizada': 'IA Autorizada',
    'concluído pela IA': 'Concluído pela IA',
    'concluído por humano': 'Concluído por Humano',
}

const getStatusIcon = (status: string) => {
    switch(status) {
        case 'aguardando humano': return <UserCheck className="size-3.5" />;
        case 'IA assistida':
        case 'concluído pela IA': return <Bot className="size-3.5" />;
        case 'IA bloqueada': return <Lock className="size-3.5" />;
        case 'open': return <MessageSquare className="size-3.5" />;
        case 'closed':
        case 'concluído por humano': return <CheckCircle2 className="size-3.5" />;
        case 'pending': return <Clock className="size-3.5" />;
        case 'canceled': return <XCircle className="size-3.5" />;
        default: return null;
    }
}

const eventTypeIcons: Record<string, React.ElementType> = {
    mensagem_recebida: MessageCircleQuestion,
    sugestão_ia_gerada: Sparkles,
    orçamento_rascunho_criado: FileEdit,
    finalizado_manual: UserCog,
    default: History
};

const eventTypeLabels: Record<string, string> = {
    mensagem_recebida: 'Cliente enviou uma mensagem',
    sugestão_ia_gerada: 'IA analisou e gerou sugestão',
    orçamento_rascunho_criado: 'IA gerou rascunho de orçamento',
    finalizado_manual: 'Finalizado manualmente pela Cláudia'
};


export default function ConversationPage() {
  const params = useParams();
  const { id } = params;

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [permissions, setPermissions] = useState<AiFlowPermission[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isAiActive, setIsAiActive] = useState(false);
  const [summary, setSummary] = useState('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (id) {
        const fetchConversation = async () => {
            try {
                setLoading(true);
                const [convRes, permsRes] = await Promise.all([
                    fetch(`/api/conversations/${id}`),
                    fetch('/api/settings/ai/permissions'),
                ]);

                if (!convRes.ok || !permsRes.ok) {
                    throw new Error("Failed to fetch initial data");
                }

                const convData = await convRes.json();
                const permsData = await permsRes.json();
                const contactData = convData.contact;

                setConversation(convData);
                setMessages(convData.messages);
                // Correctly handle the Customer type by providing default fallbacks
                setCustomer({
                  ...contactData,
                  urgency: contactData.urgency || 'low',
                  interestLevel: contactData.interestLevel || 'low',
                });
                setAuditLogs(convData.auditLogs);
                setIsAiActive(convData.isAiActive);
                setPermissions(permsData);
            } catch (error) {
                console.error("Failed to fetch conversation", error);
                 toast({
                    variant: "destructive",
                    title: "Erro ao carregar conversa",
                    description: "Não foi possível buscar os detalhes da conversa.",
                })
            } finally {
                setLoading(false);
            }
        }
        fetchConversation();
    }
  }, [id, toast]);

  useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [messages]);

  const aiPermissions = useMemo(() => {
    const getPerm = (flowName: AiFlowPermission['flowName']) => permissions.find(p => p.flowName === flowName)?.enabled ?? false;
    return {
        canCreateQuote: getPerm('quoteCreation'),
        canCreateBooking: getPerm('bookingCreation'),
        canSummarize: getPerm('summarization'),
    }
  }, [permissions]);
  
  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || isSending) return;

    setIsSending(true);
    const messageContent = newMessage;
    
    try {
        const response = await fetch(`/api/conversations/${id}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: messageContent }),
        });

        const savedMessage = await response.json();

        if (!response.ok) {
            throw new Error(savedMessage.error || 'A API retornou um erro inesperado.');
        }

        setMessages(prevMessages => [...prevMessages, savedMessage]);
        setNewMessage(''); // Clear input only on success

    } catch (error) {
        console.error("Failed to send message:", error);
        toast({
            variant: "destructive",
            title: "Erro ao enviar mensagem",
            description: error instanceof Error ? error.message : "Sua mensagem não pôde ser enviada. Por favor, tente novamente.",
        });
        // Do not clear message so user can retry
    } finally {
        setIsSending(false);
    }
  };
  
  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    setSummary('');
    try {
        const convHistory = messages.map(m => ({ 
            role: m.senderType === 'user' ? 'user' : (m.senderType === 'agent' ? 'agent' : 'AI'), 
            message: m.content 
        }));
        
        const response = await fetch('/api/summary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ conversationHistory: convHistory })
        });
        
        const result = await response.json();
        if (!response.ok) throw new Error(result.details || result.error || 'Ocorreu um erro no servidor.');

        if (result.success) {
            setSummary(result.summary);
        } else {
             throw new Error(result.details || 'Falha ao gerar resumo da API.');
        }

    } catch (error) {
        console.error("Failed to generate summary:", error);
        toast({
            variant: "destructive",
            title: "Erro ao gerar resumo",
            description: error instanceof Error ? error.message : "Não foi possível conectar ao serviço de IA.",
        })
    } finally {
        setIsGeneratingSummary(false);
    }
  };

  if (loading) {
      return (
        <div className="grid h-[calc(100vh-8rem)] grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
             <div className="md:col-span-2 lg:col-span-3 flex flex-col h-full">
                <Card className='flex flex-col h-full'>
                    <CardHeader className="flex flex-row items-center justify-between border-b p-4">
                         <div className='flex items-center gap-3'>
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className='space-y-1'>
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                         </div>
                         <div className='flex items-center gap-2'>
                             <Skeleton className="h-9 w-32" />
                             <Skeleton className="h-9 w-36" />
                         </div>
                    </CardHeader>
                    <CardContent className='flex-1 p-4'/>
                    <CardFooter className='p-4 border-t'>
                        <Skeleton className="h-10 w-full" />
                    </CardFooter>
                </Card>
             </div>
             <div className='hidden md:block h-full'>
                <Card className='h-full'>
                    <CardHeader>
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-48" />
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-24 w-full" />
                    </CardContent>
                </Card>
             </div>
        </div>
      )
  }

  if (!conversation || !customer) {
    return <div className='text-center'>Conversa não encontrada ou falha ao carregar.</div>;
  }
  
  const urgencyClasses = getStatusBadgeClasses(customer.urgency === 'high' ? 'cancelado' : (customer.urgency === 'medium' ? 'não confirmado' : 'concluída'));
  const interestClasses = getStatusBadgeClasses(customer.interestLevel === 'high' ? 'confirmada' : (customer.interestLevel === 'medium' ? 'pendente' : 'rascunho'));

  return (
    <TooltipProvider>
    <div className="grid h-[calc(100vh-8rem)] grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div className="md:col-span-2 lg:col-span-3 flex flex-col h-full">
        <Card className='flex flex-col h-full'>
            <CardHeader className="flex flex-row items-center justify-between border-b">
                <div className='flex items-center gap-3'>
                    <Avatar className="h-10 w-10 border">
                        <AvatarImage src={customer.avatar} data-ai-hint="person avatar" />
                        <AvatarFallback>{customer.fullName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-semibold">{customer.fullName}</h2>
                             <Badge className={cn(getStatusBadgeClasses(conversation.status), 'capitalize gap-1.5')}>
                                {getStatusIcon(conversation.status)}
                                {statusLabels[conversation.status] || conversation.status}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                        via{' '}
                        <span className="font-medium text-primary">
                            {conversation.channelId.replace('channel-','')}
                        </span>
                        </p>
                    </div>
                </div>
            <div className="flex items-center gap-2">
                <Dialog>
                    <DialogTrigger asChild>
                         <Tooltip>
                            <TooltipTrigger asChild>
                                <div>
                                    <Button variant="outline" size="sm" onClick={aiPermissions.canSummarize ? handleGenerateSummary : undefined} disabled={isGeneratingSummary || !aiPermissions.canSummarize}>
                                        {isGeneratingSummary ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                        {isGeneratingSummary ? 'Gerando...' : 'Gerar Resumo'}
                                        {!aiPermissions.canSummarize && <Lock className="ml-2 h-3 w-3"/>}
                                    </Button>
                                </div>
                            </TooltipTrigger>
                             {!aiPermissions.canSummarize && <TooltipContent>A geração de resumo está desativada nas configurações.</TooltipContent>}
                        </Tooltip>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                        <DialogTitle>Resumo da Conversa</DialogTitle>
                        <DialogDescription>
                            Este é um resumo gerado por IA dos pontos-chave da conversa.
                        </DialogDescription>
                        </DialogHeader>
                        {isGeneratingSummary ? (
                            <div className="space-y-2 py-4">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">{summary || "Clique em 'Gerar Resumo' para começar."}</p>
                        )}
                    </DialogContent>
                </Dialog>

                {isAiActive ? (
                    <Button size="sm" onClick={() => setIsAiActive(false)}>
                        <UserCheck className="mr-2 h-4 w-4" />
                        Assumir Atendimento
                    </Button>
                ) : (
                    <Button size="sm" variant="secondary" onClick={() => setIsAiActive(true)}>
                        <Bot className="mr-2 h-4 w-4" />
                        Devolver para IA
                    </Button>
                )}
            </div>
            </CardHeader>
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-6">
                {messages.map((message) => (
                <div
                    key={message.id}
                    className={cn(
                    'flex items-end gap-2',
                    message.senderType === 'user' ? 'justify-start' : 'justify-end'
                    )}
                >
                    {message.senderType === 'user' && (
                    <Avatar className="h-8 w-8 border">
                        <AvatarImage src={customer.avatar} data-ai-hint="person avatar" />
                        <AvatarFallback>{customer.fullName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    )}
                    <div
                    className={cn(
                        'max-w-md rounded-lg p-3',
                        message.senderType === 'user'
                        ? 'bg-muted rounded-bl-none'
                        : 'bg-primary text-primary-foreground rounded-br-none'
                    )}
                    >
                    <p className="text-sm">{message.content}</p>
                    </div>
                    {message.senderType !== 'user' && (
                    <Avatar className="h-8 w-8">
                        <AvatarFallback>
                        {message.senderType === 'ai' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                        </AvatarFallback>
                    </Avatar>
                    )}
                </div>
                ))}
            </div>
            </ScrollArea>
            <CardFooter className='p-4 border-t'>
            <div className="relative w-full">
                <Input
                placeholder={isAiActive ? "A IA está ativa. Para enviar uma mensagem, assuma o atendimento." : "Digite sua mensagem..."}
                className="pr-12"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isAiActive || isSending}
                />
                <Button
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={handleSendMessage}
                disabled={isAiActive || isSending}
                >
                {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
            </div>
            </CardFooter>
        </Card>
      </div>
      <div className="hidden md:block h-full overflow-y-auto">
        <div className="flex flex-col gap-4">
            <Card className="flex flex-col">
            <CardHeader>
                <CardTitle>Detalhes do Cliente</CardTitle>
                <CardDescription>Informações de {customer.fullName}.</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="py-4 space-y-4 text-sm flex-1">
                <div className='space-y-2'>
                    <div className="flex items-center gap-2">
                        <UserCircle className="h-4 w-4 text-muted-foreground" />
                        <span className='text-muted-foreground'>Responsável:</span>
                        <span className='font-medium ml-auto'>{conversation.humanOwnerId === 'op-1' ? 'Cláudia Vaz' : 'IA'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className='text-muted-foreground'>Telefone:</span>
                        <span className='font-medium ml-auto'>{customer.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className='text-muted-foreground'>Email:</span>
                        <span className='font-medium ml-auto'>{customer.email}</span>
                    </div>
                </div>
                <Separator/>
                <div className='space-y-2'>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Waypoints className="h-4 w-4 text-muted-foreground" />
                            <span className='text-muted-foreground'>Canal de Origem:</span>
                        </div>
                        <Badge variant="outline" className='font-normal'>{customer.originChannel || 'N/A'}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-muted-foreground" />
                            <span className='text-muted-foreground'>Nível de Interesse:</span>
                        </div>
                        <Badge className={cn(interestClasses, 'capitalize')}>{customer.interestLevel}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-muted-foreground" />
                            <span className='text-muted-foreground'>Urgência:</span>
                        </div>
                        <Badge className={cn(urgencyClasses, 'capitalize')}>{customer.urgency}</Badge>
                    </div>
                </div>
                <Separator />
                <div className="space-y-2">
                    <p className='text-xs font-semibold text-muted-foreground uppercase'>Ações Rápidas</p>
                    <Tooltip>
                        <TooltipTrigger className='w-full'>
                            <div className='w-full'>
                                <Button className="w-full justify-start" variant="ghost" disabled={!aiPermissions.canCreateQuote}>
                                    <FileText className="mr-2 h-4 w-4"/> Criar Orçamento
                                    {!aiPermissions.canCreateQuote && <Lock className="ml-auto h-3 w-3 text-muted-foreground"/>}
                                </Button>
                            </div>
                        </TooltipTrigger>
                        {!aiPermissions.canCreateQuote && <TooltipContent>A criação de orçamento está desativada nas configurações.</TooltipContent>}
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger className='w-full'>
                            <div className='w-full'>
                                <Button className="w-full justify-start" variant="ghost" disabled={!aiPermissions.canCreateBooking}>
                                    <Bookmark className="mr-2 h-4 w-4"/> Criar Reserva
                                    {!aiPermissions.canCreateBooking && <Lock className="ml-auto h-3 w-3 text-muted-foreground"/>}
                                </Button>
                            </div>
                        </TooltipTrigger>
                        {!aiPermissions.canCreateBooking && <TooltipContent>A criação de reserva está desativada nas configurações.</TooltipContent>}
                    </Tooltip>
                </div>
            </CardContent>
            <Separator />
            <CardFooter className='p-2'>
                <Button className="w-full" variant="destructive"><LogOut className="mr-2 h-4 w-4"/> Encerrar Atendimento</Button>
            </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Histórico de Atividades</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {auditLogs && auditLogs.length > 0 ? (
                        auditLogs.map(log => {
                            const Icon = eventTypeIcons[log.eventType] || eventTypeIcons.default;
                            const actorIcon = log.actorType === 'human' ? User : log.actorType === 'ai' ? Bot : UserCircle;
                            const label = eventTypeLabels[log.eventType] || log.eventType.replace(/_/g, ' ');
                            return (
                                <div key={log.id} className="flex gap-3">
                                    <div className="flex flex-col items-center">
                                        <div className={cn("flex items-center justify-center size-8 rounded-full bg-muted", getStatusBadgeClasses(log.eventType))}>
                                            <Icon className="size-4" />
                                        </div>
                                        <div className="w-px h-full bg-border"></div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium capitalize">{label}</p>
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <>
                                                <actorIcon className="size-3" />
                                                <span>{log.actor}</span>
                                                <span>•</span>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <span>{formatDistanceToNow(parseISO(log.timestamp), { addSuffix: true, locale: ptBR })}</span>
                                                    </TooltipTrigger>
                                                    <TooltipContent>{format(parseISO(log.timestamp), "dd/MM/yyyy HH:mm:ss", { locale: ptBR })}</TooltipContent>
                                                </Tooltip>
                                            </>
                                        </div>
                                        {log.notes && <p className="text-xs text-muted-foreground mt-1 bg-muted/50 p-2 rounded-md">{log.notes}</p>}
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">Nenhum evento registrado para este cliente.</p>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
    </TooltipProvider>
  );
}
