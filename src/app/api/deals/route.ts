import { NextResponse } from 'next/server';
import { crmService } from '@/lib/db/services';

/**
 * API route to list CRM deals.
 */
export async function GET() {
  const deals = await crmService.listDeals();
  return NextResponse.json(deals);
}

/**
 * API route to create or update a CRM deal.
 */
export async function POST(request: Request) {
    const body = await request.json();
    // In a real app, you'd have validation here (e.g., with Zod)
    const updatedDeal = await crmService.createOrUpdateDeal(body);
    return NextResponse.json(updatedDeal);
}
