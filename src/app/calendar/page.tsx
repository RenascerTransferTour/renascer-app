'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ChevronLeft, ChevronRight, Bot, UserCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import type { CalendarEvent } from '@/lib/db/data-model';

const getEventStyle = (status: string) => {
    switch (status) {
      case 'confirmada':
        return 'bg-green-500 border-green-700 text-white';
      case 'pendente':
        return 'bg-yellow-500 border-yellow-700 text-white';
      case 'aguardando aprovação':
        return 'bg-orange-500 border-orange-700 text-white';
      case 'cancelada':
        return 'bg-red-500 border-red-700 text-white opacity-75';
      case 'concluída':
        return 'bg-gray-400 border-gray-600 text-white';
      default:
        return 'bg-blue-500 border-blue-700 text-white';
    }
};

const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const getCalendarGrid = (date: Date, events: CalendarEvent[]) => {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const startingDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    return Array.from({ length: 35 }, (_, i) => {
        const day = i - startingDayOfWeek + 1;
        const currentDate = new Date(date.getFullYear(), date.getMonth(), day);
        const dateStr = format(currentDate, 'yyyy-MM-dd');
        
        const dayEvents = events.filter(e => format(parseISO(e.start), 'yyyy-MM-dd') === dateStr);
        const isCurrentMonth = i >= startingDayOfWeek && i < startingDayOfWeek + daysInMonth;
        
        return { day, date: currentDate, events: dayEvents, isCurrentMonth };
    });
};


export default function CalendarPage() {
    const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/calendar');
                const data = await res.json();
                setCalendarEvents(data);
            } catch (error) {
                console.error("Failed to fetch calendar events", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const calendarDays = getCalendarGrid(currentDate, calendarEvents);

    const handleMonthChange = (offset: number) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendário de Atividades</h1>
          <p className="text-muted-foreground">
            Visualize todos os eventos. Sugestões de horários da IA devem ser confirmadas manualmente pela Cláudia.
          </p>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => handleMonthChange(-1)}><ChevronLeft className="h-4 w-4"/></Button>
            <span className="font-semibold text-lg capitalize">{format(currentDate, 'MMMM yyyy', {locale: ptBR})}</span>
            <Button variant="outline" size="icon" onClick={() => handleMonthChange(1)}><ChevronRight className="h-4 w-4"/></Button>
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="grid grid-cols-7 border-t border-r rounded-t-lg">
            {daysOfWeek.map(day => (
              <div key={day} className="p-3 text-center text-sm font-semibold text-muted-foreground border-l border-b bg-muted/50">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 grid-rows-5 border-b border-r rounded-b-lg">
            {calendarDays.map(({ day, date, events, isCurrentMonth }, index) => (
              <div 
                key={index} 
                className={cn(
                    "h-36 p-2 border-l border-t relative overflow-auto flex flex-col",
                    isCurrentMonth ? 'bg-background' : 'bg-muted/30'
                )}
              >
                <span className={`text-sm font-semibold ${isCurrentMonth ? 'text-foreground' : 'text-muted-foreground/50'}`}>{isCurrentMonth ? format(date, 'd') : ''}</span>
                <div className="mt-1 space-y-1 flex-1">
                  {events.map(event => {
                    let subText = event.eventType;
                    let Icon = null;

                    if (event.status === 'pendente' && event.source === 'ai') {
                        subText = 'Horário sugerido pela IA';
                        Icon = Bot;
                    } else if (event.status === 'aguardando aprovação') {
                        subText = 'Aguardando aprovação';
                        Icon = UserCheck;
                    } else if (event.status === 'confirmada' && event.source === 'human') {
                        subText = 'Agendado manualmente';
                    }

                    return (
                        <div key={event.id} className={cn('text-xs rounded-md p-1.5 cursor-pointer hover:opacity-80 transition-opacity border-l-4', getEventStyle(event.status))}>
                          <div className="flex items-start gap-1.5">
                            {Icon && <Icon className="h-3 w-3 mt-0.5 shrink-0" />}
                            <div className='min-w-0'>
                                <p className="font-semibold truncate">{event.title}</p>
                                <p className="text-white/80">{subText}</p>
                            </div>
                          </div>
                        </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
