import { NextResponse } from 'next/server';
import { dashboardService } from '@/lib/db/services';

export const dynamic = 'force-dynamic';

/**
 * API route for the operational summary panel.
 */
export async function GET() {
  try {
    const summary = await dashboardService.getOperationalSummary();
    return NextResponse.json(summary);
  } catch (error) {
    console.error('API Error fetching operational summary:', error);
    return NextResponse.json({ error: 'Failed to fetch operational summary' }, { status: 500 });
  }
}
