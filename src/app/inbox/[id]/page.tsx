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
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
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

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const msg: Message = {
      id: `msg-${Date.now()}`,
      role: 'agent',
      content: newMessage,
      timestamp: new Date().toISOString(),
      authorName: 'Admin',
    };

    setMessages([...messages, msg]);
    setNewMessage('');
  };
  
  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
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

  return (
    <div className="grid h-[calc(100vh-8rem)] grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
      <div className="md:col-span-2 lg:col-span-3 flex flex-col h-full bg-card border rounded-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-lg font-semibold">{customer.name}</h2>
            <p className="text-sm text-muted-foreground">
              em{' '}
              <span className="font-medium text-primary">
                {conversation.channel}
              </span>
            </p>
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
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">{summary || "Nenhum resumo gerado ainda."}</p>
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
        </div>
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex items-end gap-2',
                  message.role === 'user' ? 'justify-start' : 'justify-end'
                )}
              >
                {message.role === 'user' && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={customer.avatar} data-ai-hint="person avatar" />
                    <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-xs rounded-lg p-3 md:max-w-md',
                    message.role === 'user'
                      ? 'bg-muted'
                      : 'bg-primary text-primary-foreground'
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
        <div className="p-4 border-t">
          <div className="relative">
            <Input
              placeholder="Digite sua mensagem..."
              className="pr-12"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
              onClick={handleSendMessage}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="hidden md:block h-full">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Detalhes do Cliente</CardTitle>
            <CardDescription>{customer.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Telefone</span>
              <span>{customer.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Canal</span>
              <span>{customer.originChannel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Interesse</span>
              <span>{customer.interestLevel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Urgência</span>
              <span>{customer.urgency}</span>
            </div>
            <Separator />
            <div className="space-y-2">
                <Button className="w-full" variant="outline"><FileText className="mr-2 h-4 w-4"/> Criar Orçamento</Button>
                <Button className="w-full" variant="outline"><Bookmark className="mr-2 h-4 w-4"/> Criar Reserva</Button>
                <Button className="w-full" variant="destructive"><LogOut className="mr-2 h-4 w-4"/> Encerrar</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
