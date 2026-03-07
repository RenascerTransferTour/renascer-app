'use client';

import { useParams } from 'next/navigation';
import { conversations, customers } from '@/lib/data';
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
import { useMemo, useState } from 'react';
import type { Message } from '@/lib/types';
import { generateConversationSummary } from '@/ai/flows/generate-conversation-summary-flow';
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

export default function ConversationPage() {
  const params = useParams();
  const { id } = params;

  const conversation = useMemo(() => conversations.find((c) => c.id === id), [id]);
  const customer = useMemo(
    () => customers.find((c) => c.id === conversation?.customerId),
    [conversation]
  );
  
  const [messages, setMessages] = useState<Message[]>(conversation?.messages || []);
  const [newMessage, setNewMessage] = useState('');
  const [isAiActive, setIsAiActive] = useState(conversation?.isAiActive || false);
  const [summary, setSummary] = useState('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const { toast } = useToast();

  if (!conversation || !customer) {
    return <div>Conversa não encontrada.</div>;
  }
  
  // Mock permissions based on AI settings (IA Assistida mode by default)
  const aiPermissions = { canCreateQuote: false, canCreateBooking: false }; 

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const msg: Message = {
      id: `msg-${Date.now()}`,
      role: 'agent',
      content: newMessage,
      timestamp: new Date().toISOString(),
      authorName: conversation.humanAgent || 'Admin',
    };

    setMessages([...messages, msg]);
    setNewMessage('');
  };
  
  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    setSummary('');
    try {
        const convHistory = messages.map(m => ({ role: m.role === 'user' ? 'user' : (m.role === 'agent' ? 'agent' : 'AI'), message: m.content }));
        const result = await generateConversationSummary({ conversationHistory: convHistory });
        setSummary(result.summary);
    } catch (error) {
        console.error("Failed to generate summary:", error);
        toast({
            variant: "destructive",
            title: "Erro ao gerar resumo",
            description: "Não foi possível conectar ao serviço de IA.",
        })
    } finally {
        setIsGeneratingSummary(false);
    }
  };
  
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
                        <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-semibold">{customer.name}</h2>
                            <Badge className={`${getStatusBadgeClasses(conversation.status)} capitalize`}>
                                {statusLabels[conversation.status] || conversation.status}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                        via{' '}
                        <span className="font-medium text-primary">
                            {conversation.channel}
                        </span>
                        </p>
                    </div>
                </div>
            <div className="flex items-center gap-2">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={handleGenerateSummary}>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Gerar Resumo
                        </Button>
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
            <ScrollArea className="flex-1 p-4">
            <div className="space-y-6">
                {messages.map((message) => (
                <div
                    key={message.id}
                    className={cn(
                    'flex items-end gap-2',
                    message.role === 'user' ? 'justify-start' : 'justify-end'
                    )}
                >
                    {message.role === 'user' && (
                    <Avatar className="h-8 w-8 border">
                        <AvatarImage src={customer.avatar} data-ai-hint="person avatar" />
                        <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    )}
                    <div
                    className={cn(
                        'max-w-md rounded-lg p-3',
                        message.role === 'user'
                        ? 'bg-muted rounded-bl-none'
                        : 'bg-primary text-primary-foreground rounded-br-none'
                    )}
                    >
                    <p className="text-sm">{message.content}</p>
                    </div>
                    {message.role !== 'user' && (
                    <Avatar className="h-8 w-8">
                        <AvatarFallback>
                        {message.role === 'ai' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
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
                disabled={isAiActive}
                />
                <Button
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={handleSendMessage}
                disabled={isAiActive}
                >
                <Send className="h-4 w-4" />
                </Button>
            </div>
            </CardFooter>
        </Card>
      </div>
      <div className="hidden md:block h-full">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle>Detalhes do Cliente</CardTitle>
            <CardDescription>Informações e histórico de {customer.name}.</CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="py-4 space-y-4 text-sm flex-1">
            <div className='space-y-2'>
                <div className="flex items-center gap-2">
                    <UserCircle className="h-4 w-4 text-muted-foreground" />
                    <span className='text-muted-foreground'>Responsável:</span>
                    <span className='font-medium ml-auto'>{conversation.humanAgent || 'IA'}</span>
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
                    <Badge variant="outline" className='font-normal'>{customer.originChannel}</Badge>
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
                        <Button className="w-full justify-start" variant="ghost" disabled={!aiPermissions.canCreateQuote}>
                            <FileText className="mr-2 h-4 w-4"/> Criar Orçamento
                            {!aiPermissions.canCreateQuote && <Lock className="ml-auto h-3 w-3 text-muted-foreground"/>}
                        </Button>
                    </TooltipTrigger>
                    {!aiPermissions.canCreateQuote && <TooltipContent>A IA não tem permissão para criar orçamentos. Requer aprovação de {conversation.humanAgent || 'um humano'}.</TooltipContent>}
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger className='w-full'>
                        <Button className="w-full justify-start" variant="ghost" disabled={!aiPermissions.canCreateBooking}>
                            <Bookmark className="mr-2 h-4 w-4"/> Criar Reserva
                            {!aiPermissions.canCreateBooking && <Lock className="ml-auto h-3 w-3 text-muted-foreground"/>}
                        </Button>
                    </TooltipTrigger>
                    {!aiPermissions.canCreateBooking && <TooltipContent>A IA não tem permissão para criar reservas. Requer aprovação de {conversation.humanAgent || 'um humano'}.</TooltipContent>}
                </Tooltip>
            </div>
          </CardContent>
          <Separator />
          <CardFooter className='p-2'>
             <Button className="w-full" variant="destructive"><LogOut className="mr-2 h-4 w-4"/> Encerrar Atendimento</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
    </TooltipProvider>
  );
}
