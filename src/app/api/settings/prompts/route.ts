import { NextResponse } from 'next/server';

/**
 * API route to list AI prompt versions.
 */
export async function GET() {
  // Placeholder: In the future, this will call `settingsService.listPrompts()`
  const mockPrompts = [
    { id: 'prompt-v3', version_name: 'v3 - Handoff Rules', status: 'published', created_at: new Date().toISOString() },
    { id: 'prompt-v4', version_name: 'v4 - Draft for testing', status: 'draft', created_at: new Date().toISOString() },
  ];
  return NextResponse.json(mockPrompts);
}
