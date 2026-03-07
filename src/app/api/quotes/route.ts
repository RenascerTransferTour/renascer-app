import { NextResponse } from 'next/server';
import { quoteService } from '@/lib/db/services';
/**
 * API route to list quotes.
 */
export async function GET() {
  try {
    const quotes = await quoteService.listQuotes();
    return NextResponse.json(quotes);
  } catch (error) {
    console.error('API Error fetching quotes:', error);
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 });
  }
}

/**
 * API route to create or update a quote.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const updatedQuote = await quoteService.createOrUpdateQuote(body);
    return NextResponse.json(updatedQuote);
  } catch (error) {
    console.error('API Error creating/updating quote:', error);
    return NextResponse.json({ error: 'Failed to save quote' }, { status: 500 });
  }
}
