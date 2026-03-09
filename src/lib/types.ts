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

// The Customer type is now an alias for the core Contact model.
// This ensures that the UI components correctly handle optional properties
// like 'urgency' and 'interestLevel' that exist on the Contact model.
export type Customer = Contact;

// AI Flow Permission type
export type AiFlowPermission = CoreAiFlowPermission;

export type AuditLog = CoreAuditLog;

export type PipelineDeal = import('./db/data-model').Deal;
