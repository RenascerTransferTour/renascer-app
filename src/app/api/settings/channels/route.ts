import { NextResponse } from 'next/server';
import { settingsService } from '@/lib/db/services';
import type { Channel } from '@/lib/db/data-model';

/**
 * API route to list channel configurations.
 */
export async function GET() {
  try {
    const channels = await settingsService.listChannels();
    return NextResponse.json(channels);
  } catch (error) {
    console.error('API Error fetching channels:', error);
    return NextResponse.json({ error: 'Failed to fetch channels' }, { status: 500 });
  }
}


/**
 * API route to update channel configurations.
 */
export async function POST(request: Request) {
    try {
      const body = await request.json();
      const updatedChannels = await settingsService.updateChannels(body as Channel[]);
      return NextResponse.json({ success: true, channels: updatedChannels });
    } catch (error) {
       console.error('API Error updating channels:', error);
       return NextResponse.json({ error: 'Failed to save channel settings' }, { status: 500 });
    }
}
