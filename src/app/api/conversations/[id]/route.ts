import { NextResponse } from 'next/server';
import { conversationService } from '@/lib/db/services';

// Força a rota a ser dinâmica, desabilitando o cache.
// Essencial para que os dados sejam atualizados após um reset do sistema.
export const dynamic = 'force-dynamic';

/**
 * API route to get a single conversation by its ID.
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const conversation = await conversationService.getConversationDetails(id);

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    return NextResponse.json(conversation);
  } catch (error) {
    console.error(`API Error fetching conversation ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch conversation' }, { status: 500 });
  }
}
