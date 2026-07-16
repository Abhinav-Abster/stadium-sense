import { NextRequest, NextResponse } from 'next/server';
import { ChatInputSchema } from '@/lib/validation';
import { runApiGuards } from '@/lib/api-guard';
import { ResponseCache, chatCache } from '@/lib/cache';
import { generateResponse } from '@/lib/gemini';
import { ChatResponseSchema, chatGeminiSchema } from '@/lib/schemas';
import { getChatSystemPrompt } from '@/lib/prompts';
import { getStadiumById, getStadiumContextForPrompt } from '@/lib/stadium-data';

/**
 * POST /api/chat
 *
 * Multilingual navigation & accessibility assistant.
 * Accepts a fan's question and returns an AI-generated answer in the same language.
 *
 * Security: Input validated via Zod, rate-limited per IP, system/user prompts separated,
 * payload size checked, no PII persisted.
 */
export async function POST(request: NextRequest) {
  const guard = await runApiGuards(request, ChatInputSchema);
  if (!guard.ok) return guard.response;

  const { message, stadiumId } = guard.data;

  // Look up stadium data
  const stadium = getStadiumById(stadiumId);
  if (!stadium) {
    return NextResponse.json({ error: 'Stadium not found' }, { status: 404 });
  }

  // Check cache for repeated queries
  const cacheKey = ResponseCache.generateKey(`${stadiumId}:${message}`);
  const cached = chatCache.get(cacheKey);
  if (cached) {
    return NextResponse.json(
      { reply: cached, language: 'cached', cached: true },
      { status: 200, headers: { 'X-RateLimit-Remaining': String(guard.rateLimit.remaining) } }
    );
  }

  // Build prompt and call Gemini (system and user content kept separate)
  const stadiumContext = getStadiumContextForPrompt(stadium);
  const systemPrompt = getChatSystemPrompt(stadiumContext);

  const result = await generateResponse(
    systemPrompt,
    message,
    chatGeminiSchema,
    ChatResponseSchema
  );
  if (!result) {
    return NextResponse.json(
      { error: 'Failed to generate response. Please try again.' },
      { status: 502 }
    );
  }

  // Cache and return (no PII logged or persisted)
  chatCache.set(cacheKey, result.reply);
  return NextResponse.json(
    { reply: result.reply, language: result.language, cached: false },
    { status: 200, headers: { 'X-RateLimit-Remaining': String(guard.rateLimit.remaining) } }
  );
}
