

/**
 * @fileoverview This file provides a robust parser and validator for the structured
 * JSON output from the MAGNUS system prompt. It ensures that any response from the AI
 * conforms to the expected MagnusOutput type before it's used in the application,
 * preventing runtime errors due to malformed or unexpected AI responses.
 */

import type {
  MagnusCollectedData,
  MagnusCustomerType,
  MagnusIntent,
  MagnusLanguage,
  MagnusOutput,
  MagnusServiceType,
  MagnusSilenceReason,
  MagnusStage,
} from "./magnus-types";

const ALLOWED_LANGUAGES: MagnusLanguage[] = ["pt", "en", "es"];
const ALLOWED_CUSTOMER_TYPES: MagnusCustomerType[] = [
  "external_customer",
  "internal_or_operational",
  "unknown",
];
const ALLOWED_STAGES: MagnusStage[] = [
  "silent",
  "welcome",
  "qualify",
  "collecting",
  "handoff",
  "closed",
  "info_only",
  "error", // Added to support error stage
];
const ALLOWED_SERVICE_TYPES: MagnusServiceType[] = [
  "unknown",
  "transfer",
  "tour",
  "trip",
];
const ALLOWED_INTENTS: MagnusIntent[] = [
  "none",
  "general_inquiry",
  "service_request",
  "price_request",
  "assistant_identity",
  "talk_to_claudia",
  "submit_form",
  "error", // Added to support error intent
];
const ALLOWED_SILENCE_REASONS: MagnusSilenceReason[] = [
  "no_text_message",
  "human_takeover",
  "internal_or_operational_contact",
  "technical_or_internal_test",
  "media_without_text",
  "conversation_already_closed",
  "human_active_flag",
  "saved_internal_contact",
  "duplicate_or_redundant_reply",
  "ai_provider_error", // Added to support provider errors
];

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isNullableString(value: unknown): value is string | null {
  return typeof value === "string" || value === null;
}

function isNullableNumber(value: unknown): value is number | null {
  return typeof value === "number" || value === null;
}

function isNullableBoolean(value: unknown): value is boolean | null {
  return typeof value === "boolean" || value === null;
}

function isCollectedData(value: unknown): value is MagnusCollectedData {
  if (!isObject(value)) return false;

  return (
    isNullableString(value.customer_name) &&
    isNullableString(value.origin) &&
    isNullableString(value.destination) &&
    isNullableString(value.date) &&
    isNullableString(value.time) &&
    isNullableNumber(value.passengers) &&
    isNullableNumber(value.bags) &&
    isNullableString(value.bag_size) &&
    isNullableBoolean(value.child) &&
    isNullableString(value.region_interest) &&
    isNullableString(value.trip_destination_city)
  );
}

export function parseMagnusOutput(raw: string): MagnusOutput {
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("A resposta do MAGNUS não é um JSON válido.");
  }

  if (!isObject(parsed)) {
    throw new Error("A resposta do MAGNUS precisa ser um objeto JSON.");
  }

  const {
    should_reply,
    silence_reason,
    language,
    customer_type,
    stage,
    handoff_to_claudia,
    form_sent,
    close_conversation,
    service_type,
    intent,
    collected_data,
    messages,
  } = parsed;

  if (typeof should_reply !== "boolean") {
    throw new Error("Campo should_reply inválido.");
  }

  if (
    silence_reason !== null &&
    (typeof silence_reason !== "string" ||
      !ALLOWED_SILENCE_REASONS.includes(silence_reason as MagnusSilenceReason))
  ) {
    throw new Error(`Campo silence_reason inválido. Valor recebido: ${silence_reason}`);
  }

  if (typeof language !== "string" || !ALLOWED_LANGUAGES.includes(language as MagnusLanguage)) {
    throw new Error("Campo language inválido.");
  }

  if (
    typeof customer_type !== "string" ||
    !ALLOWED_CUSTOMER_TYPES.includes(customer_type as MagnusCustomerType)
  ) {
    throw new Error("Campo customer_type inválido.");
  }

  if (typeof stage !== "string" || !ALLOWED_STAGES.includes(stage as MagnusStage)) {
    throw new Error("Campo stage inválido.");
  }

  if (typeof handoff_to_claudia !== "boolean") {
    throw new Error("Campo handoff_to_claudia inválido.");
  }

  if (typeof form_sent !== "boolean") {
    throw new Error("Campo form_sent inválido.");
  }

  if (typeof close_conversation !== "boolean") {
    throw new Error("Campo close_conversation inválido.");
  }

  if (
    typeof service_type !== "string" ||
    !ALLOWED_SERVICE_TYPES.includes(service_type as MagnusServiceType)
  ) {
    throw new Error("Campo service_type inválido.");
  }

  if (typeof intent !== "string" || !ALLOWED_INTENTS.includes(intent as MagnusIntent)) {
    throw new Error("Campo intent inválido.");
  }

  if (!isCollectedData(collected_data)) {
    throw new Error("Campo collected_data inválido.");
  }

  if (!Array.isArray(messages) || messages.some((m) => typeof m !== "string")) {
    throw new Error("Campo messages inválido.");
  }

  if (messages.length > 2) {
    throw new Error("MAGNUS não pode retornar mais de 2 mensagens.");
  }

  if (!should_reply && messages.length > 0) {
    throw new Error("Se should_reply=false, messages deve ser vazio.");
  }

  return {
    should_reply,
    silence_reason: silence_reason as MagnusSilenceReason | null,
    language: language as MagnusLanguage,
    customer_type: customer_type as MagnusCustomerType,
    stage: stage as MagnusStage,
    handoff_to_claudia,
    form_sent,
    close_conversation,
    service_type: service_type as MagnusServiceType,
    intent: intent as MagnusIntent,
    collected_data,
    messages: messages as string[],
  };
}
