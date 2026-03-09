import { NextResponse } from 'next/server';
import { conversationService } from '@/lib/db/services';

// Força a rota a ser dinâmica, desabilitando o cache.
// Essencial para que os dados sejam atualizados após um reset do sistema.
export const dynamic = 'force-dynamic';

/**
 * API route to list conversations.
 * This now uses the service layer to fetch data.
 */
export async function GET() {
  try {
    const conversations = await conversationService.listConversations();
    return NextResponse.json(conversations);
  } catch (error) {
    console.error('API Error fetching conversations:', error);
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}
