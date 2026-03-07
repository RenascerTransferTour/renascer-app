'use server';
import {modelRef, type ModelReference} from 'genkit/model';
import {settingsService} from '@/lib/db/services';

const modelMap = {
  gemini: 'googleai/gemini-2.5-flash',
  openai: 'openai/gpt-4-turbo',
};

/**
 * Selects the appropriate AI model based on application settings and provider availability.
 * It follows the logic:
 * 1. Use the provider defined for the specific flow (not yet implemented).
 * 2. Use the primary provider defined in the global settings.
 * 3. If primary is 'automatic' or unavailable, use a fallback (Gemini > OpenAI).
 * 4. Throws an error if no providers are configured.
 */
export async function getActiveModel(): Promise<ModelReference<any>> {
  const settings = await settingsService.getAiSettings();
  const activeProvider = settings.activeProvider; // 'gemini', 'openai', or 'automatic'

  const isGeminiConfigured = !!process.env.GEMINI_API_KEY;
  const isOpenAIConfigured = !!process.env.OPENAI_API_KEY;

  let providerToUse: 'gemini' | 'openai' | null = null;

  // Determine which provider to use based on settings and availability
  if (activeProvider === 'gemini' && isGeminiConfigured) {
    providerToUse = 'gemini';
  } else if (activeProvider === 'openai' && isOpenAIConfigured) {
    providerToUse = 'openai';
  } else if (activeProvider === 'automatic') {
    if (isGeminiConfigured) {
      providerToUse = 'gemini';
    } else if (isOpenAIConfigured) {
      providerToUse = 'openai';
    }
  } else {
    // The configured primary provider is not available, try to find any available one.
    if (isGeminiConfigured) {
      providerToUse = 'gemini';
    } else if (isOpenAIConfigured) {
      providerToUse = 'openai';
    }
  }

  if (!providerToUse) {
    throw new Error(
      'No AI provider is configured. Please set either GEMINI_API_KEY or OPENAI_API_KEY in your environment.'
    );
  }

  return modelRef(modelMap[providerToUse]);
}
