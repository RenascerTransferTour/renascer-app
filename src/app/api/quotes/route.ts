import { NextResponse } from 'next/server';

/**
 * API route to list quotes.
 */
export async function GET() {
  // Placeholder data
  const mockQuotes = [
    { id: 'quote-1', lead_id: 'lead-1', status: 'draft', final_value: 350 },
    { id: 'quote-2', lead_id: 'lead-2', status: 'sent', final_value: 2000 },
  ];
  return NextResponse.json(mockQuotes);
}

/**
 * API route to create or update a quote.
 */
export async function POST(request: Request) {
    const body = await request.json();
    console.log('[Mock Quote API] Received data for create/update:', body);
    // Placeholder logic
    return NextResponse.json({ success: true, quoteId: `quote_${Date.now()}`, ...body });
}
