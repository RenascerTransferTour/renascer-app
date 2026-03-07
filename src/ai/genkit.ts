import {genkit, type Plugin} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {openAI} from 'genkitx-openai';

const plugins: Plugin<any>[] = [];

// Conditionally add Google AI plugin
if (process.env.GEMINI_API_KEY) {
  plugins.push(googleAI());
}

// Conditionally add OpenAI plugin
if (process.env.OPENAI_API_KEY) {
  plugins.push(openAI());
}

let defaultModel: string | undefined = undefined;
if (process.env.GEMINI_API_KEY) {
  defaultModel = 'googleai/gemini-2.5-flash';
} else if (process.env.OPENAI_API_KEY) {
  defaultModel = 'openai/gpt-4-turbo'; // A reasonable default
}

export const ai = genkit({
  plugins,
  // Only set a default model if a provider is configured.
  // This will force flows to specify a model or fail, which is better than silent failure.
  ...(defaultModel ? {model: defaultModel} : {}),
});
