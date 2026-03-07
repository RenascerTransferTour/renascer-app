import { NextResponse } from 'next/server';

/**
 * API route to get or update AI settings.
 */
export async function GET() {
  // Placeholder: In the future, this will call `settingsService.getAiSettings()`
  const mockSettings = {
    global_ai_enabled: true,
    ai_mode: 'assisted',
    require_human_approval: true,
    fallback_human_name: 'Claudia',
    active_provider: 'gemini',
  };
  return NextResponse.json(mockSettings);
}

export async function POST(request: Request) {
    const body = await request.json();
    console.log('[Mock AI Settings API] Received data for update:', body);
    // Placeholder: In the future, this will call `settingsService.updateAiSettings(body)`
    return NextResponse.json({ success: true, settings: body });
}
