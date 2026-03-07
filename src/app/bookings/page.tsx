import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import { Badge } from "@/components/ui/badge"
  import { Button } from "@/components/ui/button"
  import { bookings, customers } from "@/lib/data"
  import { format, parseISO } from 'date-fns';
  import { ptBR } from 'date-fns/locale';
  import { PlusCircle } from "lucide-react"

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'default';
      case 'completed':
        return 'secondary';
      case 'pending':
        return 'outline';
      case 'canceled':
      case 'rescheduled':
        return 'destructive';
      default:
        return 'outline';
    }
  };
  
  export default function BookingsPage() {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Gestão de Reservas</h1>
                <p className="text-muted-foreground">
                Visualize e gerencie todas as reservas confirmadas e pendentes.
                </p>
            </div>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4"/>
                Criar Reserva
            </Button>
        </div>
        
        <div className="border rounded-lg">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Serviço</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Detalhes</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {bookings.map((booking) => {
                const customer = customers.find(c => c.id === booking.customerId);
                return (
                    <TableRow key={booking.id}>
                    <TableCell className="font-medium">{customer?.name || 'N/A'}</TableCell>
                    <TableCell>{booking.service}</TableCell>
                    <TableCell>{format(parseISO(booking.date), 'dd/MM/yyyy', { locale: ptBR })}</TableCell>
                    <TableCell>
                        <Badge variant={getStatusVariant(booking.status)}>{booking.status}</Badge>
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate">{booking.details}</TableCell>
                    </TableRow>
                )
                })}
            </TableBody>
            </Table>
        </div>
      </div>
    )
  }
  