import {NextResponse} from 'next/server';
import {serverConfig} from '@/lib/server/config';

/**
 * API route to check the configuration status of AI providers.
 */
export async function GET() {
  const {geminiConfigured, openaiConfigured} =
    serverConfig.getProviderConfigStatus();
  return NextResponse.json({geminiConfigured, openaiConfigured});
}
