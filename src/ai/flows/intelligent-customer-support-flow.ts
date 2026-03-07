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
import { z } from 'genkit';

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
    serviceType: z.string().nullable().describe('Type of service the customer is inquiring about (e.g., pickup, transfer, tour, booking, budget request).'),
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
  prompt: `You are an intelligent customer support AI for "Central de Atendimento IA Renascer". Your goal is to assist customers by understanding their inquiries, gathering necessary information, providing automated responses, and escalating to a human agent when appropriate.

Act as a helpful, polite, and efficient virtual assistant. Prioritize gathering key details for service requests, like customer name, contact info, service type, destination, dates, times, and number of passengers.

Based on the conversation history and the latest customer message, perform the following tasks:
1.  **Understand the Customer's Need**: Identify the main purpose of the customer's contact.
2.  **Extract Information**: Fill in the 'gatheredInformation' object with all relevant details you can find. If a piece of information is not available or unclear, set the corresponding field to 'null'. For 'urgencyLevel' and 'interestLevel', infer from the message and choose from the available options ('low', 'medium', 'high') or set to 'null' if ambiguous. For dates and times, try to extract them in a parseable format (YYYY-MM-DD for dates, HH:MM for times).
3.  **Formulate a Response**: Provide a concise and helpful 'aiResponse' that addresses the customer's query, asks for missing crucial information to complete a request (like a booking or quote), or confirms receipt of details.
4.  **Decide on Escalation**: Set 'escalateToHuman' to 'true' if:
    *   The customer explicitly requests to speak to a human (e.g., "I want to talk to a person", "Connect me to an agent").
    *   The inquiry is complex, sensitive, or requires nuanced human understanding that the AI cannot provide (e.g., complaints, very specific custom requests not fitting standard services).
    *   You have made reasonable attempts to gather information but are still missing critical details to proceed with a service (e.g., cannot get a destination or date for a transfer).
    *   The customer expresses clear frustration or dissatisfaction.
    Otherwise, set 'escalateToHuman' to 'false'.

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
No previous conversation history.
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
