/**
 * @fileoverview Defines the core data interfaces for the entire application.
 * This file serves as the single source of truth for the data shapes used
 * in the database, backend services, and frontend components.
 * 
 * In a production environment, these types could be generated automatically
 * from a database schema (e.g., using Prisma or Drizzle ORM).
 */

// --- CORE ENTITIES ---

export interface Operator {
  id: string; // UUID
  fullName: string;
  email: string;
  role: 'admin' | 'agent' | 'viewer';
  active: boolean;
  avatar: string;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export interface Contact {
  id: string; // UUID
  fullName: string;
  phone?: string;
  email?: string;
  avatar: string;
  language: string; // e.g., 'pt-BR'
  isInternal: boolean;
  notes?: string;
  originChannel?: string;
  urgency?: 'low' | 'medium' | 'high';
  interestLevel?: 'low' | 'medium' | 'high';
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export interface Channel {
  id: string; // UUID
  name: string;
  type: 'whatsapp' | 'instagram' | 'facebook' | 'website';
  status: 'connected' | 'disconnected' | 'pending' | 'expired' | 'awaiting_qr' | 'failing';
  aiEnabled: boolean;
  requiresHuman: boolean;
  provider: 'automatic' | 'gemini' | 'openai';
  lastChecked?: string; // ISO 8601
  lastError?: string;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

// --- OPERATIONAL ENTITIES ---

export interface Lead {
  id: string; // UUID
  contactId: string; // Foreign Key to Contact
  originChannelId: string; // Foreign Key to Channel
  serviceType?: string;
  originLocation?: string;
  destinationLocation?: string;
  serviceDate?: string; // ISO 8601 Date
  serviceTime?: string; // HH:MM
  passengers?: number;
  luggageCount?: number;
  urgency: 'low' | 'medium' | 'high';
  interestLevel: 'low' | 'medium' | 'high';
  status: 'new' | 'qualified' | 'contacted' | 'unqualified';
  assignedTo: string; // Foreign Key to Operator
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export interface Conversation {
  id: string; // UUID
  contactId: string; // Foreign Key to Contact
  channelId: string; // Foreign Key to Channel
  leadId?: string; // Foreign Key to Lead
  aiMode: 'off' | 'assisted' | 'partial_autonomous' | 'full_autonomous';
  aiProvider?: 'openai' | 'gemini' | 'automatic';
  status: 'open' | 'closed' | 'pending' | 'unconfirmed' | 'canceled' | 'aguardando humano' | 'IA bloqueada' | 'IA assistida' | 'IA autorizada' | 'concluído pela IA' | 'concluído por humano';
  priority: 'low' | 'medium' | 'high';
  humanOwnerId?: string; // Foreign Key to Operator
  isAiActive: boolean;
  lastMessage: string;
  lastMessageAt: string; // ISO 8601
  startedAt: string; // ISO 8601
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export interface Message {
  id: string; // UUID
  conversationId: string; // Foreign Key to Conversation
  senderType: 'user' | 'agent' | 'ai' | 'system';
  authorName?: string; // Name of human agent or AI
  authorAvatar?: string;
  content: string;
  contentType: 'text' | 'image' | 'file';
  providerUsed?: 'openai' | 'gemini';
  deliveryStatus: 'sent' | 'delivered' | 'read' | 'failed';
  createdAt: string; // ISO 8601
}

export interface Quote {
  id: string; // UUID
  leadId: string; // Foreign Key to Lead
  contactId: string;
  conversationId: string; // Foreign Key to Conversation
  status: 'rascunho' | 'em revisão' | 'enviado' | 'não confirmado' | 'aprovado' | 'perdido' | 'cancelado' | 'aguardando aprovação';
  summary: string;
  draftValue?: number;
  priceRange: [number, number];
  finalValue?: number;
  approvedByHumanId?: string; // Foreign Key to Operator
  approvedByAi: boolean;
  notes?: string;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  ownerId?: string;
}

export interface Reservation {
  id: string; // UUID
  leadId: string; // Foreign Key to Lead
  quoteId: string; // Foreign Key to Quote
  contactId: string;
  conversationId: string; // Foreign Key to Conversation
  status: 'pendente' | 'não confirmado' | 'confirmada' | 'reagendada' | 'concluída' | 'cancelada' | 'concluído pela IA' | 'concluído por humano';
  reservedBy: 'human' | 'ai';
  confirmationMode: 'manual' | 'automatic';
  scheduledDate: string; // ISO 8601 Date
  scheduledTime: string; // HH:MM
  service: 'Pickup' | 'Transfer' | 'Tour';
  details: string;
  notes?: string;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export interface CalendarEvent {
  id: string; // UUID
  reservationId?: string; // Foreign Key to Reservation
  title: string;
  eventType: 'Pickup' | 'Transfer' | 'Tour' | 'Booking' | 'Maintenance';
  start: string; // ISO 8601
  end: string; // ISO 8601
  assignedTeamMemberId?: string; // Foreign Key to Operator
  status: 'confirmada' | 'pendente' | 'cancelada' | 'concluída';
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export interface Deal {
  id: string; // UUID
  leadId: string; // Foreign Key to Lead
  contactId: string;
  quoteId?: string; // Foreign Key to Quote
  reservationId?: string; // Foreign Key to Reservation
  title: string;
  pipelineStage: 'new-lead' | 'qualified' | 'quote-sent' | 'negotiation' | 'unconfirmed' | 'closed-won' | 'closed-lost' | 'canceled' | 'aguardando fechamento';
  estimatedValue: number;
  closedValue?: number;
  closedById?: string; // Foreign Key to Operator
  status: 'open' | 'won' | 'lost' | 'canceled';
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  ownerId: string; // Foreign Key to Operator or 'IA'
}

// --- AI & SETTINGS ---

export interface AiSettings {
  id: number; // Singleton, should only be one row
  globalAiEnabled: boolean;
  aiMode: 'off' | 'assisted' | 'partial_autonomous' | 'full_autonomous';
  requireHumanApproval: boolean;
  isFallbackEnabled: boolean;
  fallbackHumanName: string;
  activeProvider: 'openai' | 'gemini' | 'automatic';
  fallbackProvider: 'openai' | 'gemini';
  commercialActivationKey: 'authorized' | 'unauthorized';
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export interface AiFlowPermission {
  id: string; // UUID
  aiSettingsId: number; // Foreign Key to AiSettings
  flowName: 'welcome' | 'qualification' | 'faq' | 'quoteCreation' | 'bookingCreation' | 'saleClosing' | 'postSale' | 'crmUpdate' | 'summarization';
  enabled: boolean;
  requiresHumanApproval: boolean;
  provider: 'automatic' | 'gemini' | 'openai';
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export interface AiProviderConfig {
  id: string; // UUID
  providerName: 'openai' | 'gemini';
  keyLabel: 'OPENAI_API_KEY' | 'GEMINI_API_KEY';
  modelName?: string;
  enabled: boolean;
  isPrimary: boolean;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export interface AiPrompt {
  id: string; // UUID
  versionName: string;
  promptType: 'master_prompt' | 'qualification_prompt';
  content: string;
  status: 'draft' | 'published' | 'archived';
  providerCompatibility: ('openai' | 'gemini')[];
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export interface KnowledgeBaseArticle {
  id: string; // UUID
  category: 'Services' | 'Destinations' | 'Policies' | 'Bookings' | 'Company';
  title: string;
  content: string;
  language: string; // e.g., 'pt-BR'
  active: boolean;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

// --- SYSTEM & LOGGING ---

export interface AuditLog {
  id: string; // UUID
  actorType: 'human' | 'ai' | 'system';
  actorName: string;
  action: string;
  entityType: string;
  entityId: string;
  details: Record<string, any>; // JSONB
  createdAt: string; // ISO 8601
}
