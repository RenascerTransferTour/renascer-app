import { NextResponse } from 'next/server';
import { generateConversationSummary, GenerateConversationSummaryInput } from '@/ai/flows/generate-conversation-summary-flow';

/**
 * API route to generate an AI-powered conversation summary.
 * This route now calls the Genkit flow which contains its own permission checks.
 */
export async function POST(request: Request) {
    try {
        const body: GenerateConversationSummaryInput = await request.json();
        
        if (!body.conversationHistory) {
             return NextResponse.json({ success: false, error: 'conversationHistory is required.' }, { status: 400 });
        }

        // The generateConversationSummary flow now contains its own autonomy checks.
        // If an action is blocked, it will throw an error, which will be caught here.
        console.log(`[AI Summary API] Generating summary for conversation...`);
        const result = await generateConversationSummary({ conversationHistory: body.conversationHistory });
        
        return NextResponse.json({ success: true, summary: result.summary });

    } catch (error) {
        console.error("[API /summary] Error generating summary:", error);
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
        
        // If the error message indicates a blocked action, return a 403 Forbidden status.
        const isBlocked = /Ação bloqueada/i.test(errorMessage);
        const status = isBlocked ? 403 : 500;

        return NextResponse.json({ 
            success: false, 
            error: isBlocked ? "Não foi possível gerar o resumo." : "Falha ao gerar resumo de IA.",
            details: errorMessage 
        }, { status });
    }
}
