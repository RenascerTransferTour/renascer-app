import { NextResponse } from 'next/server';
import { settingsService } from '@/lib/db/services';

/**
 * API route to list AI prompt versions.
 */
export async function GET() {
  const prompts = await settingsService.listPrompts();
  return NextResponse.json(prompts);
}
