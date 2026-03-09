'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn, getInitials } from '@/lib/utils';
import { Conversation } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';

interface ConversationListProps {
  conversations: Conversation[];
  loading: boolean;
  selectedConversationId?: string;
}

export function ConversationList({ conversations, loading, selectedConversationId }: ConversationListProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="p-4">
        <h2 className="text-xl font-bold">Inbox</h2>
      </div>
      <div className="p-4 pt-0">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar conversas..." className="pl-8" />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-1 p-4 pt-0">
          {loading ? (
             Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-full" />
                    </div>
                </div>
            ))
          ) : conversations.map((conv) => (
            <Link
              key={conv.id}
              href={`/inbox/${conv.id}`}
              className={cn(
                'flex items-start gap-3 rounded-lg p-3 text-left text-sm transition-all hover:bg-accent',
                selectedConversationId === conv.id && 'bg-accent'
              )}
            >
              <Avatar className="h-10 w-10 border">
                <AvatarImage src={conv.customerAvatar} alt={conv.customerName} />
                <AvatarFallback>{getInitials(conv.customerName)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{conv.customerName}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(conv.lastMessageTimestamp), { locale: ptBR, addSuffix: true })}
                  </p>
                </div>
                <p className="line-clamp-1 text-xs text-muted-foreground">{conv.lastMessage}</p>
              </div>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
