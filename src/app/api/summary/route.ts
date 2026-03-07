import { NextResponse } from 'next/server';
import { generateConversationSummary, GenerateConversationSummaryInput } from '@/ai/flows/generate-conversation-summary-flow';
import { settingsService } from '@/lib/db/services';

/**
 * API route to generate an AI-powered conversation summary.
 * This now calls the actual Genkit flow and checks for permissions.
 */
export async function POST(request: Request) {
    try {
        const settings = await settingsService.getAiSettings();
        const permissions = await settingsService.listPermissions();
        
        const summaryPermission = permissions.find(p => p.flowName === 'summarization');

        if (!settings.globalAiEnabled || !summaryPermission?.enabled) {
            const reason = !settings.globalAiEnabled
                ? "A IA está desativada globalmente."
                : "A geração de resumo está desativada nas permissões de fluxo.";
            
            return NextResponse.json({ success: false, error: reason }, { status: 403 });
        }

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
