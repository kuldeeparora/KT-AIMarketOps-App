/**
 * GROQ AI Client - Comprehensive AI Integration
 * Provides intelligent analysis for inventory, analytics, and business intelligence
 */

export interface GroqAnalysisRequest {
  data: any;
  analysisType: 'inventory' | 'analytics' | 'predictions' | 'insights' | 'recommendations';
  context?: string;
  model?: string;
}

export interface GroqAnalysisResponse {
  success: boolean;
  analysis: string;
  insights: string[];
  recommendations: string[];
  confidence: number;
  model: string;
  timestamp: string;
}

export class GroqClient {
  private apiKey: string;
  private baseURL: string;
  private models: {
    fast: string;
    balanced: string;
    powerful: string;
  };

  constructor() {
    this.apiKey = process.env.GROQ_API_KEY || '';
    this.baseURL = 'https://api.groq.com/openai/v1';
    this.models = {
      fast: 'llama3-8b-8192',
      balanced: 'mixtral-8x7b-32768',
      powerful: 'llama3-70b-8192'
    };
  }

  async initialize(): Promise<boolean> {
    if (!this.apiKey) {
      console.error('[GROQ] API key not configured');
      return false;
    }
    return true;
  }

  async analyzeInventory(data: any): Promise<GroqAnalysisResponse> {
    const prompt = this.buildInventoryAnalysisPrompt(data);
    return this.performAnalysis(prompt, 'inventory', this.models.balanced);
  }

  async analyzeAnalytics(data: any): Promise<GroqAnalysisResponse> {
    const prompt = this.buildAnalyticsPrompt(data);
    return this.performAnalysis(prompt, 'analytics', this.models.powerful);
  }

  async generatePredictions(data: any): Promise<GroqAnalysisResponse> {
    const prompt = this.buildPredictionPrompt(data);
    return this.performAnalysis(prompt, 'predictions', this.models.powerful);
  }

  async generateInsights(data: any): Promise<GroqAnalysisResponse> {
    const prompt = this.buildInsightsPrompt(data);
    return this.performAnalysis(prompt, 'insights', this.models.balanced);
  }

  async generateRecommendations(data: any): Promise<GroqAnalysisResponse> {
    const prompt = this.buildRecommendationsPrompt(data);
    return this.performAnalysis(prompt, 'recommendations', this.models.balanced);
  }

  private buildInventoryAnalysisPrompt(data: any): string {
    return `You are an expert inventory management AI analyst. Analyze the following inventory data and provide:

1. **Stock Level Analysis**: Identify items with low stock, overstock, or optimal levels
2. **Trend Analysis**: Identify patterns in stock movements
3. **Risk Assessment**: Highlight potential stockout risks
4. **Optimization Opportunities**: Suggest improvements for inventory management

Inventory Data:
${JSON.stringify(data, null, 2)}

Provide your analysis in a structured format with clear insights and actionable recommendations.`;
  }

  private buildAnalyticsPrompt(data: any): string {
    return `You are a business intelligence AI analyst. Analyze the following business data and provide:

1. **Performance Metrics**: Key performance indicators and trends
2. **Revenue Analysis**: Revenue patterns and growth opportunities
3. **Customer Insights**: Customer behavior and preferences
4. **Operational Efficiency**: Process optimization opportunities

Business Data:
${JSON.stringify(data, null, 2)}

Provide comprehensive analysis with data-driven insights and strategic recommendations.`;
  }

  private buildPredictionPrompt(data: any): string {
    return `You are a predictive analytics AI expert. Based on the following historical data, provide:

1. **Demand Forecasting**: Predict future demand patterns
2. **Trend Predictions**: Identify emerging trends
3. **Risk Predictions**: Forecast potential risks
4. **Opportunity Predictions**: Identify growth opportunities

Historical Data:
${JSON.stringify(data, null, 2)}

Provide predictions with confidence levels and supporting rationale.`;
  }

  private buildInsightsPrompt(data: any): string {
    return `You are a business insights AI specialist. Extract meaningful insights from the following data:

1. **Key Patterns**: Identify important patterns and correlations
2. **Anomalies**: Detect unusual patterns or outliers
3. **Opportunities**: Identify growth and optimization opportunities
4. **Risks**: Highlight potential risks and challenges

Data:
${JSON.stringify(data, null, 2)}

Provide clear, actionable insights that can drive business decisions.`;
  }

  private buildRecommendationsPrompt(data: any): string {
    return `You are a strategic business advisor AI. Based on the following data, provide:

1. **Immediate Actions**: Quick wins and urgent recommendations
2. **Strategic Initiatives**: Long-term strategic recommendations
3. **Process Improvements**: Operational efficiency recommendations
4. **Technology Recommendations**: Digital transformation suggestions

Business Data:
${JSON.stringify(data, null, 2)}

Provide prioritized recommendations with expected impact and implementation guidance.`;
  }

  private async performAnalysis(
    prompt: string, 
    analysisType: string, 
    model: string
  ): Promise<GroqAnalysisResponse> {
    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert AI analyst providing business intelligence and strategic insights.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 2000,
          top_p: 0.9,
        }),
      });

      if (!response.ok) {
        throw new Error(`GROQ API error: ${response.status}`);
      }

      const result = await response.json();
      const analysis = result.choices[0]?.message?.content || 'No analysis generated';

      return {
        success: true,
        analysis,
        insights: this.extractInsights(analysis),
        recommendations: this.extractRecommendations(analysis),
        confidence: 0.85,
        model,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('[GROQ] Analysis failed:', error);
      return {
        success: false,
        analysis: 'Analysis failed due to technical issues',
        insights: [],
        recommendations: [],
        confidence: 0,
        model,
        timestamp: new Date().toISOString()
      };
    }
  }

  private extractInsights(analysis: string): string[] {
    const insights: string[] = [];
    const lines = analysis.split('\n');
    
    for (const line of lines) {
      if (line.includes('•') || line.includes('-') || line.includes('*')) {
        const insight = line.replace(/^[•\-\*]\s*/, '').trim();
        if (insight.length > 10) {
          insights.push(insight);
        }
      }
    }
    
    return insights.slice(0, 5); // Return top 5 insights
  }

  private extractRecommendations(analysis: string): string[] {
    const recommendations: string[] = [];
    const lines = analysis.split('\n');
    
    for (const line of lines) {
      if (line.toLowerCase().includes('recommend') || 
          line.toLowerCase().includes('suggest') || 
          line.toLowerCase().includes('action')) {
        const recommendation = line.trim();
        if (recommendation.length > 10) {
          recommendations.push(recommendation);
        }
      }
    }
    
    return recommendations.slice(0, 3); // Return top 3 recommendations
  }

  // Utility method for testing GROQ connection
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });
      return response.ok;
    } catch (error) {
      console.error('[GROQ] Connection test failed:', error);
      return false;
    }
  }
}

export default GroqClient;
