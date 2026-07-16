import { z } from 'zod';

const mockGenerateContent = jest.fn();

jest.mock('@google/genai', () => {
  return {
    GoogleGenAI: jest.fn().mockImplementation(() => {
      return {
        models: {
          generateContent: (...args: unknown[]) => mockGenerateContent(...args),
        },
      };
    }),
    Type: {
      OBJECT: 'OBJECT',
      STRING: 'STRING',
      ARRAY: 'ARRAY',
    },
  };
});

import { generateResponse } from '@/lib/gemini';
import { chatGeminiSchema, ChatResponseSchema } from '@/lib/schemas';

describe('Gemini API Wrapper', () => {
  beforeEach(() => {
    mockGenerateContent.mockReset();
  });

  it('should call generateContent with separate system instructions and user message', async () => {
    mockGenerateContent.mockResolvedValue({
      text: JSON.stringify({ reply: 'Hello World', language: 'en' }),
    });

    const systemPrompt = 'You are a bot';
    const userMessage = 'Hi';
    const result = await generateResponse(
      systemPrompt,
      userMessage,
      chatGeminiSchema,
      ChatResponseSchema
    );

    expect(result).toEqual({ reply: 'Hello World', language: 'en' });
    expect(mockGenerateContent).toHaveBeenCalledWith({
      model: 'gemini-3.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: chatGeminiSchema,
      },
    });
  });

  it('should reject malformed Gemini output that fails Zod validation', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    mockGenerateContent.mockResolvedValue({
      text: JSON.stringify({ wrong_field: 'oops' }),
    });

    const result = await generateResponse('system', 'user', chatGeminiSchema, ChatResponseSchema);

    expect(result).toBeNull();
    spy.mockRestore();
  });

  it('should handle API errors and return null gracefully without throwing', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    mockGenerateContent.mockRejectedValue(new Error('API quota exceeded'));

    const testSchema = z.object({ reply: z.string() });
    const result = await generateResponse('system', 'user', {}, testSchema);
    expect(result).toBeNull();

    spy.mockRestore();
  });
});
