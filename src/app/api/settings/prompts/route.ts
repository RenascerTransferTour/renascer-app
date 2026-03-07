import { NextResponse } from 'next/server';
import { settingsService } from '@/lib/db/services';

/**
 * API route to list AI prompt versions.
 */
export async function GET(request: Request) {
  try {
    const prompts = await settingsService.listPrompts();
    return NextResponse.json(prompts);
  } catch (error) {
    console.error('[API GET /api/settings/prompts] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch prompts' }, { status: 500 });
  }
}

/**
 * API route to create or update an AI prompt.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    // In a real app, you would add validation here (e.g., with Zod)
    const updatedPrompt = await settingsService.updatePrompt(body);
    return NextResponse.json({ success: true, prompt: updatedPrompt });
  } catch (error) {
    console.error('[API POST /api/settings/prompts] Error:', error);
    return NextResponse.json({ error: 'Failed to save prompt' }, { status: 500 });
  }
}
