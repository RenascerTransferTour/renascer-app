import { NextResponse } from 'next/server';
import { settingsService } from '@/lib/db/services';

/**
 * API route to get or update AI settings.
 */
export async function GET() {
  const settings = await settingsService.getAiSettings();
  return NextResponse.json(settings);
}

export async function POST(request: Request) {
    const body = await request.json();
    const settings = await settingsService.updateAiSettings(body);
    return NextResponse.json({ success: true, settings });
}
