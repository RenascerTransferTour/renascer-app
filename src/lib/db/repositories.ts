/**
 * @fileoverview Filesystem-based Repository Layer
 * 
 * This file simulates a database repository layer by reading from and writing to
 * a local JSON file (`data/data.json`). This ensures data persistence across
 * server restarts and requests, which is crucial for a stateful application
 * running in a stateless environment like Docker or serverless functions.
 */
import fs from 'fs/promises';
import path from 'path';
import * as seed from './mock-data';
import type { 
    Operator, Contact, Channel, Lead, Conversation, Message, Quote, Reservation, CalendarEvent, Deal, 
    AiSettings, AiFlowPermission, AiProviderConfig, AiPrompt, KnowledgeBaseArticle, AuditLog 
} from './data-model';

// Defines the structure of the entire database stored in the JSON file.
type Database = {
    operators: Operator[];
    contacts: Contact[];
    channels: Channel[];
    leads: Lead[];
    messages: Message[];
    conversations: Conversation[];
    quotes: Quote[];
    reservations: Reservation[];
    calendarEvents: CalendarEvent[];
    deals: Deal[];
    knowledgeBaseArticles: KnowledgeBaseArticle[];
    aiSettings: AiSettings;
    aiFlowPermissions: AiFlowPermission[];
    aiProviderConfigs: AiProviderConfig[];
    aiPrompts: AiPrompt[];
    auditLogs: AuditLog[];
};

const dbPath = path.resolve(process.cwd(), 'data', 'data.json');

// Asynchronously reads the entire database from the JSON file.
const readData = async (): Promise<Database> => {
    try {
        const data = await fs.readFile(dbPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // If the file doesn't exist, initialize it with seed data.
        if (error.code === 'ENOENT') {
            console.log("Data file not found, initializing with seed data.");
            return system.initialize();
        }
        throw error;
    }
};

// Asynchronously writes the entire database object to the JSON file.
const writeData = async (data: Database): Promise<void> => {
    await fs.mkdir(path.dirname(dbPath), { recursive: true });
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
};

// Generic repository functions that perform read-modify-write operations.
const findById = async <T extends { id: string }>(table: keyof Database, id: string): Promise<T | undefined> => {
    const db = await readData();
    // @ts-ignore
    return (db[table] as T[]).find(item => item.id === id);
};

const list = async <T>(table: keyof Database): Promise<T[]> => {
    const db = await readData();
    return db[table] as T[];
};

const createOrUpdate = async <T extends { id: string }>(table: keyof Database, item: T): Promise<T> => {
    const db = await readData();
    const tableData = db[table] as T[];
    const index = tableData.findIndex(i => i.id === item.id);
    let savedItem;
    if (index !== -1) {
        savedItem = { ...tableData[index], ...item, updatedAt: new Date().toISOString() };
        tableData[index] = savedItem;
    } else {
        savedItem = { ...item, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        // @ts-ignore
        tableData.push(savedItem);
    }
    await writeData(db);
    return savedItem as T;
};

const batchUpdate = async <T extends { id: string }>(table: keyof Database, items: T[]): Promise<T[]> => {
    const db = await readData();
    const tableData = db[table] as T[];
    const updatedItems: T[] = [];
    items.forEach(item => {
        const index = tableData.findIndex(i => i.id === item.id);
        if (index !== -1) {
            const updatedItem = { ...tableData[index], ...item, updatedAt: new Date().toISOString() };
            tableData[index] = updatedItem;
            updatedItems.push(updatedItem);
        } else {
            const newItem = { ...item, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
             // @ts-ignore
            tableData.push(newItem);
            updatedItems.push(newItem as T);
        }
    });
    await writeData(db);
    return updatedItems;
};

// --- Repository Exports ---

export const operators = {
    findById: (id: string) => findById<Operator>('operators', id),
    list: () => list<Operator>('operators'),
    findByEmail: async (email: string) => (await list<Operator>('operators')).find(o => o.email === email),
};

export const contacts = {
    findById: (id: string) => findById<Contact>('contacts', id),
    list: () => list<Contact>('contacts'),
};

export const channels = {
    findById: (id: string) => findById<Channel>('channels', id),
    list: () => list<Channel>('channels'),
    batchUpdate: (items: Channel[]) => batchUpdate<Channel>('channels', items),
};

export const leads = {
    findById: (id: string) => findById<Lead>('leads', id),
    list: () => list<Lead>('leads'),
    createOrUpdate: (item: Lead) => createOrUpdate<Lead>('leads', item),
};

export const conversations = {
    findById: (id: string) => findById<Conversation>('conversations', id),
    list: () => list<Conversation>('conversations'),
    createOrUpdate: (item: Conversation) => createOrUpdate<Conversation>('conversations', item),
};

export const messages = {
    findByConversationId: async (conversationId: string) => {
        const allMessages = await list<Message>('messages');
        return allMessages.filter(m => m.conversationId === conversationId);
    },
    list: () => list<Message>('messages'),
    createOrUpdate: (item: Message) => createOrUpdate<Message>('messages', item),
};

export const quotes = {
    findById: (id: string) => findById<Quote>('quotes', id),
    list: () => list<Quote>('quotes'),
    createOrUpdate: (item: Quote) => createOrUpdate<Quote>('quotes', item),
};

export const reservations = {
    findById: (id: string) => findById<Reservation>('reservations', id),
    list: () => list<Reservation>('reservations'),
    createOrUpdate: (item: Reservation) => createOrUpdate<Reservation>('reservations', item),
};

export const calendarEvents = {
    findById: (id: string) => findById<CalendarEvent>('calendarEvents', id),
    list: () => list<CalendarEvent>('calendarEvents'),
};

export const deals = {
    findById: (id: string) => findById<Deal>('deals', id),
    list: () => list<Deal>('deals'),
    createOrUpdate: (item: Deal) => createOrUpdate<Deal>('deals', item),
};

export const aiSettings = {
    get: async () => (await readData()).aiSettings,
    update: async (settings: Partial<AiSettings>) => {
        const db = await readData();
        db.aiSettings = { ...db.aiSettings, ...settings, updatedAt: new Date().toISOString() };
        await writeData(db);
        return db.aiSettings;
    }
};

export const aiFlowPermissions = {
    list: () => list<AiFlowPermission>('aiFlowPermissions'),
    batchUpdate: (items: AiFlowPermission[]) => batchUpdate('aiFlowPermissions', items),
};

export const aiPrompts = {
    list: () => list<AiPrompt>('aiPrompts'),
    findPublished: async () => (await list<AiPrompt>('aiPrompts')).find(p => p.status === 'published'),
    findDraft: async () => (await list<AiPrompt>('aiPrompts')).find(p => p.status === 'draft'),
    update: (prompt: AiPrompt) => createOrUpdate<AiPrompt>('aiPrompts', prompt),
    publishDraft: async () => {
        const db = await readData();
        const draftIndex = db.aiPrompts.findIndex(p => p.status === 'draft');
        if (draftIndex === -1) return null;

        const draft = db.aiPrompts[draftIndex];
        const publishedIndex = db.aiPrompts.findIndex(p => p.status === 'published');
        if (publishedIndex !== -1) {
            db.aiPrompts[publishedIndex].status = 'archived';
        }

        db.aiPrompts[draftIndex].status = 'published';
        db.aiPrompts[draftIndex].versionName = `v${Date.now()} - Published`;
        
        const newDraft: AiPrompt = {
            ...draft,
            id: `prompt-draft-${Date.now()}`,
            status: 'draft',
            versionName: `vNext - Draft`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        db.aiPrompts.push(newDraft);

        await writeData(db);
        return { published: db.aiPrompts[draftIndex], newDraft };
    }
};

export const auditLogs = {
    list: () => list<AuditLog>('auditLogs'),
    findByContactId: async (contactId: string) => {
        const logs = await list<AuditLog>('auditLogs');
        return logs.filter(log => log.contactId === contactId)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    },
};

export const knowledgeBase = {
    list: () => list<KnowledgeBaseArticle>('knowledgeBaseArticles'),
};

const getInitialData = (): Database => ({
    operators: JSON.parse(JSON.stringify(seed.originalOperators)),
    contacts: JSON.parse(JSON.stringify(seed.originalContacts)),
    channels: JSON.parse(JSON.stringify(seed.originalChannels)),
    leads: JSON.parse(JSON.stringify(seed.originalLeads)),
    messages: JSON.parse(JSON.stringify(seed.originalMessages)),
    conversations: JSON.parse(JSON.stringify(seed.originalConversations)),
    quotes: JSON.parse(JSON.stringify(seed.originalQuotes)),
    reservations: JSON.parse(JSON.stringify(seed.originalReservations)),
    calendarEvents: JSON.parse(JSON.stringify(seed.originalCalendarEvents)),
    deals: JSON.parse(JSON.stringify(seed.originalDeals)),
    knowledgeBaseArticles: JSON.parse(JSON.stringify(seed.originalKnowledgeBaseArticles)),
    aiSettings: JSON.parse(JSON.stringify(seed.originalAiSettings)),
    aiFlowPermissions: JSON.parse(JSON.stringify(seed.originalAiFlowPermissions)),
    aiProviderConfigs: JSON.parse(JSON.stringify(seed.originalAiProviderConfigs)),
    aiPrompts: JSON.parse(JSON.stringify(seed.originalAiPrompts)),
    auditLogs: JSON.parse(JSON.stringify(seed.originalAuditLogs)),
});


export const system = {
    initialize: async () => {
        const initialData = getInitialData();
        await writeData(initialData);
        return initialData;
    },
    resetOperationalData: async () => {
        const db = await readData();
        const freshData = getInitialData();
        const newData: Database = {
            ...db, // Keep settings, prompts, etc.
            conversations: freshData.conversations,
            messages: freshData.messages,
            leads: freshData.leads,
            quotes: freshData.quotes,
            reservations: freshData.reservations,
            deals: freshData.deals,
            calendarEvents: freshData.calendarEvents,
            auditLogs: freshData.auditLogs,
            contacts: freshData.contacts,
        };
        await writeData(newData);
        return { success: true, message: "Dados operacionais foram resetados." };
    },
    resetAllData: async () => {
        const initialData = getInitialData();
        await writeData(initialData);
        return { success: true, message: "Todos os dados e configurações foram restaurados para o padrão." };
    }
};

    