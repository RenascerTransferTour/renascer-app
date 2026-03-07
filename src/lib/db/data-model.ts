// --- CORE ENTITIES ---

export interface Operator {
  id: string; // UUID
  full_name: string;
  email: string;
  role: 'admin' | 'agent' | 'viewer';
  active: boolean;
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}

export interface Contact {
  id: string; // UUID
  full_name: string;
  phone?: string;
  email?: string;
  language: string; // e.g., 'pt-BR'
  is_internal: boolean;
  notes?: string;
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}

export interface Channel {
  id: string; // UUID
  name: string;
  type: 'whatsapp' | 'instagram' | 'facebook' | 'website';
  status: 'connected' | 'disconnected' | 'pending';
  ai_enabled: boolean;
  fallback_provider?: string;
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}

// --- OPERATIONAL ENTITIES ---

export interface Lead {
  id: string; // UUID
  contact_id: string; // Foreign Key to Contact
  origin_channel_id: string; // Foreign Key to Channel
  service_type?: string;
  origin_location?: string;
  destination_location?: string;
  service_date?: string; // ISO 8601 Date
  service_time?: string; // HH:MM
  passengers?: number;
  luggage_count?: number;
  urgency: 'low' | 'medium' | 'high';
  interest_level: 'low' | 'medium' | 'high';
  status: 'new' | 'qualified' | 'contacted' | 'unqualified';
  assigned_to: string; // Foreign Key to Operator
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}

export interface Conversation {
  id: string; // UUID
  contact_id: string; // Foreign Key to Contact
  channel_id: string; // Foreign Key to Channel
  lead_id?: string; // Foreign Key to Lead
  ai_mode: 'off' | 'assisted' | 'partial_autonomous' | 'full_autonomous';
  ai_provider?: 'openai' | 'gemini' | 'automatic';
  status: 'open' | 'closed' | 'pending_human' | 'pending_ai';
  human_owner_id?: string; // Foreign Key to Operator
  started_at: string; // ISO 8601
  last_message_at: string; // ISO 8601
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}

export interface Message {
  id: string; // UUID
  conversation_id: string; // Foreign Key to Conversation
  sender_type: 'client' | 'ai' | 'human' | 'system';
  content: string;
  content_type: 'text' | 'image' | 'file';
  provider_used?: 'openai' | 'gemini';
  delivery_status: 'sent' | 'delivered' | 'read' | 'failed';
  created_at: string; // ISO 8601
}

export interface Quote {
  id: string; // UUID
  lead_id: string; // Foreign Key to Lead
  conversation_id: string; // Foreign Key to Conversation
  status: 'draft' | 'review' | 'sent' | 'approved' | 'rejected' | 'canceled';
  draft_value?: number;
  final_value: number;
  approved_by_human_id?: string; // Foreign Key to Operator
  approved_by_ai: boolean;
  notes?: string;
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}

export interface Reservation {
  id: string; // UUID
  lead_id: string; // Foreign Key to Lead
  quote_id: string; // Foreign Key to Quote
  conversation_id: string; // Foreign Key to Conversation
  status: 'pending_confirmation' | 'confirmed' | 'rescheduled' | 'completed' | 'canceled';
  reserved_by: 'human' | 'ai';
  confirmation_mode: 'manual' | 'automatic';
  scheduled_date: string; // ISO 8601 Date
  scheduled_time: string; // HH:MM
  notes?: string;
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}

export interface CalendarEvent {
  id: string; // UUID
  reservation_id: string; // Foreign Key to Reservation
  title: string;
  event_type: 'pickup' | 'transfer' | 'tour' | 'maintenance';
  start_at: string; // ISO 8601
  end_at: string; // ISO 8601
  assigned_team_member_id?: string; // Foreign Key to Operator
  status: 'scheduled' | 'in_progress' | 'completed' | 'canceled';
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}

export interface Deal {
  id: string; // UUID
  lead_id: string; // Foreign Key to Lead
  quote_id?: string; // Foreign Key to Quote
  reservation_id?: string; // Foreign Key to Reservation
  pipeline_stage: 'new' | 'qualified' | 'quote_sent' | 'negotiation' | 'won' | 'lost';
  estimated_value?: number;
  closed_value?: number;
  closed_by_id?: string; // Foreign Key to Operator
  status: 'open' | 'won' | 'lost' | 'canceled';
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}

// --- AI & SETTINGS ---

export interface AiSettings {
  id: number; // Singleton, should only be one row
  global_ai_enabled: boolean;
  ai_mode: 'off' | 'assisted' | 'partial_autonomous' | 'full_autonomous';
  require_human_approval: boolean;
  fallback_human_name: string;
  active_provider: 'openai' | 'gemini' | 'automatic';
  fallback_provider?: 'openai' | 'gemini';
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}

export interface AiFlowPermission {
  id: string; // UUID
  ai_settings_id: number; // Foreign Key to AiSettings
  flow_name: 'welcome' | 'qualification' | 'faq' | 'quote_creation' | 'booking_creation' | 'sale_closing' | 'post_sale';
  enabled: boolean;
  requires_human_approval: boolean;
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}

export interface AiProviderConfig {
  id: string; // UUID
  provider_name: 'openai' | 'gemini';
  key_label: 'OPENAI_API_KEY' | 'GEMINI_API_KEY';
  model_name?: string;
  enabled: boolean;
  is_primary: boolean;
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}

export interface AiPrompt {
  id: string; // UUID
  version_name: string;
  prompt_type: 'master_prompt' | 'qualification_prompt';
  content: string;
  status: 'draft' | 'published' | 'archived';
  provider_compatibility: ('openai' | 'gemini')[];
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}

export interface KnowledgeBaseArticle {
  id: string; // UUID
  category: string;
  title: string;
  content: string;
  language: string; // e.g., 'pt-BR'
  active: boolean;
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}

// --- SYSTEM & LOGGING ---

export interface AuditLog {
  id: string; // UUID
  actor_type: 'human' | 'ai' | 'system';
  actor_name: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: Record<string, any>; // JSONB
  created_at: string; // ISO 8601
}
