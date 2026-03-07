import { NextResponse } from 'next/server';
import { testAiChatPrompt, TestAiChatPromptInput } from '@/ai/flows/test-ai-chat-prompt-flow';

/**
 * API route to run a test of the AI prompt.
 * This route acts as a secure bridge between the client-side test form
 * and the server-side Genkit flow, ensuring no business logic or keys
 * are on the client.
 */
export async function POST(request: Request) {
    try {
        const body: TestAiChatPromptInput = await request.json();
        
        // Input validation
        if (!body.masterPrompt || !body.userPrompt) {
             return NextResponse.json({ success: false, error: 'masterPrompt and userPrompt are required.' }, { status: 400 });
        }

        // Call the server-side Genkit flow.
        // This flow contains all the logic for autonomy checks, provider selection, and error handling.
        const result = await testAiChatPrompt(body);
        
        // The flow itself returns a structured object, which we can pass directly to the client.
        return NextResponse.json(result);

    } catch (error) {
        // This catch block handles unexpected errors in the route handler itself,
        // not errors from the AI flow (which are handled within the flow and returned as part of the result object).
        console.error("[API /ai/test] Unexpected error:", error);
        const errorMessage = error instanceof Error ? error.message : 'An unexpected server error occurred.';
        
        // Return a structured JSON error instead of an HTML page.
        return NextResponse.json(
            { 
                response: '',
                wasBlocked: true, 
                blockReason: `Erro inesperado no servidor: ${errorMessage}`,
                fallbackTriggered: false,
                providerUsed: 'none'
            }, 
            { status: 500 }
        );
    }
}
