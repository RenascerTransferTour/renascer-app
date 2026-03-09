import { NextRequest, NextResponse } from "next/server";
import { buildMagnusInput } from "@/ai/prompts/magnus-input-builder";
import { parseMagnusOutput } from "@/ai/prompts/magnus-output-parser";
import { MAGNUS_SYSTEM_PROMPT } from "@/ai/prompts/magnus";
import type { MagnusOutput } from "@/ai/prompts/magnus-types";

type RequestBody = {
  conversationId: string;
  customerId: string;
  text?: string | null;
  conversationHistory?: { role: 'user' | 'model', content: string }[];
};

const OPENAI_TIMEOUT_MS = 25000; // 25 seconds

const createErrorResponse = (
  message: string,
  handoff = true
): MagnusOutput => ({
  should_reply: true,
  silence_reason: "ai_provider_error",
  language: "pt",
  customer_type: "unknown",
  stage: "error",
  handoff_to_claudia: handoff,
  form_sent: false,
  close_conversation: handoff,
  service_type: "unknown",
  intent: "error",
  collected_data: { customer_name: null, origin: null, destination: null, date: null, time: null, passengers: null, bags: null, bag_size: null, child: null, region_interest: null, trip_destination_city: null },
  messages: [message],
});

async function callOpenAI(
  input: any
): Promise<{ success: true; data: any } | { success: false; error: string; status: number }> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("[MAGNUS_ROUTE] OPENAI_API_KEY não configurada no servidor.");
    return {
      success: false,
      error: "O serviço de IA não está configurado corretamente.",
      status: 503, // Service Unavailable
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), OPENAI_TIMEOUT_MS);

  try {
    const magnusInput = buildMagnusInput({
      conversationId: input.conversationId,
      customerId: input.customerId,
      text: input.text,
    });

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.MAGNUS_OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          { role: "system", content: MAGNUS_SYSTEM_PROMPT },
          {
            role: "user",
            content: JSON.stringify(magnusInput, null, 2),
          },
        ],
        temperature: 0.1,
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[MAGNUS_ROUTE] OpenAI API error: ${response.status}`, errorText);
      return {
        success: false,
        error: "O provedor de IA retornou um erro.",
        status: 502, // Bad Gateway
      };
    }

    const jsonResponse = await response.json();
    return { success: true, data: jsonResponse };

  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.error("[MAGNUS_ROUTE] OpenAI API call timed out.");
      return { success: false, error: "A requisição para a IA demorou muito para responder.", status: 504 }; // Gateway Timeout
    }
    console.error("[MAGNUS_ROUTE] Erro inesperado na chamada da OpenAI:", error);
    return { success: false, error: "Falha na comunicação com o provedor de IA.", status: 502 }; // Bad Gateway
  }
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
    
    if (process.env.MAGNUS_MOCK_MODE === "true") {
      console.log("[MAGNUS_ROUTE] Rodando em MOCK_MODE. Retornando resposta de handoff padrão.");
      const mockResponse = createErrorResponse(
        "Desculpe, nosso sistema de IA está em modo de teste. Um atendente humano irá ajudá-lo em breve."
      );
      return NextResponse.json(mockResponse);
    }

    const aiResult = await callOpenAI(body);

    if (!aiResult.success) {
      const errorResponse = createErrorResponse(
        "Desculpe, o assistente de IA está temporariamente indisponível. Já notifiquei um atendente para te ajudar."
      );
      return NextResponse.json(errorResponse, { status: aiResult.status });
    }

    const choice = aiResult.data.choices[0];
    if (!choice || !choice.message || !choice.message.content) {
      console.error("[MAGNUS_ROUTE] Resposta da OpenAI veio em formato inesperado.");
       const errorResponse = createErrorResponse(
        "O assistente de IA retornou uma resposta inválida. Um atendente humano assumirá o controle."
      );
      return NextResponse.json(errorResponse, { status: 500 });
    }

    // A resposta final é validada pelo parser, que pode lançar um erro
    const finalResponse = parseMagnusOutput(choice.message.content);
    return NextResponse.json(finalResponse);

  } catch (error: any) {
    console.error("[MAGNUS_ROUTE_FATAL]", error);
    const fallbackResponse = createErrorResponse(
        "Ocorreu um erro inesperado em nosso sistema. Um atendente humano já foi notificado e irá te ajudar."
    );
    return NextResponse.json(fallbackResponse, { status: 500 });
  }
}
