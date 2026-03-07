'use client';

import { useEffect, useState } from 'react';
import type { Conversation as InboxItem } from "@/lib/types"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { Skeleton } from '@/components/ui/skeleton';

export default function InboxPage() {
  const [data, setData] = useState<InboxItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
        try {
            const res = await fetch('/api/conversations');
            const conversations = await res.json();
            setData(conversations);
        } catch (error) {
            console.error("Failed to fetch conversations:", error);
            // Handle error state in UI
        } finally {
            setLoading(false);
        }
    }
    fetchConversations();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Caixa de Entrada Omnichannel</h1>
        <p className="text-muted-foreground">
          Gerencie todas as suas conversas em um único lugar.
        </p>
      </div>
      {loading ? (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-sm" />
                <Skeleton className="h-10 w-[180px]" />
                <Skeleton className="h-10 w-[180px]" />
            </div>
            <div className="border rounded-md">
                <Skeleton className="h-12 w-full" />
                {Array.from({ length: 10 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full border-t" />
                ))}
            </div>
        </div>
      ) : (
        <DataTable columns={columns} data={data} />
      )}
    </div>
  )
}
