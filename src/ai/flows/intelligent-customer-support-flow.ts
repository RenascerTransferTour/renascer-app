'use server';
/**
 * @fileOverview This file implements a Genkit flow for an intelligent customer support AI.
 * It uses the MAGNUS system prompt for structured, rule-based responses.
 *
 * - intelligentCustomerSupport - A function that handles customer inquiries, gathers information,
 *   provides automated responses, and escalates to human agents when necessary.
 * - IntelligentCustomerSupportInput - The input type for the intelligentCustomerSupport function.
 * - IntelligentCustomerSupportOutput - The return type for the intelligentCustomerSupport function.
 */

import { ai } from '@/ai/genkit';
import { getActiveModel } from '@/ai/utils';
import { z } from 'zod';
import { MAGNUS_SYSTEM_PROMPT } from '@/ai/prompts/magnus';

// Input Schema - remains the same as it provides the necessary context.
const IntelligentCustomerSupportInputSchema = z.object({
  customerMessage: z.string().describe('The latest message from the customer.'),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'model']).describe('The role of the speaker (user or model).'),
    content: z.string().describe('The content of the message.'),
  })).optional().describe('Previous messages in the conversation to provide context.'),
}).describe('Input for the intelligent customer support flow.');

export type IntelligentCustomerSupportInput = z.infer<typeof IntelligentCustomerSupportInputSchema>;

// Output Schema - updated to match the MAGNUS prompt's structured JSON output.
const IntelligentCustomerSupportOutputSchema = z.object({
  should_reply: z.boolean().describe('Indicates if the system should send a reply.'),
  silence_reason: z.string().nullable().describe('Reason for not replying.'),
  language: z.enum(['pt', 'en', 'es']).describe('Detected language of the customer.'),
  customer_type: z.string().describe('Type of customer.'),
  stage: z.string().describe('Current stage of the conversation.'),
  handoff_to_claudia: z.boolean().describe('Indicates if the conversation should be handed off to Claudia.'),
  form_sent: z.boolean().describe('Indicates if the data collection form has been sent.'),
  close_conversation: z.boolean().describe('Indicates if the conversation should be closed for the AI.'),
  service_type: z.string().describe('Detected service type.'),
  intent: z.string().describe('Detected user intent.'),
  collected_data: z.object({
    customer_name: z.string().nullable(),
    origin: z.string().nullable(),
    destination: z.string().nullable(),
    date: z.string().nullable(),
    time: z.string().nullable(),
    passengers: z.number().nullable(),
    bags: z.number().nullable(),
    bag_size: z.string().nullable(),
    child: z.boolean().nullable(),
    region_interest: z.string().nullable(),
    trip_destination_city: z.string().nullable(),
  }),
  messages: z.array(z.string()).describe('A list of messages for the AI to send.'),
});

export type IntelligentCustomerSupportOutput = z.infer<typeof IntelligentCustomerSupportOutputSchema>;

// Wrapper function
export async function intelligentCustomerSupport(
  input: IntelligentCustomerSupportInput
): Promise<IntelligentCustomerSupportOutput> {
  return intelligentCustomerSupportFlow(input);
}

// Prompt definition - now using the imported MAGNUS prompt as a system prompt.
const intelligentCustomerSupportPrompt = ai.definePrompt({
  name: 'intelligentCustomerSupportPrompt',
  system: MAGNUS_SYSTEM_PROMPT,
  input: { schema: IntelligentCustomerSupportInputSchema },
  output: { schema: IntelligentCustomerSupportOutputSchema },
  prompt: `{{#if conversationHistory}}
--- CONVERSATION HISTORY START ---
{{#each conversationHistory}}
{{#if (eq role "user")}}
Customer: {{{content}}}
{{else}}
AI: {{{content}}}
{{/if}}
{{/each}}
--- CONVERSATION HISTORY END ---
{{/if}}

Latest Customer Message: {{{customerMessage}}}`,
});

// Flow definition
const intelligentCustomerSupportFlow = ai.defineFlow(
  {
    name: 'intelligentCustomerSupportFlow',
    inputSchema: IntelligentCustomerSupportInputSchema,
    outputSchema: IntelligentCustomerSupportOutputSchema,
  },
  async (input) => {
    const activeModel = await getActiveModel();
    if (!activeModel) {
        // Return a valid output shape for the error case, respecting the new schema.
        return {
            should_reply: true,
            silence_reason: 'ai_provider_not_configured',
            language: 'pt',
            customer_type: 'unknown',
            stage: 'error',
            handoff_to_claudia: true,
            form_sent: false,
            close_conversation: true,
            service_type: 'unknown',
            intent: 'error',
            collected_data: { customer_name: null, origin: null, destination: null, date: null, time: null, passengers: null, bags: null, bag_size: null, child: null, region_interest: null, trip_destination_city: null },
            messages: ["Desculpe, nosso sistema de IA está temporariamente indisponível. Um atendente humano irá ajudá-lo em breve."]
        };
    }
    const { output } = await intelligentCustomerSupportPrompt(input, { model: activeModel });
    if (!output) {
      // In case the model fails to return a structured output
      return {
            should_reply: true,
            silence_reason: 'ai_failed_to_return_structured_output',
            language: 'pt',
            customer_type: 'unknown',
            stage: 'error',
            handoff_to_claudia: true,
            form_sent: false,
            close_conversation: true,
            service_type: 'unknown',
            intent: 'error',
            collected_data: { customer_name: null, origin: null, destination: null, date: null, time: null, passengers: null, bags: null, bag_size: null, child: null, region_interest: null, trip_destination_city: null },
            messages: ["Ocorreu um problema ao processar sua solicitação com a IA. Um atendente humano irá ajudá-lo."]
        };
    }
    return output;
  }
);
