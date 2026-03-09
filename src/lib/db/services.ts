/**
 * @fileoverview Service Layer
 * 
 * This file contains the business logic of the application. Services orchestrate
 * data flow by using one or more repositories, enforcing business rules, and
 * providing a high-level API for the application's use cases (e.g., to be called
 * by API Routes or Server Actions).
 * 
 * This separation of concerns makes the application more modular, testable,
 * and easier to maintain.
 */

import * as repos from './repositories';
import type { Conversation, Contact, Quote, Reservation, Deal, Channel, AiFlowPermission, AiSettings, AiPrompt, AuditLog, Message } from './data-model';

export const conversationService = {
  /**
   * Lists all conversations, enriching them with contact details.
   * This is a common pattern for a service: combining data from multiple sources.
   */
  async listConversations(): Promise<(Conversation & { contact: Contact })[]> {
    const conversations = await repos.conversations.list();
    const contacts = await repos.contacts.list();
    
    // In a real database, this would be a JOIN query for performance.
    // Here, we simulate it with a map-reduce operation.
    return conversations.map(conv => {
      const contact = contacts.find(c => c.id === conv.contactId);
      if (!contact) {
        // In a real app, you'd want more robust error handling or logging.
        console.warn(`Contact not found for conversation ${conv.id}`);
        // Fallback to a placeholder contact
        return { 
          ...conv, 
          contact: { 
            id: 'unknown', 
            fullName: 'Contato Desconhecido', 
            avatar: '', 
            language: 'pt-BR', 
            isInternal: false,
            createdAt: conv.createdAt,
            updatedAt: conv.updatedAt,
          }
        };
      }
      return { ...conv, contact };
    });
  },

  /**
   * Finds a single conversation and its full message history.
   */
  async getConversationDetails(id: string) {
    const conversation = await repos.conversations.findById(id);
    if (!conversation) return null;

    const contact = await repos.contacts.findById(conversation.contactId);
    if (!contact) return null;
    
    const messages = await repos.messages.findByConversationId(id);
    const auditLogs = await repos.auditLogs.findByContactId(conversation.contactId);

    return {
      ...conversation,
      contact,
      messages,
      auditLogs,
    };
  },

  /**
   * Adds a new message to a conversation and updates the conversation's state.
   * @param conversationId The ID of the conversation.
   * @param content The text content of the message.
   * @param sender Details of the sender (agent or system).
   * @returns The newly created message.
   */
  async addMessage(conversationId: string, content: string, sender: { type: 'agent' | 'system', id: string, name: string }): Promise<Message> {
    const conversation = await repos.conversations.findById(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    const newMessage: Omit<Message, 'createdAt' | 'updatedAt'> = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderType: sender.type,
      authorName: sender.name,
      content,
      contentType: 'text',
      deliveryStatus: 'sent',
    };

    // 1. Persist the new message
    const createdMessage = await repos.messages.createOrUpdate(newMessage as Message);

    // 2. Update the parent conversation's last message details
    conversation.lastMessage = createdMessage.content;
    conversation.lastMessageAt = createdMessage.createdAt;
    if (sender.type === 'agent') {
      conversation.isAiActive = false; // Human sent a message
      conversation.humanOwnerId = sender.id;
    }
    await repos.conversations.createOrUpdate(conversation);

    return createdMessage;
  }
};

export const quoteService = {
  async listQuotes() {
    const quotes = await repos.quotes.list();
    const contacts = await repos.contacts.list();
    const operators = await repos.operators.list();

    return quotes.map(quote => {
        const contact = contacts.find(c => c.id === quote.contactId);
        const owner = operators.find(o => o.id === quote.ownerId);
        return {
            ...quote,
            contact,
            ownerName: owner?.fullName || 'N/A',
        }
    })
  },
  async createOrUpdateQuote(quote: Quote) {
    return repos.quotes.createOrUpdate(quote);
  }
}

export const reservationService = {
    async listReservations() {
        const reservations = await repos.reservations.list();
        const contacts = await repos.contacts.list();
        return reservations.map(res => {
            const contact = contacts.find(c => c.id === res.contactId);
            return {
                ...res,
                contact,
            }
        });
    },
    async createOrUpdateReservation(reservation: Reservation) {
        return repos.reservations.createOrUpdate(reservation);
    }
}

export const crmService = {
    async listDeals() {
        const deals = await repos.deals.list();
        const contacts = await repos.contacts.list();
        const operators = await repos.operators.list();
        return deals.map(deal => {
            const contact = contacts.find(c => c.id === deal.contactId);
            const owner = operators.find(o => o.id === deal.ownerId);
            return {
                ...deal,
                contact,
                ownerName: owner?.fullName || (deal.ownerId === 'IA' ? 'Assistente IA' : 'N/A')
            }
        })
    },
    async createOrUpdateDeal(deal: Deal) {
        return repos.deals.createOrUpdate(deal);
    }
}

export const settingsService = {
    async getAiSettings() {
        return repos.aiSettings.get();
    },
    async updateAiSettings(settings: Partial<AiSettings>) {
        return repos.aiSettings.update(settings);
    },
    async listChannels() {
        return repos.channels.list();
    },
    async updateChannels(channels: Channel[]) {
        return repos.channels.batchUpdate(channels);
    },
    async listPrompts() {
        return repos.aiPrompts.list();
    },
    async updatePrompt(prompt: AiPrompt) {
        return repos.aiPrompts.update(prompt);
    },
    async publishDraftPrompt() {
        return repos.aiPrompts.publishDraft();
    },
    async listPermissions() {
        return repos.aiFlowPermissions.list();
    },
    async updatePermissions(permissions: AiFlowPermission[]) {
        return repos.aiFlowPermissions.batchUpdate(permissions);
    }
}

export const dashboardService = {
    async getOperationalSummary() {
        const reservations = await repos.reservations.list();
        const conversations = await repos.conversations.list();

        const confirmedToday = reservations.filter(r => r.status === 'confirmada' && new Date(r.createdAt).toDateString() === new Date().toDateString()).length;
        const unconfirmed = reservations.filter(r => r.status === 'não confirmado').length;
        const cancelled24h = reservations.filter(r => r.status === 'cancelada' && new Date(r.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length;
        const awaitingAction = conversations.filter(c => c.status === 'aguardando humano').length;

        return { confirmedToday, unconfirmed, cancelled24h, awaitingAction };
    },

    async getStats() {
        const conversations = await repos.conversations.list();
        const reservations = await repos.reservations.list();
        const quotes = await repos.quotes.list();

        const awaitingHuman = conversations.filter(c => c.status === 'aguardando humano').length;
        const concludedByAI = reservations.filter(q => q.reservedBy === 'ai' && q.status === 'concluída').length;
        
        return {
            newContactsToday: 12, // Mock
            activeConversations: conversations.filter(c => ['open', 'pending', 'IA assistida'].includes(c.status)).length,
            quotes24h: quotes.filter(q => new Date(q.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length,
            reservationsMonth: reservations.filter(b => new Date(b.createdAt).getMonth() === new Date().getMonth()).length,
            revenueMonth: 82300, // Mock
            awaitingHuman,
            concludedByAI,
            blockedActions: 2, // Mock
        };
    }
}

export const calendarService = {
    async listEvents() {
        return repos.calendarEvents.list();
    }
}

export const leadService = {
    async listLeads() {
        const leads = await repos.leads.list();
        const contacts = await repos.contacts.list();

        return leads.map(lead => ({
            ...lead,
            contact: contacts.find(c => c.id === lead.contactId)
        }));
    },
    async createOrUpdateLead(lead: any) {
        return repos.leads.createOrUpdate(lead);
    }
}

export const systemService = {
    async resetOperationalData() {
        return repos.system.resetOperationalData();
    },
    async resetAllData() {
        return repos.system.resetAllData();
    }
}

    

    