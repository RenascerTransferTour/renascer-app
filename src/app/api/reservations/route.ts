import { NextResponse } from 'next/server';
import { reservationService } from '@/lib/db/services';

/**
 * API route to list reservations.
 */
export async function GET() {
  const reservations = await reservationService.listReservations();
  return NextResponse.json(reservations);
}

/**
 * API route to create or update a reservation.
 */
export async function POST(request: Request) {
    const body = await request.json();
    const updatedReservation = await reservationService.createOrUpdateReservation(body);
    return NextResponse.json(updatedReservation);
}
