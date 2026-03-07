'use server';
/**
 * @fileOverview This file implements a Genkit flow for an intelligent customer support AI.
 *
 * - intelligentCustomerSupport - A function that handles customer inquiries, gathers information,
 *   provides automated responses, and escalates to human agents when necessary.
 * - IntelligentCustomerSupportInput - The input type for the intelligentCustomerSupport function.
 * - IntelligentCustomerSupportOutput - The return type for the intelligentCustomerSupport function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Input Schema
const IntelligentCustomerSupportInputSchema = z.object({
  customerMessage: z.string().describe('The latest message from the customer.'),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'model']).describe('The role of the speaker (user or model).'),
    content: z.string().describe('The content of the message.'),
  })).optional().describe('Previous messages in the conversation to provide context.'),
}).describe('Input for the intelligent customer support flow.');

export type IntelligentCustomerSupportInput = z.infer<typeof IntelligentCustomerSupportInputSchema>;

// Output Schema
const IntelligentCustomerSupportOutputSchema = z.object({
  aiResponse: z.string().describe('The AI\'s response to the customer.'),
  escalateToHuman: z.boolean().describe('True if the conversation needs to be escalated to a human agent, false otherwise.'),
  gatheredInformation: z.object({
    customerName: z.string().nullable().describe('Name of the customer, if provided.'),
    customerPhone: z.string().nullable().describe('Phone number of the customer, if provided.'),
    originChannel: z.string().nullable().describe('Channel through which the customer is contacting (e.g., WhatsApp, Instagram).'),
    serviceType: z.string().nullable().describe('Type of service the customer is inquiring about (e.g., Transfer, Turismo, Executivo, Corporativo, Eventos, Viagens Longas).'),
    destination: z.string().nullable().describe('Desired destination, if applicable.'),
    departureDate: z.string().nullable().describe('Requested departure date, in a YYYY-MM-DD format if possible.'),
    departureTime: z.string().nullable().describe('Requested departure time, in a HH:MM format if possible.'),
    numberOfPassengers: z.number().nullable().describe('Number of passengers, if specified.'),
    luggageDetails: z.string().nullable().describe('Details about luggage, if mentioned.'),
    urgencyLevel: z.enum(['low', 'medium', 'high']).nullable().describe('Urgency level of the request, if implied or stated.'),
    interestLevel: z.enum(['low', 'medium', 'high']).nullable().describe('Customer\'s interest level, if implied or stated.'),
    observations: z.string().nullable().describe('Any other relevant observations or details.'),
  }).describe('Structured information extracted from the conversation.'),
}).describe('Output from the intelligent customer support flow.');

export type IntelligentCustomerSupportOutput = z.infer<typeof IntelligentCustomerSupportOutputSchema>;

// Wrapper function
export async function intelligentCustomerSupport(
  input: IntelligentCustomerSupportInput
): Promise<IntelligentCustomerSupportOutput> {
  return intelligentCustomerSupportFlow(input);
}

// Prompt definition
const intelligentCustomerSupportPrompt = ai.definePrompt({
  name: 'intelligentCustomerSupportPrompt',
  input: { schema: IntelligentCustomerSupportInputSchema },
  output: { schema: IntelligentCustomerSupportOutputSchema },
  prompt: `You are a premium virtual assistant for "Renascer Transfer Tour", specializing in executive transport, transfers, and tours. Your tone is professional, welcoming, and efficient.

Your primary goals are:
1.  **Welcome the user warmly**: Start with a professional and friendly greeting, introducing yourself as the virtual assistant for Renascer Transfer Tour.
2.  **Understand the user's need**: Quickly identify if they need a 'Transfer', 'Turismo', 'Transporte Executivo', 'Serviço para Eventos', or 'Viagem Longa'.
3.  **Extract Information**: Fill in the 'gatheredInformation' object with all relevant details you can find from the entire conversation. If a piece of information is not available or unclear, set the corresponding field to 'null'.
    - For 'urgencyLevel' and 'interestLevel', infer from the message tone and content.
    - For dates and times, try to extract them in a parseable format (YYYY-MM-DD for dates, HH:MM for times).
4.  **Formulate a Response**: Provide a concise and helpful 'aiResponse' that either:
    - Addresses the customer's query directly.
    - Asks for missing crucial information needed for a quote or booking (e.g., origin, destination, date, number of passengers).
    - Confirms receipt of details and informs what the next step is.
5.  **Decide on Escalation**: Set 'escalateToHuman' to 'true' only if:
    - The customer explicitly requests to speak to a human (e.g., "quero falar com uma pessoa", "falar com atendente").
    - The inquiry is about a complaint, a very complex event, or a sensitive matter.
    - The customer expresses clear frustration or confusion.
    - You have already asked for key information twice and the customer has not provided it.
    Otherwise, set 'escalateToHuman' to 'false' and continue the automated service.

Conversation History:
{{#if conversationHistory}}
{{#each conversationHistory}}
{{#if (eq role "user")}}
Customer: {{{content}}}
{{else}}
AI: {{{content}}}
{{/if}}
{{/each}}
{{else}}
No previous conversation history. This is the first message.
{{/if}}

Latest Customer Message: {{{customerMessage}}}`
});

// Flow definition
const intelligentCustomerSupportFlow = ai.defineFlow(
  {
    name: 'intelligentCustomerSupportFlow',
    inputSchema: IntelligentCustomerSupportInputSchema,
    outputSchema: IntelligentCustomerSupportOutputSchema,
  },
  async (input) => {
    const { output } = await intelligentCustomerSupportPrompt(input);
    return output!;
  }
);
