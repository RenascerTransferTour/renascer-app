import { NextResponse } from 'next/server';
import { dashboardService } from '@/lib/db/services';

export const dynamic = 'force-dynamic';

/**
 * API route for dashboard stats cards.
 */
export async function GET() {
  try {
    const stats = await dashboardService.getStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('API Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}
