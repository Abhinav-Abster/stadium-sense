import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';

/**
 * Singleton Gemini API client.
 * Initialized once to preserve resources — never re-instantiate per request.
 * @see https://ai.google.dev/gemini-api/docs
 */
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

/** Default model for all endpoints — fast/cheap tier. */
const DEFAULT_MODEL = 'gemini-3.5-flash';

/**
 * Generate a structured, Zod-validated response from Gemini.
 *
 * Security: System instruction and user content are kept strictly separate
 * (config.systemInstruction vs. contents) to prevent prompt injection.
 *
 * @param systemPrompt  - The system instruction (never includes raw user input)
 * @param userMessage   - The user's message (treated as untrusted input)
 * @param geminiSchema  - Gemini structured-output schema (sent to the API)
 * @param zodSchema     - Zod schema for runtime validation of the parsed response
 * @returns The validated response object, or null on failure
 */
export async function generateResponse<T>(
  systemPrompt: string,
  userMessage: string,
  geminiSchema: Record<string, unknown>,
  zodSchema: z.ZodSchema<T>
): Promise<T | null> {
  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: userMessage,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: geminiSchema,
      },
    });

    const text = response.text;
    if (!text) return null;

    const parsed: unknown = JSON.parse(text);
    return zodSchema.parse(parsed);
  } catch (error) {
    console.error(
      '[Gemini] API call failed:',
      error instanceof Error ? error.message : 'Unknown error'
    );
    return null;
  }
}
