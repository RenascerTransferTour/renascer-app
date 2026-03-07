'use client';

import { useEffect, useState } from 'react';
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
  import { format, parseISO } from 'date-fns';
  import { ptBR } from 'date-fns/locale';
  import { PlusCircle, Bot, UserCheck } from "lucide-react"
  import { getStatusBadgeClasses, cn } from "@/lib/utils"
  import type { Reservation, Contact } from '@/lib/db/data-model';
  import { Skeleton } from '@/components/ui/skeleton';

  type ReservationWithContact = Reservation & { contact?: Contact };

  const StatusDisplay = ({ reservation }: { reservation: ReservationWithContact }) => {
    if (reservation.status === 'aguardando aprovação') {
        return <Badge className={cn(getStatusBadgeClasses(reservation.status), 'capitalize')}>Aguardando aprovação da Cláudia</Badge>;
    }
    
    if (reservation.status === 'pendente' && reservation.reservedBy === 'ai') {
        return (
            <Badge className={cn(getStatusBadgeClasses('rascunho'), 'gap-1.5')}>
                <Bot className="h-3.5 w-3.5" />
                Pré-reserva gerada pela IA
            </Badge>
        );
    }
    
     if (reservation.status === 'confirmada' && reservation.reservedBy === 'human') {
        return (
            <Badge className={cn(getStatusBadgeClasses(reservation.status), 'gap-1.5')}>
                <UserCheck className="h-3.5 w-3.5" />
                Confirmada manualmente pela Cláudia
            </Badge>
        );
    }

    const statusText = reservation.status.replace('-', ' ');
    return <Badge className={cn(getStatusBadgeClasses(reservation.status), 'capitalize')}>{statusText}</Badge>;
};


  export default function BookingsPage() {
    const [bookings, setBookings] = useState<ReservationWithContact[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await fetch('/api/reservations');
                const data = await res.json();
                setBookings(data);
            } catch (error) {
                console.error("Failed to fetch bookings", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Gestão de Reservas</h1>
                <p className="text-muted-foreground">
                Visualize e gerencie todas as reservas. A confirmação final de pré-reservas geradas pela IA continua sendo um processo manual.
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
                <TableHead>Situação</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Detalhes</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                        </TableRow>
                    ))
                ) : (
                    bookings.map((booking) => (
                        <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.contact?.fullName || 'N/A'}</TableCell>
                        <TableCell>{booking.service}</TableCell>
                        <TableCell>{format(parseISO(booking.scheduledDate), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</TableCell>
                        <TableCell>
                            <StatusDisplay reservation={booking} />
                        </TableCell>
                        <TableCell>
                           <Badge variant="outline">{booking.reservedBy === 'ai' ? 'Assistente IA' : 'Cláudia Vaz'}</Badge>
                        </TableCell>
                        <TableCell className="max-w-[300px] truncate">{booking.details}</TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
            </Table>
        </div>
      </div>
    )
  }
  
