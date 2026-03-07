import { NextResponse } from 'next/server';
import { calendarService } from '@/lib/db/services';

/**
 * API route to list calendar events.
 */
export async function GET() {
  try {
    const events = await calendarService.listEvents();
    return NextResponse.json(events);
  } catch (error) {
    console.error('API Error fetching calendar events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}
