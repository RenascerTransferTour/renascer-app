import { NextResponse } from 'next/server';
import { conversationService } from '@/lib/db/services';

/**
 * API route to add a new message to a conversation.
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const conversationId = params.id;
    const body = await request.json();

    if (!body.content || typeof body.content !== 'string') {
      return NextResponse.json({ error: 'Message content is required and must be a string.' }, { status: 400 });
    }
    
    // In a real application, sender information would come from an authenticated session.
    // For now, we'll hardcode the primary operator, Cláudia.
    const sender = { type: 'agent' as const, id: 'op-1', name: 'Cláudia Vaz' }; 

    const newMessage = await conversationService.addMessage(
      conversationId,
      body.content,
      sender
    );

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error(`API Error adding message to conversation ${params.id}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

    