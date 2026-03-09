/**
 * @fileoverview This file defines the TypeScript types for the structured input and output
 * of the MAGNUS system prompt, ensuring type safety and consistency between the AI flow
 * and any services that interact with it.
 */

export type MagnusLanguage = "pt" | "en" | "es";

export type MagnusCustomerType =
  | "external_customer"
  | "internal_or_operational"
  | "unknown";

export type MagnusStage =
  | "silent"
  | "welcome"
  | "qualify"
  | "collecting"
  | "handoff"
  | "closed"
  | "info_only"
  | "error";

export type MagnusServiceType = "unknown" | "transfer" | "tour" | "trip";

export type MagnusIntent =
  | "none"
  | "general_inquiry"
  | "service_request"
  | "price_request"
  | "assistant_identity"
  | "talk_to_claudia"
  | "submit_form"
  | "error";

export type MagnusSilenceReason =
  | "no_text_message"
  | "human_takeover"
  | "internal_or_operational_contact"
  | "technical_or_internal_test"
  | "media_without_text"
  | "conversation_already_closed"
  | "human_active_flag"
  | "saved_internal_contact"
  | "duplicate_or_redundant_reply"
  | "ai_provider_error";

export interface MagnusCollectedData {
  customer_name: string | null;
  origin: string | null;
  destination: string | null;
  date: string | null;
  time: string | null;
  passengers: number | null;
  bags: number | null;
  bag_size: string | null;
  child: boolean | null;
  region_interest: string | null;
  trip_destination_city: string | null;
}

export interface MagnusInputMetadata {
  is_saved_contact?: boolean;
  internal?: boolean;
  team?: boolean;
  driver?: boolean;
  partner?: boolean;
  human_active?: boolean;
}

export interface MagnusConversationState {
  customer_name: string | null;
  form_sent: boolean;
  human_takeover: boolean;
  conversation_closed: boolean;
  service_type: MagnusServiceType;
}

export interface MagnusInput {
  conversation_id: string;
  customer_id: string;
  timestamp: string;
  channel: string;
  has_text: boolean;
  has_media: boolean;
  media_types: string[];
  last_customer_message: string;
  message_language_hint?: MagnusLanguage | null;
  metadata: MagnusInputMetadata;
  state: MagnusConversationState;
}

export interface MagnusOutput {
  should_reply: boolean;
  silence_reason: MagnusSilenceReason | null;
  language: MagnusLanguage;
  customer_type: MagnusCustomerType;
  stage: MagnusStage;
  handoff_to_claudia: boolean;
  form_sent: boolean;
  close_conversation: boolean;
  service_type: MagnusServiceType;
  intent: MagnusIntent;
  collected_data: MagnusCollectedData;
  messages: string[];
}
