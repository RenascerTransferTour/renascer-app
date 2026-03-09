import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { mockDashboardData } from '@/lib/mock-data';
import { getInitials } from '@/lib/utils';

type Booking = (typeof mockDashboardData.upcomingBookings)[0];

interface UpcomingBookingsProps {
  loading: boolean;
  bookings: Booking[] | undefined;
}

export function UpcomingBookings({ loading, bookings }: UpcomingBookingsProps) {
    if (loading) {
        return (
            <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                        <Skeleton className="h-9 w-9 rounded-full" />
                        <div className="grid gap-1 flex-1">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                        <Skeleton className="h-4 w-12" />
                    </div>
                ))}
            </div>
        )
    }

  return (
    <div className="space-y-6">
      {bookings?.map((booking) => (
        <div key={booking.id} className="flex items-center gap-4">
          <Avatar className="hidden h-9 w-9 sm:flex">
            <AvatarImage src={`https://picsum.photos/seed/${booking.id}/100/100`} alt="Avatar" />
            <AvatarFallback>{getInitials(booking.customerName)}</AvatarFallback>
          </Avatar>
          <div className="grid gap-1 flex-1">
            <p className="text-sm font-medium leading-none">{booking.customerName}</p>
            <p className="text-sm text-muted-foreground">{booking.service}</p>
          </div>
          <div className="ml-auto font-medium">{booking.time}</div>
        </div>
      ))}
       {!bookings?.length && (
            <div className="text-center py-10">
                <p className="text-muted-foreground">Nenhum agendamento para hoje.</p>
            </div>
        )}
    </div>
  );
}
