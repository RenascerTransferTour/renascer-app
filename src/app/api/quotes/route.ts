import { NextResponse } from 'next/server';
import { quoteService } from '@/lib/db/services';
/**
 * API route to list quotes.
 */
export async function GET() {
  const quotes = await quoteService.listQuotes();
  return NextResponse.json(quotes);
}

/**
 * API route to create or update a quote.
 */
export async function POST(request: Request) {
    const body = await request.json();
    const updatedQuote = await quoteService.createOrUpdateQuote(body);
    return NextResponse.json(updatedQuote);
}
