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

import { generateResponse, chatResponseSchema } from '@/lib/gemini';

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
    const result = await generateResponse<{ reply: string; language: string }>(
      systemPrompt,
      userMessage,
      chatResponseSchema
    );

    expect(result).toEqual({ reply: 'Hello World', language: 'en' });
    expect(mockGenerateContent).toHaveBeenCalledWith({
      model: 'gemini-3.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: chatResponseSchema,
      },
    });
  });

  it('should handle API errors and return null gracefully without throwing', async () => {
    // Suppress console.error in tests
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    mockGenerateContent.mockRejectedValue(new Error('API quota exceeded'));

    const result = await generateResponse('system', 'user');
    expect(result).toBeNull();
    
    spy.mockRestore();
  });
});
