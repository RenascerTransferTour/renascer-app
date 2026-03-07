import { NextResponse } from 'next/server';
import { settingsService } from '@/lib/db/services';

/**
 * API route to list channel configurations.
 */
export async function GET() {
  const channels = await settingsService.listChannels();
  return NextResponse.json(channels);
}
