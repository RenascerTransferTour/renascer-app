import { NextResponse } from 'next/server';

/**
 * API route to generate an AI-powered conversation summary.
 * This would call a service that uses Genkit.
 */
export async function POST(request: Request) {
    const { conversation_id } = await request.json();
    console.log(`[Mock AI Summary API] Generating summary for conversation: ${conversation_id}`);
    
    // Placeholder: In the future, this will call `aiService.generateSummary(conversation_id)`
    const mockSummary = "The client, Ana Silva, requested a transfer to GRU airport for day 28 at 3 PM, departing from Av. Paulista. The conversation was handed off to Claudia for a formal quote.";

    return NextResponse.json({ success: true, summary: mockSummary });
}
