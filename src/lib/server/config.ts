'use server';

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
   */
  getOpenAiApiKey: (): string | undefined => {
    return process.env.OPENAI_API_KEY;
  },

  /**
   * Retrieves the Gemini API key from environment variables.
   * This is a placeholder for a secure secret management solution.
   */
  getGeminiApiKey: (): string | undefined => {
    return process.env.GEMINI_API_KEY;
  },

  /**
   * Retrieves the Meta API token for WhatsApp, Instagram, etc.
   * This is a placeholder for a secure secret management solution.
   */
  getMetaApiToken: (): string | undefined => {
    return process.env.META_API_TOKEN;
  },
};

console.log('Server config loaded.');
if (!serverConfig.getOpenAiApiKey()) {
  console.warn('OPENAI_API_KEY is not set in the environment.');
}
if (!serverConfig.getGeminiApiKey()) {
  console.warn('GEMINI_API_KEY is not set in the environment.');
}
