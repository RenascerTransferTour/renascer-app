'use server';
import {NextResponse} from 'next/server';
import {serverConfig} from '@/lib/server/config';
import { settingsService } from '@/lib/db/services';
import type { AiSettings } from '@/lib/db/data-model';

export interface ProviderStatus {
  id: 'openai' | 'gemini';
  name: string;
  model: string;
  configured: boolean;
  enabled: boolean;
  status: string;
  message: string;
}

/**
 * API route to check the configuration status of AI providers.
 * This route is designed to be robust and never throw a 500 error
 * for configuration issues.
 */
export async function GET() {
  try {
    const { geminiConfigured, openaiConfigured } = serverConfig.getProviderConfigStatus();
    // This service call gets settings from the mock DB
    const settings: AiSettings = await settingsService.getAiSettings();

    const providers: ProviderStatus[] = [
      {
        id: 'openai',
        name: 'OpenAI (ChatGPT)',
        model: 'gpt-4-turbo',
        configured: openaiConfigured,
        // Check if it's the active provider or enabled as fallback
        enabled: settings.activeProvider === 'openai' || (settings.isFallbackEnabled && settings.fallbackProvider === 'openai'),
        status: openaiConfigured ? 'Configurado' : 'Não Configurado',
        message: openaiConfigured 
            ? 'Uma chave de API foi detectada no ambiente do servidor. O sistema pode tentar usar este provedor.' 
            : 'A chave OPENAI_API_KEY não foi encontrada no ambiente do servidor. A configuração deve ser feita no backend.'
      },
      {
        id: 'gemini',
        name: 'Gemini (Google)',
        model: 'gemini-2.5-flash',
        configured: geminiConfigured,
        enabled: settings.activeProvider === 'gemini' || (settings.isFallbackEnabled && settings.fallbackProvider === 'gemini') || settings.activeProvider === 'automatic',
        status: geminiConfigured ? 'Configurado' : 'Não Configurado',
        message: geminiConfigured 
            ? 'Uma chave de API foi detectada no ambiente do servidor. O sistema pode tentar usar este provedor.'
            : 'A chave GEMINI_API_KEY não foi encontrada no ambiente do servidor. A configuração deve ser feita no backend.'
      }
    ];

    return NextResponse.json(providers);
  } catch (error) {
      console.error('API Error fetching provider status:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected server error occurred.';
      return NextResponse.json({ error: 'Failed to fetch provider status', details: errorMessage }, { status: 500 });
  }
}
