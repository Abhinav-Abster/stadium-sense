import { z } from 'zod';

/** Schema for the /api/chat endpoint */
export const ChatInputSchema = z.object({
  message: z
    .string()
    .min(1, 'Message is required')
    .max(500, 'Message must be 500 characters or less'),
  stadiumId: z.string().min(1, 'Stadium ID is required'),
  locale: z.enum(['en', 'es', 'fr', 'pt']).optional().default('en'),
});

/** Schema for the /api/crowd-status endpoint */
export const CrowdStatusInputSchema = z.object({
  stadiumId: z.string().min(1, 'Stadium ID is required'),
});

/** Schema for the /api/transport-tip endpoint */
export const TransportTipInputSchema = z.object({
  origin: z.string().min(1, 'Origin is required').max(200, 'Origin must be 200 characters or less'),
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
