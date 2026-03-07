import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { calendarEvents } from "@/lib/data"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ChevronLeft, ChevronRight } from "lucide-react"

const typeColors = {
  Pickup: 'bg-blue-500',
  Transfer: 'bg-green-500',
  Tour: 'bg-purple-500',
  Booking: 'bg-yellow-500',
};

const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const calendarDays = Array.from({ length: 35 }, (_, i) => {
  const day = i - 3; // Start from a few days before the 1st
  const date = new Date(new Date().setDate(day + 1));
  const events = calendarEvents.filter(e => format(e.start, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));
  return { day: day + 1, date, events };
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
            <span className="font-semibold">{format(new Date(), 'MMMM yyyy', {locale: ptBR})}</span>
            <Button variant="outline" size="icon"><ChevronRight className="h-4 w-4"/></Button>
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="grid grid-cols-7 border-t border-r rounded-t-lg">
            {daysOfWeek.map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground border-l border-b">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 grid-rows-5 border-b border-r rounded-b-lg">
            {calendarDays.map(({ day, date, events }, index) => (
              <div key={index} className="h-36 p-2 border-l border-t relative overflow-hidden">
                <span className={`text-sm ${format(date, 'MM') === format(new Date(), 'MM') ? 'text-foreground' : 'text-muted-foreground'}`}>{format(date, 'd')}</span>
                <div className="mt-1 space-y-1">
                  {events.map(event => (
                    <div key={event.id} className={`${typeColors[event.type]} text-white text-xs rounded-md p-1 truncate cursor-pointer hover:opacity-80`}>
                      {event.title}
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
