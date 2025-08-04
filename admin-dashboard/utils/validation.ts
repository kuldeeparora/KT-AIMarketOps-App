/**
 * Validation utilities for Kent Traders Platform
 */

import {
  ZodSchema, ZodError
} from 'zod';

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: Array<{
    path: string[];
    message: string;
  }>;
}

/**
 * Validates input with a Zod schema and maps sortBy to allowed enum values.
 * Returns a ValidationResult with success status, and either data or errors.
 */
export function validateInput<T>(
  schema: ZodSchema<T>,
  data: unknown,
): ValidationResult<T> {
  const result = schema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.issues.map(issue => ({
        path: issue.path.map(p => String(p)),
        message: issue.message
      }))
    };
  }

  return {
    success: true,
    data: result.data
  };
}

/**
 * Validates sortBy parameter against allowed values
 */
export function validateSortBy(
  sortBy: string,
  allowedFields: string[],
): ValidationResult<string> {
  if (!allowedFields.includes(sortBy)) {
    return {
      success: false,
      errors: [
        {
          path: ['sortBy'],
          message: `Invalid sortBy value: ${sortBy}. Allowed values: ${allowedFields.join(', ')}`
        }
      ]
    };
  }

  return {
    success: true,
    data: sortBy
  };
}
