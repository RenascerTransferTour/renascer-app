'use client';

import { useState } from 'react';
import { Paperclip, Send, Mic, Smile, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Conversation, Message } from '@/lib/types';
import { fetchWithDelay, mockMessages } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials, cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';
import { CustomerInfoPanel } from './customer-info-panel';
import { Badge } from '../ui/badge';
import { useToast } from '../ui/use-toast';

interface ConversationPanelProps {
  conversation: Conversation | undefined;
  loading: boolean;
}

export function ConversationPanel({ conversation, loading: listLoading }: ConversationPanelProps) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useState(() => {
    if (conversation) {
      setLoadingMessages(true);
      fetchWithDelay(mockMessages.filter(m => m.conversationId === conversation.id), 300).then(data => {
        setMessages(data);
        setLoadingMessages(false);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation?.id]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !conversation) return;
    setIsSending(true);

    // Simulate API call
    setTimeout(() => {
      const sentMessage: Message = {
        id: `msg-${Date.now()}`,
        conversationId: conversation.id,
        sender: conversation.agent,
        content: newMessage,
        timestamp: new Date().toISOString(),
        type: 'text',
      };
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage('');
      setIsSending(false);
      toast({
        title: "Mensagem Enviada",
        description: "Sua mensagem foi enviada para o cliente.",
      })
    }, 700);
  };

  if (listLoading) {
    return (
        <div className="flex h-full flex-col">
            <div className="flex items-center p-4 border-b">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="ml-3 space-y-1">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                </div>
            </div>
            <div className="flex-1 p-4" />
            <div className="border-t p-4">
                <Skeleton className="h-10 w-full" />
            </div>
        </div>
    );
  }

  if (!conversation) {
    return <div className="flex h-full items-center justify-center text-muted-foreground">Selecione uma conversa</div>;
  }

  return (
    <div className="flex h-full">
      <div className="flex flex-1 flex-col">
        <header className="flex items-center gap-3 border-b p-4">
          <Avatar className="h-10 w-10 border">
            <AvatarImage src={conversation.customerAvatar} alt={conversation.customerName} />
            <AvatarFallback>{getInitials(conversation.customerName)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{conversation.customerName}</p>
            <p className="text-xs text-muted-foreground">
              em <span className="capitalize">{conversation.channel}</span> • Agente: {conversation.agent.name}
            </p>
          </div>
        </header>
        <ScrollArea className="flex-1 p-4">
            {loadingMessages ? <div className='text-center text-muted-foreground'>Carregando histórico...</div> :
                <div className="space-y-4">
                    {messages.map((message) => (
                        message.type === 'suggestion' ? (
                            <div key={message.id} className="relative my-6">
                                <div aria-hidden="true" className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-dashed" />
                                </div>
                                <div className="relative flex justify-center">
                                    <Badge variant="secondary" className="px-3 py-1 text-sm">
                                        <Bot className="mr-2 h-4 w-4" />
                                        Sugestão da IA
                                    </Badge>
                                </div>
                                <div className="mt-4 text-center text-sm text-muted-foreground italic bg-muted p-3 rounded-lg">
                                    {message.content}
                                </div>
                            </div>
                        ) : (
                            <div
                                key={message.id}
                                className={cn(
                                'flex items-end gap-2',
                                message.sender.role === 'Cliente' ? 'justify-start' : 'justify-end'
                                )}
                            >
                                {message.sender.role === 'Cliente' && (
                                <Avatar className="h-8 w-8 border">
                                    <AvatarImage src={message.sender.avatar} />
                                    <AvatarFallback>{getInitials(message.sender.name)}</AvatarFallback>
                                </Avatar>
                                )}
                                <div className={cn('max-w-md rounded-lg p-3', message.sender.role === 'Cliente' ? 'bg-muted' : 'bg-primary text-primary-foreground')}>
                                <p className="text-sm">{message.content}</p>
                                </div>
                                {message.sender.role !== 'Cliente' && (
                                    <Avatar className="h-8 w-8 border">
                                        <AvatarImage src={message.sender.avatar} />
                                        <AvatarFallback>{getInitials(message.sender.name)}</AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        )
                    ))}
                </div>
            }
        </ScrollArea>
        <footer className="border-t p-4">
          <div className="relative">
            <Input 
                placeholder="Digite sua mensagem..." 
                className="pr-28" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              <Button variant="ghost" size="icon"><Paperclip className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon"><Mic className="h-4 w-4" /></Button>
              <Button 
                size="sm" 
                className="mr-2"
                onClick={handleSendMessage}
                disabled={isSending}
              >
                <Send className="mr-2 h-4 w-4" />
                {isSending ? 'Enviando...' : 'Enviar'}
              </Button>
            </div>
          </div>
        </footer>
      </div>
      <CustomerInfoPanel conversation={conversation} />
    </div>
  );
}
