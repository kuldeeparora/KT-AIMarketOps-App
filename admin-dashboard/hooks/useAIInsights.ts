import { useState, useCallback } from 'react';

export interface AIAnalysisRequest {
  analysisType: 'inventory' | 'analytics' | 'predictions' | 'insights' | 'recommendations';
  data: any;
  context?: string;
  model?: string;
}

export interface AIAnalysisResponse {
  success: boolean;
  analysis: string;
  insights: string[];
  recommendations: string[];
  confidence: number;
  model: string;
  timestamp: string;
}

export interface UseAIInsightsReturn {
  analyzeData: (request: AIAnalysisRequest) => Promise<AIAnalysisResponse>;
  isLoading: boolean;
  error: string | null;
  lastAnalysis: AIAnalysisResponse | null;
}

export const useAIInsights = (): UseAIInsightsReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAnalysis, setLastAnalysis] = useState<AIAnalysisResponse | null>(null);

  const analyzeData = useCallback(async (request: AIAnalysisRequest): Promise<AIAnalysisResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/groq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'AI analysis failed');
      }

      if (result.success) {
        setLastAnalysis(result.data);
        return result.data;
      } else {
        throw new Error(result.message || 'Analysis failed');
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      
      // Return fallback response
      return {
        success: false,
        analysis: 'AI analysis is currently unavailable. Please try again later.',
        insights: [],
        recommendations: [],
        confidence: 0,
        model: 'fallback',
        timestamp: new Date().toISOString()
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    analyzeData,
    isLoading,
    error,
    lastAnalysis,
  };
};
