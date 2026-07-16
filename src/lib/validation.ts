import { z } from 'zod';

/**
 * Shared input-length limits.
 *
 * Single source of truth for both server-side Zod validation and the
 * client-side `maxLength` props on the corresponding form inputs, so the
 * two never drift out of sync.
 */
export const MAX_MESSAGE_LENGTH = 500;
export const MAX_ORIGIN_LENGTH = 200;

/** Schema for the /api/chat endpoint */
export const ChatInputSchema = z.object({
  message: z
    .string()
    .min(1, 'Message is required')
    .max(MAX_MESSAGE_LENGTH, `Message must be ${MAX_MESSAGE_LENGTH} characters or less`),
  stadiumId: z.string().min(1, 'Stadium ID is required'),
  locale: z.enum(['en', 'es', 'fr', 'pt']).optional().default('en'),
});

/** Schema for the /api/crowd-status endpoint */
export const CrowdStatusInputSchema = z.object({
  stadiumId: z.string().min(1, 'Stadium ID is required'),
});

/** Schema for the /api/transport-tip endpoint */
export const TransportTipInputSchema = z.object({
  origin: z
    .string()
    .min(1, 'Origin is required')
    .max(MAX_ORIGIN_LENGTH, `Origin must be ${MAX_ORIGIN_LENGTH} characters or less`),
  stadiumId: z.string().min(1, 'Stadium ID is required'),
});

/** Parsed and validated input type for the /api/chat endpoint. */
export type ChatInput = z.infer<typeof ChatInputSchema>;

/** Parsed and validated input type for the /api/crowd-status endpoint. */
export type CrowdStatusInput = z.infer<typeof CrowdStatusInputSchema>;

/** Parsed and validated input type for the /api/transport-tip endpoint. */
export type TransportTipInput = z.infer<typeof TransportTipInputSchema>;

/**
 * Validate request body against a Zod schema.
 * Returns parsed data on success, or an array of Zod issues on failure.
 *
 * @param schema - The Zod schema to validate against.
 * @param data - The unknown input data to validate.
 * @returns An object with `success: true` and parsed `data`, or `success: false` and `errors`.
 */
export function validateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodIssue[] } {
  const result = schema.safeParse(data);
  if (result.success) return { success: true, data: result.data };
  return { success: false, errors: result.error.issues };
}