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
import type { Conversation, Contact, Quote, Reservation, Deal, Channel, AiFlowPermission, AiSettings, AiPrompt, AuditLog } from './data-model';

export const conversationService = {
  /**
   * Lists all conversations, enriching them with contact details.
   * This is a common pattern for a service: combining data from multiple sources.
   */
  async listConversations(): Promise<(Conversation & { contact: Contact })[]> {
    const conversations = repos.conversations.list();
    const contacts = repos.contacts.list();
    
    // In a real database, this would be a JOIN query for performance.
    // Here, we simulate it with a map-reduce operation.
    return conversations.map(conv => {
      const contact = contacts.find(c => c.id === conv.contactId);
      if (!contact) {
        // In a real app, you'd want more robust error handling or logging.
        throw new Error(`Contact not found for conversation ${conv.id}`);
      }
      return { ...conv, contact };
    });
  },

  /**
   * Finds a single conversation and its full message history.
   */
  async getConversationDetails(id: string) {
    const conversation = repos.conversations.findById(id);
    if (!conversation) return null;

    const contact = repos.contacts.findById(conversation.contactId);
    if (!contact) return null;
    
    const messages = repos.messages.findByConversationId(id);
    const auditLogs = repos.auditLogs.findByContactId(conversation.contactId);

    return {
      ...conversation,
      contact,
      messages,
      auditLogs,
    };
  },
};

export const quoteService = {
  async listQuotes() {
    const quotes = repos.quotes.list();
    const contacts = repos.contacts.list();
    const operators = repos.operators.list();

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
        const reservations = repos.reservations.list();
        const contacts = repos.contacts.list();
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
        const deals = repos.deals.list();
        const contacts = repos.contacts.list();
        const operators = repos.operators.list();
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
        const reservations = repos.reservations.list();
        const conversations = repos.conversations.list();

        const confirmedToday = reservations.filter(r => r.status === 'confirmada' && new Date(r.createdAt).toDateString() === new Date().toDateString()).length;
        const unconfirmed = reservations.filter(r => r.status === 'não confirmado').length;
        const cancelled24h = reservations.filter(r => r.status === 'cancelada' && new Date(r.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length;
        const awaitingAction = conversations.filter(c => c.status === 'aguardando humano').length;

        return { confirmedToday, unconfirmed, cancelled24h, awaitingAction };
    },

    async getStats() {
        const conversations = repos.conversations.list();
        const reservations = repos.reservations.list();
        const quotes = repos.quotes.list();

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
        const leads = repos.leads.list();
        const contacts = repos.contacts.list();

        return leads.map(lead => ({
            ...lead,
            contact: contacts.find(c => c.id === lead.contactId)
        }));
    },
    async createOrUpdateLead(lead: Lead) {
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

    
