/**
 * @fileoverview Server-side configuration management.
 * This module is responsible for securely accessing environment variables
 * and other server-only configurations.
 *
 * IMPORTANT: This file should only be imported and used on the server.
 * Never expose these values to the client-side.
 */

export const serverConfig = {
  /**
   * Retrieves the OpenAI API key from environment variables.
   * This is a placeholder for a secure secret management solution.
   * @returns {string | undefined} The API key or undefined if not set.
   */
  getOpenAiApiKey: (): string | undefined => {
    return process.env.OPENAI_API_KEY;
  },

  /**
   * Retrieves the Gemini API key from environment variables.
   * This is a placeholder for a secure secret management solution.
   * @returns {string | undefined} The API key or undefined if not set.
   */
  getGeminiApiKey: (): string | undefined => {
    return process.env.GEMINI_API_KEY;
  },

  /**
   * Retrieves the Meta API token for WhatsApp, Instagram, etc.
   * This is a placeholder for a secure secret management solution.
   * @returns {string | undefined} The API token or undefined if not set.
   */
  getMetaApiToken: (): string | undefined => {
    return process.env.META_API_TOKEN;
  },

  /**
   * Checks which AI providers are configured via environment variables.
   * This function is safe to call from API routes to inform the client
   * about provider availability without exposing the keys themselves.
   * @returns An object indicating the configuration status of each provider.
   */
  getProviderConfigStatus: () => {
    return {
      geminiConfigured: !!process.env.GEMINI_API_KEY,
      openaiConfigured: !!process.env.OPENAI_API_KEY,
    };
  },
};

// This log runs on the server during build and runtime, it is not sent to the client.
console.log('[Server Config] Initializing...');
if (!serverConfig.getOpenAiApiKey()) {
  console.warn('[Server Config] OPENAI_API_KEY is not set. OpenAI provider will be unavailable.');
}
if (!serverConfig.getGeminiApiKey()) {
  console.warn('[Server Config] GEMINI_API_KEY is not set. Gemini provider will be unavailable.');
}
