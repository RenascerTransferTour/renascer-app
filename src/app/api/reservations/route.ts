import { NextResponse } from 'next/server';
import { reservationService } from '@/lib/db/services';

// Força a rota a ser dinâmica, desabilitando o cache.
// Essencial para que os dados sejam atualizados após um reset do sistema.
export const dynamic = 'force-dynamic';

/**
 * API route to list reservations.
 */
export async function GET() {
  try {
    const reservations = await reservationService.listReservations();
    return NextResponse.json(reservations);
  } catch (error) {
    console.error('API Error fetching reservations:', error);
    return NextResponse.json({ error: 'Failed to fetch reservations' }, { status: 500 });
  }
}

/**
 * API route to create or update a reservation.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const updatedReservation = await reservationService.createOrUpdateReservation(body);
    return NextResponse.json(updatedReservation);
  } catch (error) {
    console.error('API Error creating/updating reservation:', error);
    return NextResponse.json({ error: 'Failed to save reservation' }, { status: 500 });
  }
}
