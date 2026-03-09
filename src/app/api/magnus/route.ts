
import { NextRequest, NextResponse } from "next/server";
import { intelligentCustomerSupport, IntelligentCustomerSupportInput } from "@/ai/flows/intelligent-customer-support-flow";
import { buildMagnusInput } from "@/ai/prompts/magnus-input-builder";
import type { MagnusOutput } from "@/ai/prompts/magnus-types";

// Tipagem para o corpo da requisição que chega do n8n ou outro serviço.
type RequestBody = {
  conversationId: string;
  customerId: string;
  text?: string | null;
  mediaTypes?: string[];
  conversationHistory?: { role: 'user' | 'model', content: string }[];
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

/**
 * Rota de API para o MAGNUS.
 * Refatorada para usar o fluxo Genkit `intelligentCustomerSupportFlow`, que é mais robusto.
 * Ele lida com a ausência de provedores de IA, gerencia a seleção de modelos (OpenAI/Gemini)
 * e evita crashes diretos por variáveis de ambiente ausentes.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RequestBody;

    if (!body.conversationId || !body.customerId) {
      return NextResponse.json(
        { error: "conversationId e customerId são obrigatórios." },
        { status: 400 }
      );
    }
    
    // O `buildMagnusInput` cria um objeto de entrada padronizado, mas o fluxo de IA
    // espera um formato ligeiramente diferente. Mapeamos os campos aqui.
    const magnusInput = buildMagnusInput({
      conversationId: body.conversationId,
      customerId: body.customerId,
      text: body.text ?? null,
      mediaTypes: body.mediaTypes ?? [],
      metadata: body.metadata,
      state: body.state,
      channel: "whatsapp",
    });

    // Se não houver mensagem de texto, não precisamos chamar a IA.
    // O prompt do MAGNUS já lida com isso, mas é uma otimização.
    if (!magnusInput.has_text) {
      const silentOutput: MagnusOutput = {
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
        collected_data: { customer_name: null, origin: null, destination: null, date: null, time: null, passengers: null, bags: null, bag_size: null, child: null, region_interest: null, trip_destination_city: null },
        messages: [],
      };
      return NextResponse.json(silentOutput);
    }

    // Prepara a entrada para o fluxo Genkit.
    const flowInput: IntelligentCustomerSupportInput = {
        customerMessage: magnusInput.last_customer_message,
        conversationHistory: body.conversationHistory ?? [],
    };
    
    // Chama o fluxo Genkit, que contém toda a lógica de seleção de modelo e fallback.
    const result = await intelligentCustomerSupport(flowInput);

    // O fluxo já retorna o objeto no formato JSON esperado.
    return NextResponse.json(result);

  } catch (error) {
    console.error("[MAGNUS_ROUTE_ERROR]", error);

    // Retorno de erro genérico caso a própria rota falhe (ex: JSON inválido).
    return NextResponse.json(
      {
        error: "Falha ao processar a requisição na rota MAGNUS.",
        details: error instanceof Error ? error.message : "Erro desconhecido.",
      },
      { status: 500 }
    );
  }
}
