'use client';
import 'react-day-picker/dist/style.css';
import { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { ptBR } from 'date-fns/locale';
import { CalendarEvent } from '@/lib/types';
import { fetchWithDelay, mockCalendarEvents } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { PlusCircle, Clock, CheckCircle, XCircle, Truck, Wrench } from 'lucide-react';
import { Separator } from '../ui/separator';

const eventTypeIcons = {
    booking: Truck,
    task: Wrench,
    reminder: Clock,
} as const;

const eventStatusColors = {
    confirmed: 'bg-green-500',
    pending: 'bg-yellow-500',
    cancelled: 'bg-red-500',
}

export function CalendarContent() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      const data = await fetchWithDelay(mockCalendarEvents, 700);
      setEvents(data);
      setLoading(false);
    };
    loadEvents();
  }, []);

  const EventContent = ({ date }: { date: Date }) => {
    const dayEvents = events.filter(
      (event) => new Date(event.start).toDateString() === date.toDateString()
    );

    return (
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
        {dayEvents.map((event) => (
          <div key={event.id} className={cn('h-1.5 w-1.5 rounded-full', event.color === 'blue' ? 'bg-blue-500' : event.color === 'green' ? 'bg-green-500' : event.color === 'orange' ? 'bg-orange-500' : 'bg-purple-500')} />
        ))}
      </div>
    );
  };
  
  const selectedDayEvents = date ? events.filter(e => new Date(e.start).toDateString() === date.toDateString()) : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Calendário</CardTitle>
                    <CardDescription>Visualize e gerencie todos os eventos.</CardDescription>
                </div>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Novo Agendamento
                </Button>
            </CardHeader>
            <CardContent className="flex justify-center">
                <DayPicker
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    locale={ptBR}
                    className="p-0"
                    components={{
                        DayContent: EventContent,
                    }}
                    classNames={{
                        day: 'h-12 w-12 text-base relative',
                        head_cell: 'w-12',
                    }}
                />
            </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Eventos do dia</CardTitle>
            <CardDescription>{date ? format(date, 'PPP', { locale: ptBR }) : 'Selecione um dia'}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 h-[400px] overflow-y-auto">
            {loading ? (
                Array.from({length: 2}).map((_, i) => (
                    <div key={i} className="p-4 rounded-lg bg-muted animate-pulse h-24"></div>
                ))
            ) : selectedDayEvents.length > 0 ? (
              selectedDayEvents.map(event => {
                const Icon = eventTypeIcons[event.type];
                return (
                    <div key={event.id} className='p-3 rounded-lg border-l-4' style={{ borderColor: event.color }}>
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4 text-muted-foreground" />
                                <span className="font-semibold text-sm">{event.title}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                                {format(new Date(event.start), 'HH:mm')}
                            </span>
                        </div>
                    </div>
                )
              })
            ) : (
              <div className="text-center text-muted-foreground py-10">
                Nenhum evento para este dia.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
