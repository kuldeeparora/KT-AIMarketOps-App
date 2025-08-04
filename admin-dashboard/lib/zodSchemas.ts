/**
 * Zod Schemas for validation
 */

import {
  z
} from 'zod';

export const inventoryItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  quantity: z.number().min(0),
  price: z.number().optional(),
  vendor: z.string().optional(),
  category: z.string().optional(),
  sku: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
  });

export const inventoryQuerySchema = z.object({
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  search: z.string().optional(),
  category: z.string().optional(),
  vendor: z.string().optional()
  });

export const alertThresholdSchema = z.object({
  id: z.string(),
  name: z.string(),
  condition: z.string(),
  value: z.number(),
  action: z.string(),
  enabled: z.boolean()
  });

export const orderSchema = z.object({
  id: z.number(),
  customer: z.string(),
  total: z.number(),
  status: z.string()
  });

export const shopifyConfigSchema = z.object({
  apiKey: z.string().optional(),
  shopDomain: z.string().optional()
  });

export const sellerDynamicsConfigSchema = z.object({
  retailerId: z.string(),
  encryptedLogin: z.string(),
  apiUrl: z.string()
  });
