import { NextResponse } from 'next/server';

/**
 * API route to list channel configurations.
 */
export async function GET() {
  // Placeholder: In the future, this will call `settingsService.listChannels()`
  const mockChannels = [
    { id: 'channel-wa', name: 'WhatsApp', type: 'whatsapp', status: 'connected', ai_enabled: true },
    { id: 'channel-ig', name: 'Instagram', type: 'instagram', status: 'disconnected', ai_enabled: false },
  ];
  return NextResponse.json(mockChannels);
}
