import { NextResponse } from 'next/server';

/**
 * API route to list CRM deals.
 */
export async function GET() {
  // Placeholder data
  const mockDeals = [
    { id: 'deal-1', lead_id: 'lead-1', pipeline_stage: 'quote_sent', estimated_value: 350 },
    { id: 'deal-2', lead_id: 'lead-2', pipeline_stage: 'won', closed_value: 2000 },
  ];
  return NextResponse.json(mockDeals);
}

/**
 * API route to create or update a CRM deal.
 */
export async function POST(request: Request) {
    const body = await request.json();
    console.log('[Mock Deal API] Received data for create/update:', body);
    // Placeholder logic
    return NextResponse.json({ success: true, dealId: `deal_${Date.now()}`, ...body });
}
