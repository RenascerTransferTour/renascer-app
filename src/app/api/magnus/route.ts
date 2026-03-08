
import { NextRequest, NextResponse } from "next/server";
import { MAGNUS_SYSTEM_PROMPT } from "@/ai/prompts/magnus";
import { buildMagnusInput } from "@/ai/prompts/magnus-input-builder";
import { parseMagnusOutput } from "@/ai/prompts/magnus-output-parser";
import type { MagnusOutput } from "@/ai/prompts/magnus-types";

type RequestBody = {
  conversationId: string;
  customerId: string;
  text?: string | null;
  mediaTypes?: string[];
  metadata?: {
    is_saved_contact?: boolean;
    internal?: boolean;
    team?: boolean;
    driver?: boolean;
    partner?: boolean;
    human_active?: boolean;
  };
  state?: {
    customer_name?: string | null;
    form_sent?: boolean;
    human_takeover?: boolean;
    conversation_closed?: boolean;
    service_type?: "unknown" | "transfer" | "tour" | "trip";
  };
};

function buildFallbackSilentOutput(): MagnusOutput {
  return {
    should_reply: false,
    silence_reason: "no_text_message",
    language: "pt",
    customer_type: "unknown",
    stage: "silent",
    handoff_to_claudia: false,
    form_sent: false,
    close_conversation: false,
    service_type: "unknown",
    intent: "none",
    collected_data: {
      customer_name: null,
      origin: null,
      destination: null,
      date: null,
      time: null,
      passengers: null,
      bags: null,
      bag_size: null,
      child: null,
      region_interest: null,
      trip_destination_city: null,
    },
    messages: [],
  };
}

async function callOpenAI(inputPayload: unknown): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.MAGNUS_OPENAI_MODEL ?? "gpt-4o-mini";

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY não configurada no servidor.");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: MAGNUS_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: JSON.stringify(inputPayload),
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Falha ao chamar OpenAI: ${response.status} - ${errorText}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{
      message?: {
        content?: string | null;
      };
    }>;
  };

  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("A OpenAI não retornou conteúdo.");
  }

  return content;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RequestBody;

    if (!body.conversationId || !body.customerId) {
      return NextResponse.json(
        { error: "conversationId e customerId são obrigatórios." },
        { status: 400 }
      );
    }

    const inputPayload = buildMagnusInput({
      conversationId: body.conversationId,
      customerId: body.customerId,
      text: body.text ?? null,
      mediaTypes: body.mediaTypes ?? [],
      metadata: body.metadata,
      state: body.state,
      channel: "whatsapp",
    });

    if (!inputPayload.has_text) {
      return NextResponse.json(buildFallbackSilentOutput());
    }

    // Modo mock opcional: útil enquanto você ainda não ativou a IA real.
    const mockMode = process.env.MAGNUS_MOCK_MODE === "true";

    if (mockMode) {
      const mockOutput: MagnusOutput = {
        should_reply: true,
        silence_reason: null,
        language: inputPayload.message_language_hint ?? "pt",
        customer_type: "external_customer",
        stage: "welcome",
        handoff_to_claudia: false,
        form_sent: false,
        close_conversation: false,
        service_type: "unknown",
        intent: "general_inquiry",
        collected_data: {
          customer_name: inputPayload.state.customer_name,
          origin: null,
          destination: null,
          date: null,
          time: null,
          passengers: null,
          bags: null,
          bag_size: null,
          child: null,
          region_interest: null,
          trip_destination_city: null,
        },
        messages: [
          "Olá! Seja bem-vindo(a) à Renascer Transfer Tour 😊 Sou o Magnus — como posso ajudar hoje?",
        ],
      };

      return NextResponse.json(mockOutput);
    }

    const rawOutput = await callOpenAI(inputPayload);
    const parsedOutput = parseMagnusOutput(rawOutput);

    return NextResponse.json(parsedOutput);
  } catch (error) {
    console.error("[MAGNUS_ROUTE_ERROR]", error);

    return NextResponse.json(
      {
        error: "Falha ao processar o atendimento do MAGNUS.",
        details: error instanceof Error ? error.message : "Erro desconhecido.",
      },
      { status: 500 }
    );
  }
}
