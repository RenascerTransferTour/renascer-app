import { NextResponse } from 'next/server';
import { generateConversationSummary, GenerateConversationSummaryInput } from '@/ai/flows/generate-conversation-summary-flow';

/**
 * API route to generate an AI-powered conversation summary.
 * This now calls the actual Genkit flow.
 */
export async function POST(request: Request) {
    try {
        const body: GenerateConversationSummaryInput = await request.json();
        
        if (!body.conversationHistory) {
             return NextResponse.json({ success: false, error: 'conversationHistory is required.' }, { status: 400 });
        }

        // In a real app, you might fetch the conversation from a DB first
        // based on an ID, instead of passing the whole history.
        console.log(`[AI Summary API] Generating summary for conversation...`);
        
        const result = await generateConversationSummary({ conversationHistory: body.conversationHistory });
        
        return NextResponse.json({ success: true, summary: result.summary });

    } catch (error) {
        console.error("Error generating summary:", error);
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
        return NextResponse.json({ success: false, error: "Failed to generate AI summary.", details: errorMessage }, { status: 500 });
    }
}
