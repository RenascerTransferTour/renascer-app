import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { calendarEvents } from "@/lib/data"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ChevronLeft, ChevronRight, Circle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

const getEventStyle = (status: string) => {
    switch (status) {
      case 'confirmada':
        return 'bg-green-500 border-green-700 text-white';
      case 'pendente':
        return 'bg-yellow-500 border-yellow-700 text-white';
      case 'cancelada':
        return 'bg-red-500 border-red-700 text-white opacity-75';
      case 'concluída':
        return 'bg-gray-400 border-gray-600 text-white';
      default:
        return 'bg-blue-500 border-blue-700 text-white';
    }
};

const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
// A simple way to create a calendar view for the current month
const today = new Date();
const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
const startingDayOfWeek = firstDayOfMonth.getDay();
const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

const calendarDays = Array.from({ length: 35 }, (_, i) => {
  const day = i - startingDayOfWeek + 1;
  const date = new Date(today.getFullYear(), today.getMonth(), day);
  const events = calendarEvents.filter(e => format(e.start, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));
  const isCurrentMonth = i >= startingDayOfWeek && i < startingDayOfWeek + daysInMonth;
  return { day, date, events, isCurrentMonth };
});


export default function CalendarPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendário de Atividades</h1>
          <p className="text-muted-foreground">
            Acompanhe todos os seus eventos e serviços agendados.
          </p>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" size="icon"><ChevronLeft className="h-4 w-4"/></Button>
            <span className="font-semibold text-lg">{format(new Date(), 'MMMM yyyy', {locale: ptBR})}</span>
            <Button variant="outline" size="icon"><ChevronRight className="h-4 w-4"/></Button>
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
                  {events.map(event => (
                    <div key={event.id} className={cn('text-xs rounded-md p-1.5 cursor-pointer hover:opacity-80 transition-opacity border-l-4', getEventStyle(event.status))}>
                      <p className="font-semibold">{event.title}</p>
                      <p className="text-white/80">{event.type}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
