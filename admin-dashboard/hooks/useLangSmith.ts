// admin-dashboard/hooks/useLangSmith.ts
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface TrackingData {
  type: string;
  input: any;
  response?: any;
  error?: string;
  metadata?: Record<string, any>;
}

export function useLangSmith() {
  const trackInteraction = useCallback(async (data: TrackingData) => {
    try {
      await fetch('/api/ai/tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          runId: uuidv4(),
          timestamp: new Date().toISOString(),
          ...data
        })
      });
    } catch (error) {
      console.error('Failed to track interaction:', error);
    }
  }, []);

  return { trackInteraction };
}