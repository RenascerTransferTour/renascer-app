/**
 * @fileoverview This file contains UI-specific types, often denormalized
 * or combined from the core data model for easier consumption by components.
 */

import type { Conversation as CoreConversation, Message as CoreMessage, Contact, AiFlowPermission as CoreAiFlowPermission, AuditLog as CoreAuditLog } from './db/data-model';

// The main Conversation type used in the Inbox list.
// It combines Conversation with Contact details.
export type Conversation = CoreConversation & {
  contact: Contact;
  auditLogs: CoreAuditLog[];
};

// A UI-ready message type.
export type Message = CoreMessage;

// The Customer type used in various UI parts, derived from Contact.
export type Customer = Contact & {
    urgency: 'low' | 'medium' | 'high';
    interestLevel: 'low' | 'medium' | 'high';
    originChannel?: string;
};

// AI Flow Permission type
export type AiFlowPermission = CoreAiFlowPermission;

export type AuditLog = CoreAuditLog;
