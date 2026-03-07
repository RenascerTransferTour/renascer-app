'use server';
/**
 * @fileOverview A Genkit flow for administrators to test AI responses and behavior with sample prompts.
 *
 * - testAiChatPrompt - A function that handles the AI prompt testing process.
 * - TestAiChatPromptInput - The input type for the testAiChatPrompt function.
 * - TestAiChatPromptOutput - The return type for the testAiChatPrompt function.
 */

import {ai} from '@/ai/genkit';
import {model, type ModelReference} from 'genkit/model';
import {z} from 'genkit';
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

    const settings = await settingsService.getAiSettings();

    // 1. Validate against global and autonomy settings
    if (!settings.globalAiEnabled) {
      const reason = 'Ação bloqueada: A chave geral da IA está desativada.';
      console.log(`[AI Test Flow] Blocked: ${reason}`);
      return {
        response: '',
        wasBlocked: true,
        blockReason: reason,
        fallbackTriggered: false,
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
      };
    }

    const testProvider = input.provider || 'automatic';
    const primaryProvider = settings.activeProvider;
    const isGeminiConfigured = !!process.env.GEMINI_API_KEY;
    const isOpenAIConfigured = !!process.env.OPENAI_API_KEY;

    let providerToUse: 'gemini' | 'openai' | null = null;
    let fallbackTriggered = false;
    let desiredProvider = testProvider === 'automatic' ? primaryProvider : testProvider;

    // 2. Determine which provider to use
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
    } else { // Automatic
        if (primaryProvider === 'gemini' && isGeminiConfigured) providerToUse = 'gemini';
        else if (primaryProvider === 'openai' && isOpenAIConfigured) providerToUse = 'openai';
        else if (isGeminiConfigured) providerToUse = 'gemini';
        else if (isOpenAIConfigured) providerToUse = 'openai';
    }


    if (!providerToUse) {
      const reason =
        'Nenhum provedor de IA está configurado ou disponível. Verifique suas chaves de API no ambiente do servidor.';
      console.error(`[AI Test Flow] Error: ${reason}`);
      throw new Error(reason);
    }
    
    console.log(`[AI Test Flow] Provider selected: ${providerToUse}. Fallback: ${fallbackTriggered}`);

    const modelToUse =
      providerToUse === 'openai'
        ? model('openai/gpt-4-turbo')
        : model('googleai/gemini-2.5-flash');

    const {output} = await prompt(input, {model: modelToUse});

    if (!output) {
      throw new Error(
        `Falha ao obter resposta da simulação do provedor ${providerToUse}.`
      );
    }
    
    return {
        response: output.response,
        providerUsed: providerToUse,
        wasBlocked: false,
        fallbackTriggered: fallbackTriggered,
    };
  }
);
