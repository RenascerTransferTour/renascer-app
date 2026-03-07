import { NextResponse } from 'next/server';

/**
 * API route to list conversations.
 * In a real application, this would fetch data from a service layer
 * that interacts with a database.
 */
export async function GET() {
  // Placeholder: In the future, this will call `conversationService.listConversations()`
  const mockConversations = [
    { id: 'conv-1', status: 'pending_human', last_message_at: new Date().toISOString() },
    { id: 'conv-2', status: 'open', last_message_at: new Date().toISOString() },
  ];
  return NextResponse.json(mockConversations);
}
