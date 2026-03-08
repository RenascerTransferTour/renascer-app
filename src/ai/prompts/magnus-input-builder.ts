import type {
  MagnusInput,
  MagnusInputMetadata,
  MagnusConversationState,
  MagnusLanguage,
  MagnusServiceType,
} from "./magnus-types";

export interface BuildMagnusInputParams {
  conversationId: string;
  customerId: string;
  channel?: string;
  text?: string | null;
  mediaTypes?: string[];
  metadata?: MagnusInputMetadata;
  state?: Partial<MagnusConversationState>;
  timestamp?: string;
}

function detectLanguage(text: string): MagnusLanguage {
  const normalized = text.toLowerCase();

  const spanishHints = ["hola", "quiero", "precio", "viaje", "traslado", "gracias"];
  const englishHints = ["hello", "price", "transfer", "trip", "thank you", "airport"];

  const hasSpanish = spanishHints.some((word) => normalized.includes(word));
  const hasEnglish = englishHints.some((word) => normalized.includes(word));

  if (hasSpanish) return "es";
  if (hasEnglish) return "en";
  return "pt";
}

export function buildMagnusInput(params: BuildMagnusInputParams): MagnusInput {
  const text = (params.text ?? "").trim();
  const mediaTypes = params.mediaTypes ?? [];
  const hasText = text.length > 0;
  const hasMedia = mediaTypes.length > 0;

  const state: MagnusConversationState = {
    customer_name: params.state?.customer_name ?? null,
    form_sent: params.state?.form_sent ?? false,
    human_takeover: params.state?.human_takeover ?? false,
    conversation_closed: params.state?.conversation_closed ?? false,
    service_type: (params.state?.service_type ?? "unknown") as MagnusServiceType,
  };

  return {
    conversation_id: params.conversationId,
    customer_id: params.customerId,
    timestamp: params.timestamp ?? new Date().toISOString(),
    channel: params.channel ?? "whatsapp",
    has_text: hasText,
    has_media: hasMedia,
    media_types: mediaTypes,
    last_customer_message: text,
    message_language_hint: hasText ? detectLanguage(text) : "pt",
    metadata: {
      is_saved_contact: params.metadata?.is_saved_contact ?? false,
      internal: params.metadata?.internal ?? false,
      team: params.metadata?.team ?? false,
      driver: params.metadata?.driver ?? false,
      partner: params.metadata?.partner ?? false,
      human_active: params.metadata?.human_active ?? false,
    },
    state,
  };
}
