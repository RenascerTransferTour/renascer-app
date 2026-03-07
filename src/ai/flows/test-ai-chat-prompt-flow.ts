'use server';
/**
 * @fileOverview A Genkit flow for administrators to test AI responses and behavior with sample prompts.
 *
 * - testAiChatPrompt - A function that handles the AI prompt testing process.
 * - TestAiChatPromptInput - The input type for the testAiChatPrompt function.
 * - TestAiChatPromptOutput - The return type for the testAiChatPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TestAiChatPromptInputSchema = z.object({
  masterPrompt: z.string().describe('The core instructions or system prompt for the AI.'),
  userPrompt: z.string().describe('The sample prompt provided by the administrator to test the AI.'),
  provider: z.enum(['openai', 'gemini']).optional().describe('The AI provider to use for the test.'),
});
export type TestAiChatPromptInput = z.infer<typeof TestAiChatPromptInputSchema>;

const TestAiChatPromptOutputSchema = z.object({
  response: z.string().describe('The AI generated response based on the master and user prompts.'),
});
export type TestAiChatPromptOutput = z.infer<typeof TestAiChatPromptOutputSchema>;

export async function testAiChatPrompt(input: TestAiChatPromptInput): Promise<TestAiChatPromptOutput> {
  return testAiChatPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'testAiChatPromptBasePrompt',
  input: {schema: TestAiChatPromptInputSchema},
  output: {schema: TestAiChatPromptOutputSchema},
  prompt: `System Prompt (simulating {{provider | 'gemini'}}): {{{masterPrompt}}}

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
    const {output} = await prompt(input);
    if (!output) {
      // Simulate a provider-specific error message
      const providerName = input.provider === 'openai' ? 'OpenAI' : 'Gemini';
      throw new Error(`Failed to get a response from the ${providerName} simulation.`);
    }
    return output;
  }
);
