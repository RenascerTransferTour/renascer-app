'use server';
/**
 * @fileOverview A Genkit flow for administrators to test AI responses and behavior with sample prompts.
 *
 * - testAiChatPrompt - A function that handles the AI prompt testing process.
 * - TestAiChatPromptInput - The input type for the testAiChatPrompt function.
 * - TestAiChatPromptOutput - The return type for the testAiChatPrompt function.
 */

import {ai} from '@/ai/genkit';
import {modelRef, type ModelReference} from 'genkit/model';
import {z} from 'zod';
import {settingsService} from '@/lib/db/services';

const TestAiChatPromptInputSchema = z.object({
  masterPrompt: z
    .string()
    .describe('The core instructions or system prompt for the AI.'),
  userPrompt: z
    .string()
    .describe(
      'The sample prompt provided by the administrator to test the AI.'
    ),
  provider: z
    .enum(['openai', 'gemini', 'automatic'])
    .optional()
    .describe('The AI provider to use for the test.'),
});
export type TestAiChatPromptInput = z.infer<typeof TestAiChatPromptInputSchema>;

const TestAiChatPromptOutputSchema = z.object({
  response: z
    .string()
    .describe(
      'The AI generated response based on the master and user prompts.'
    ),
  providerUsed: z
    .string()
    .optional()
    .describe('The actual AI provider used for the generation.'),
  wasBlocked: z
    .boolean()
    .describe('Indicates if the action was blocked by an autonomy rule.'),
  blockReason: z
    .string()
    .optional()
    .describe('The reason why the action was blocked.'),
  fallbackTriggered: z
    .boolean()
    .describe('Indicates if a fallback provider was used.'),
});
export type TestAiChatPromptOutput = z.infer<
  typeof TestAiChatPromptOutputSchema
>;

export async function testAiChatPrompt(
  input: TestAiChatPromptInput
): Promise<TestAiChatPromptOutput> {
  // This is a wrapper function that calls the Genkit flow.
  // The main logic is inside the flow definition.
  return testAiChatPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'testAiChatPromptBasePrompt',
  input: {schema: TestAiChatPromptInputSchema},
  // The output schema for the prompt itself remains simple.
  // The flow will wrap this with additional diagnostic data.
  output: {schema: z.object({response: z.string()})},
  prompt: `System Prompt (simulating a real request): {{{masterPrompt}}}

User Input: {{{userPrompt}}}

Based on the System Prompt, generate a response to the User Input. Your response should adhere to the instructions provided in the System Prompt.`,
});

const testAiChatPromptFlow = ai.defineFlow(
  {
    name: 'testAiChatPromptFlow',
    inputSchema: TestAiChatPromptInputSchema,
    outputSchema: TestAiChatPromptOutputSchema,
  },
  async input => {
    console.log('[AI Test Flow] Received test request:', input);

    // 1. Fetch the latest settings from the mock DB via the service layer.
    const settings = await settingsService.getAiSettings();

    // 2. Enforce Autonomy Rules
    if (!settings.globalAiEnabled) {
      const reason = 'Ação bloqueada: A chave geral da IA está desativada.';
      console.log(`[AI Test Flow] Blocked: ${reason}`);
      return {
        response: '',
        wasBlocked: true,
        blockReason: reason,
        fallbackTriggered: false,
        providerUsed: 'none',
      };
    }
    if (settings.aiMode === 'off') {
      const reason = 'Ação bloqueada: O modo de autonomia da IA está "Desligada".';
      console.log(`[AI Test Flow] Blocked: ${reason}`);
      return {
        response: '',
        wasBlocked: true,
        blockReason: reason,
        fallbackTriggered: false,
        providerUsed: 'none',
      };
    }
    
    // In a real scenario, you'd also check per-channel and per-flow permissions here.
    // For a test, we assume the test flow is always permitted if the global AI is on.

    // 3. Determine which provider to use based on test request and server configuration.
    const testProvider = input.provider || 'automatic';
    const primaryProvider = settings.activeProvider;
    const isGeminiConfigured = !!process.env.GEMINI_API_KEY;
    const isOpenAIConfigured = !!process.env.OPENAI_API_KEY;

    let providerToUse: 'gemini' | 'openai' | null = null;
    let fallbackTriggered = false;
    let desiredProvider = testProvider === 'automatic' ? primaryProvider : testProvider;

    // This logic determines the final provider, including fallback behavior.
    if (desiredProvider === 'gemini') {
        if (isGeminiConfigured) providerToUse = 'gemini';
        else if (settings.isFallbackEnabled && isOpenAIConfigured) {
            providerToUse = 'openai';
            fallbackTriggered = true;
        }
    } else if (desiredProvider === 'openai') {
        if (isOpenAIConfigured) providerToUse = 'openai';
        else if (settings.isFallbackEnabled && isGeminiConfigured) {
            providerToUse = 'gemini';
            fallbackTriggered = true;
        }
    } else { // 'automatic' case
        if (primaryProvider === 'gemini' && isGeminiConfigured) providerToUse = 'gemini';
        else if (primaryProvider === 'openai' && isOpenAIConfigured) providerToUse = 'openai';
        else if (settings.isFallbackEnabled) {
            // If primary is not configured, try the other one as fallback
            if (primaryProvider === 'gemini' && isOpenAIConfigured) {
                providerToUse = 'openai';
                fallbackTriggered = true;
            } else if (primaryProvider === 'openai' && isGeminiConfigured) {
                providerToUse = 'gemini';
                fallbackTriggered = true;
            }
        }
    }

    // If after all logic, no provider could be found, return a clear error.
    if (!providerToUse) {
      const reason =
        'Nenhum provedor de IA está configurado ou disponível. Verifique suas chaves de API no ambiente do servidor.';
      console.error(`[AI Test Flow] Error: ${reason}`);
      return {
        response: '',
        wasBlocked: true,
        blockReason: reason,
        fallbackTriggered: false,
        providerUsed: 'none',
      };
    }
    
    console.log(`[AI Test Flow] Provider selected: ${providerToUse}. Fallback: ${fallbackTriggered}`);

    // 4. Select the model reference based on the chosen provider.
    const modelToUse =
      providerToUse === 'openai'
        ? modelRef('openai/gpt-4-turbo')
        : modelRef('googleai/gemini-2.5-flash');

    // 5. Execute the AI prompt and handle potential errors.
    try {
        const {output} = await prompt(input, {model: modelToUse});

        if (!output) {
          throw new Error(
            `A IA não retornou uma resposta estruturada.`
          );
        }
        
        console.log('[AI Test Flow] Test successful.');
        return {
            response: output.response,
            providerUsed: providerToUse,
            wasBlocked: false,
            fallbackTriggered: fallbackTriggered,
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred during AI generation.';
        console.error(`[AI Test Flow] Test failed for provider ${providerToUse}:`, errorMessage);
        // This is a failure in the AI call itself, not a policy block.
        return {
            response: '',
            wasBlocked: true, // We'll count this as a "block" to show an error state in the UI.
            blockReason: `O teste de simulação falhou: ${errorMessage}`,
            fallbackTriggered: fallbackTriggered,
            providerUsed: providerToUse,
        };
    }
  }
);
