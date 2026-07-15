import { GoogleGenAI, Type } from '@google/genai';

/**
 * Singleton Gemini API client.
 * Initialized once to preserve resources — never re-instantiate per request.
 * @see https://ai.google.dev/gemini-api/docs
 */
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

/** Default model for all endpoints — fast/cheap tier. */
const DEFAULT_MODEL = 'gemini-3.1-flash-lite';

/**
 * Response schema for the /api/chat endpoint.
 * Enforces structured JSON output from Gemini.
 */
export const chatResponseSchema = {
  type: Type.OBJECT,
  properties: {
    reply: {
      type: Type.STRING,
      description: 'The assistant reply in the same language as the user message',
    },
    language: {
      type: Type.STRING,
      description: 'ISO 639-1 language code of the reply (e.g., en, es, fr, pt)',
    },
  },
  required: ['reply', 'language'],
};

/**
 * Response schema for the /api/crowd-status endpoint.
 */
export const crowdStatusResponseSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: 'Plain-language summary of current crowd conditions',
    },
    recommendation: {
      type: Type.STRING,
      description: 'Actionable recommendation for staff',
    },
    alertLevel: {
      type: Type.STRING,
      description: 'Alert level: low, medium, or high',
    },
  },
  required: ['summary', 'recommendation', 'alertLevel'],
};

/**
 * Response schema for the /api/transport-tip endpoint.
 */
export const transportTipResponseSchema = {
  type: Type.OBJECT,
  properties: {
    suggestion: {
      type: Type.STRING,
      description: 'Transit/shuttle suggestion for the fan',
    },
    estimatedCO2Saving: {
      type: Type.STRING,
      description: 'Estimated CO2 saving vs. driving (e.g., "2.5 kg CO2")',
    },
  },
  required: ['suggestion', 'estimatedCO2Saving'],
};

/** Generic type for any structured response schema. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ResponseSchema = Record<string, any>;

/**
 * Generate a structured response from Gemini.
 *
 * Security: System instruction and user content are kept strictly separate
 * (config.systemInstruction vs. contents) to prevent prompt injection.
 *
 * @param systemPrompt - The system instruction (never includes raw user input)
 * @param userMessage - The user's message (treated as untrusted input)
 * @param responseSchema - Optional schema to enforce structured JSON output
 * @returns The parsed response object, or null on failure
 */
export async function generateResponse<T>(
  systemPrompt: string,
  userMessage: string,
  responseSchema?: ResponseSchema
): Promise<T | null> {
  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: userMessage,
      config: {
        systemInstruction: systemPrompt,
        ...(responseSchema && {
          responseMimeType: 'application/json',
          responseSchema,
        }),
      },
    });

    const text = response.text;
    if (!text) return null;

    // If a schema was provided, parse the JSON response
    if (responseSchema) {
      return JSON.parse(text) as T;
    }

    // Otherwise return the raw text wrapped in a generic object
    return { reply: text } as T;
  } catch (error) {
    // Log error without exposing sensitive details
    console.error('[Gemini] API call failed:', error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
}
