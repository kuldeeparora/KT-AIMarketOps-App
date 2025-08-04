// Inventory insights generation using GROQ
/**
 * Generates inventory insights using AI (GROQ client)
 * @param {Object} params - { products, analysisType, timeHorizon, includeRecommendations }
 * @returns {Promise<Object>} AI-generated insights
 */
export async function generateInventoryInsights({ products, analysisType, timeHorizon, includeRecommendations }) {
  try {
    // Compose prompt for inventory insights
    const template = `You are an expert inventory analyst. Analyze the following product data and provide actionable insights.

Products:
{products}

Analysis Type: {analysisType}
Time Horizon: {timeHorizon}
Include Recommendations: {includeRecommendations}

Instructions:
- Identify low stock, out-of-stock, and overstocked items.
- Forecast demand and suggest reorder timing if needed.
- Highlight any risk factors or anomalies.
- Provide clear, actionable recommendations if requested.

Respond in structured JSON with keys: insights, riskFactors, recommendations.`;

    const prompt = processTemplate(template, {
      products: products.map(p => `SKU: ${p.sku}, Name: ${p.name}, Stock: ${p.currentStock}, AvgSales: ${p.averageSales || 'N/A'}, LastRestocked: ${p.lastRestocked || 'N/A'}, Category: ${p.category || 'N/A'}, Supplier: ${p.supplier || 'N/A'}, Seasonality: ${p.seasonality || 'N/A'}`).join('\n'),
      analysisType,
      timeHorizon,
      includeRecommendations: includeRecommendations ? 'Yes' : 'No'
    });

    const response = await groqClient.generateText(prompt, {
      model: config.defaultModel,
      temperature: config.temperature,
      maxTokens: 800
    });

    // Try to parse AI response as JSON, fallback to text
    let aiResult;
    try {
      aiResult = JSON.parse(response.text);
    } catch {
      aiResult = { insights: response.text };
    }

    return {
      ...aiResult,
      raw: response.text,
      metadata: {
        model: config.defaultModel,
        timestamp: new Date().toISOString(),
        tokensUsed: response.usage?.total_tokens || 0
      }
    };
  } catch (error) {
    console.error('Inventory insights generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      fallback: 'AI inventory insights generation failed'
    };
  }
}
// AI Workflow utility using existing GROQ integration
// This provides LangChain-like functionality without the dependency complexity
import { z } from 'zod';

// Import existing GROQ client
const groqClient = require('../../admin-dashboard/lib/ai/groqClient');

// Configuration
const config = {
  defaultModel: 'llama3-70b-8192',
  temperature: 0.7
};

// Validation schemas
const ProductDescriptionInputSchema = z.object({
  productName: z.string().min(1, 'Product name is required'),
  features: z.array(z.string()).min(1, 'At least one feature is required'),
  category: z.string().optional(),
  targetAudience: z.string().optional(),
  tone: z.enum(['professional', 'casual', 'technical', 'marketing']).optional()
});

const InventoryInsightInputSchema = z.object({
  productData: z.array(z.object({
    name: z.string(),
    sku: z.string(),
    quantity: z.number(),
    salesVelocity: z.number().optional(),
    cost: z.number().optional()
  })),
  timeframe: z.enum(['daily', 'weekly', 'monthly']).optional(),
  analysisType: z.enum(['reorder', 'trend', 'optimization']).optional()
});

// Template processing utility
