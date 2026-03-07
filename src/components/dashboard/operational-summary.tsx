'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircle2, XCircle, AlertCircle, Clock, UserCheck } from "lucide-react"
import { Skeleton } from '../ui/skeleton';

interface SummaryData {
    confirmedToday: number;
    unconfirmed: number;
    cancelled24h: number;
    awaitingAction: number;
}

export function OperationalSummary() {
    const [summary, setSummary] = useState<SummaryData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await fetch('/api/dashboard/summary');
                const data = await res.json();
                setSummary(data);
            } catch (error) {
                console.error("Failed to fetch operational summary", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, []);

    const summaryItems = [
        { title: 'Confirmados Hoje', value: summary?.confirmedToday, icon: CheckCircle2, color: 'text-green-500' },
        { title: 'Aguardando Cliente', value: summary?.unconfirmed, icon: AlertCircle, color: 'text-yellow-500' },
        { title: 'Cancelados (24h)', value: summary?.cancelled24h, icon: XCircle, color: 'text-red-500' },
        { title: 'Aguardando Claudia', value: summary?.awaitingAction, icon: UserCheck, color: 'text-orange-500' },
    ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo Operacional</CardTitle>
        <CardDescription>Visão rápida do status atual das operações.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {loading ? (
             summaryItems.map(item => (
                <div key={item.title} className="p-4 rounded-lg bg-muted/50 flex flex-col justify-start items-start gap-2">
                    <Skeleton className="h-7 w-7 rounded-full" />
                    <div>
                        <Skeleton className="h-7 w-12" />
                        <Skeleton className="h-4 w-24 mt-1" />
                    </div>
                </div>
             ))
        ) : (
            summaryItems.map(item => (
                <div key={item.title} className="p-4 rounded-lg bg-muted/50 flex flex-col justify-start items-start gap-2 hover:bg-muted transition-colors">
                    <item.icon className={`h-7 w-7 ${item.color}`} />
                    <div>
                    <p className="text-2xl font-bold">{item.value ?? 0}</p>
                    <p className="text-sm text-muted-foreground">{item.title}</p>
                    </div>
                </div>
            ))
        )}
      </CardContent>
    </Card>
  )
}
