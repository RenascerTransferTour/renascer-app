/**
 * @fileoverview Mock Repository Layer
 * 
 * This file simulates a database repository layer. In a real application,
 * this is where you would place your database query logic (e.g., using an ORM like
 * Firebase Data Connect, Prisma, or Drizzle).
 * 
 * For now, it provides functions to perform CRUD operations on in-memory
 * data, which is seeded from `mock-data.ts`.
 */

import * as db from './mock-data';
import type { 
    Operator, Contact, Channel, Lead, Conversation, Message, Quote, Reservation, CalendarEvent, Deal, 
    AiSettings, AiFlowPermission, AiProviderConfig, AiPrompt, KnowledgeBaseArticle, AuditLog 
} from './data-model';

// A generic function to find an item by ID from any mock table
const findById = <T extends { id: string }>(table: T[], id: string): T | undefined => {
    return table.find(item => item.id === id);
};

// A generic function to list all items from any mock table
const list = <T>(table: T[]): T[] => {
    return table;
};

// A generic function to create or update an item in any mock table
const createOrUpdate = <T extends { id: string }>(table: T[], item: T): T => {
    const index = table.findIndex(i => i.id === item.id);
    if (index !== -1) {
        table[index] = { ...table[index], ...item };
        return table[index];
    } else {
        table.push(item);
        return item;
    }
};

// A generic function to batch update items
const batchUpdate = <T extends { id: string }>(table: T[], items: T[]): T[] => {
    items.forEach(item => {
        const index = table.findIndex(i => i.id === item.id);
        if (index !== -1) {
            table[index] = { ...table[index], ...item };
        } else {
            // Optionally create if it doesn't exist, though batch update usually implies existence.
            table.push(item);
        }
    });
    return items;
};

// --- Repository Exports ---

export const operators = {
    findById: (id: string) => findById(db.operators, id),
    list: () => list(db.operators),
    findByEmail: (email: string) => db.operators.find(o => o.email === email),
};

export const contacts = {
    findById: (id: string) => findById(db.contacts, id),
    list: () => list(db.contacts),
};

export const channels = {
    findById: (id: string) => findById(db.channels, id),
    list: () => list(db.channels),
    batchUpdate: (items: Channel[]) => batchUpdate(db.channels, items),
};

export const leads = {
    findById: (id: string) => findById(db.leads, id),
    list: () => list(db.leads),
    createOrUpdate: (item: Lead) => createOrUpdate(db.leads, item),
};

export const conversations = {
    findById: (id: string) => findById(db.conversations, id),
    list: () => list(db.conversations),
};

export const messages = {
    findByConversationId: (conversationId: string) => db.messages.filter(m => m.conversationId === conversationId),
    list: () => list(db.messages),
    create: (item: Message) => createOrUpdate(db.messages, item),
};

export const quotes = {
    findById: (id: string) => findById(db.quotes, id),
    list: () => list(db.quotes),
    createOrUpdate: (item: Quote) => createOrUpdate(db.quotes, item),
};

export const reservations = {
    findById: (id: string) => findById(db.reservations, id),
    list: () => list(db.reservations),
    createOrUpdate: (item: Reservation) => createOrUpdate(db.reservations, item),
};

export const calendarEvents = {
    findById: (id: string) => findById(db.calendarEvents, id),
    list: () => list(db.calendarEvents),
};

export const deals = {
    findById: (id: string) => findById(db.deals, id),
    list: () => list(db.deals),
    createOrUpdate: (item: Deal) => createOrUpdate(db.deals, item),
};

export const aiSettings = {
    get: () => db.aiSettings,
    update: (settings: Partial<AiSettings>) => {
        db.aiSettings = { ...db.aiSettings, ...settings };
        return db.aiSettings;
    }
};

export const aiFlowPermissions = {
    list: () => list(db.aiFlowPermissions),
    batchUpdate: (items: AiFlowPermission[]) => batchUpdate(db.aiFlowPermissions, items),
};

export const aiPrompts = {
    list: () => list(db.aiPrompts),
    findPublished: () => db.aiPrompts.find(p => p.status === 'published'),
    findDraft: () => db.aiPrompts.find(p => p.status === 'draft'),
    update: (prompt: AiPrompt) => createOrUpdate(db.aiPrompts, prompt),
    publishDraft: () => {
        const draftIndex = db.aiPrompts.findIndex(p => p.status === 'draft');
        if (draftIndex === -1) return null; // No draft to publish

        const draft = db.aiPrompts[draftIndex];

        const publishedIndex = db.aiPrompts.findIndex(p => p.status === 'published');
        if (publishedIndex !== -1) {
            db.aiPrompts[publishedIndex].status = 'archived';
        }

        db.aiPrompts[draftIndex].status = 'published';
        db.aiPrompts[draftIndex].versionName = `v${Date.now()} - Published`;
        
        // Create a new draft based on the just-published one
        const newDraft: AiPrompt = {
            ...draft,
            id: `prompt-draft-${Date.now()}`,
            status: 'draft',
            versionName: `vNext - Draft`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        db.aiPrompts.push(newDraft);

        return { published: db.aiPrompts[draftIndex], newDraft: newDraft };
    }
};

export const knowledgeBase = {
    list: () => list(db.knowledgeBaseArticles),
};
