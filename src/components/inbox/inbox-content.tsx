'use client';
import { useState, useEffect } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ConversationList } from './conversation-list';
import { ConversationPanel } from './conversation-panel';
import { fetchWithDelay, mockConversations } from '@/lib/mock-data';
import type { Conversation } from '@/lib/types';

interface InboxContentProps {
  selectedConversationId?: string;
}

export function InboxContent({ selectedConversationId }: InboxContentProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  
  const selectedConversation = selectedConversationId 
    ? conversations.find(c => c.id === selectedConversationId)
    : conversations[0];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchWithDelay(mockConversations, 500);
      setConversations(data);
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full max-h-[calc(100vh-8rem)] items-stretch">
      <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
        <ConversationList conversations={conversations} loading={loading} selectedConversationId={selectedConversation?.id} />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={70}>
        <ConversationPanel conversation={selectedConversation} loading={loading} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
