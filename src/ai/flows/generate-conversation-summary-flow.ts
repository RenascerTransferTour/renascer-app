'use server';
/**
 * @fileOverview A Genkit flow that generates a summary of an ongoing customer conversation.
 *
 * - generateConversationSummary - A function that handles the conversation summary generation process.
 * - GenerateConversationSummaryInput - The input type for the generateConversationSummary function.
 * - GenerateConversationSummaryOutput - The return type for the generateConversationSummary function.
 */

import {ai} from '@/ai/genkit';
import {getActiveModel} from '@/ai/utils';
import {z} from 'zod';
import { settingsService } from '@/lib/db/services';

const GenerateConversationSummaryInputSchema = z.object({
  conversationHistory: z
    .array(
      z.object({
        role: z
          .enum(['user', 'agent', 'AI'])
          .describe('The role of the speaker (user, agent, or AI).'),
        message: z.string().describe('The content of the message.'),
      })
    )
    .describe('A list of messages forming the conversation history.'),
});
export type GenerateConversationSummaryInput = z.infer<
  typeof GenerateConversationSummaryInputSchema
>;

const GenerateConversationSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the conversation.'),
});
export type GenerateConversationSummaryOutput = z.infer<
  typeof GenerateConversationSummaryOutputSchema
>;

export async function generateConversationSummary(
  input: GenerateConversationSummaryInput
): Promise<GenerateConversationSummaryOutput> {
  return generateConversationSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateConversationSummaryPrompt',
  input: {schema: GenerateConversationSummaryInputSchema},
  output: {schema: GenerateConversationSummaryOutputSchema},
  prompt: `You are an AI assistant tasked with summarizing customer conversations for human agents.
Your goal is to provide a concise and clear summary that allows a human agent to quickly understand the context of the conversation and take over effectively.

Conversation History:
{{#each conversationHistory}}
{{this.role}}: {{this.message}}
{{/each}}

Please provide a summary that highlights the main points, customer's needs, and any unresolved issues.`,
});

const generateConversationSummaryFlow = ai.defineFlow(
  {
    name: 'generateConversationSummaryFlow',
    inputSchema: GenerateConversationSummaryInputSchema,
    outputSchema: GenerateConversationSummaryOutputSchema,
  },
  async input => {
    // Enforce Autonomy Rules before executing the flow.
    const settings = await settingsService.getAiSettings();
    const permissions = await settingsService.listPermissions();
    const summaryPermission = permissions.find(p => p.flowName === 'summarization');

    if (!settings.globalAiEnabled) {
        throw new Error("Ação bloqueada: A IA está desativada globalmente.");
    }
    if (!summaryPermission?.enabled) {
        throw new Error("Ação bloqueada: A geração de resumo está desativada nas permissões de fluxo.");
    }

    const activeModel = await getActiveModel();
    const {output} = await prompt(input, {model: activeModel});
    if (!output) {
      throw new Error('Falha ao gerar resumo: a IA não retornou uma resposta estruturada.');
    }
    return output;
  }
);
