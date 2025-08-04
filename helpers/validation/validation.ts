import { ZodSchema, ZodError } from 'zod';
import { VALID_SORT_FIELDS } from '../types/inventory';

/**
 * Validates input with a Zod schema and maps sortBy to allowed enum values.
 * Returns { success, data, errors }.
 */
export function validateWithZod<T>(schema: ZodSchema, input: any): { success: boolean; data?: T; errors?: any[] } {
  const result = schema.safeParse(input);
  if (!result.success) {
    // result is SafeParseError
    const errorResult = result as import('zod').SafeParseError<any>;
    return { success: false, errors: errorResult.error.errors };
  }
  const data = result.data as T;
  // Map sortBy to allowed enum values if present
  if (data && (data as any).sortBy && !VALID_SORT_FIELDS.includes((data as any).sortBy)) {
    return { success: false, errors: [{ path: ['sortBy'], message: `Invalid sortBy value: ${(data as any).sortBy}` }] };
  }
  return { success: true, data };
}
