import { NextResponse } from 'next/server';
import { settingsService } from '@/lib/db/services';

/**
 * API route to get or update AI settings.
 */
export async function GET() {
  try {
    const settings = await settingsService.getAiSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('[API GET /api/settings/ai] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch AI settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const settings = await settingsService.updateAiSettings(body);
        return NextResponse.json({ success: true, settings });
    } catch (error) {
        console.error('[API POST /api/settings/ai] Error:', error);
        return NextResponse.json({ error: 'Failed to save AI settings' }, { status: 500 });
    }
}
