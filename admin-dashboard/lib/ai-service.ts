import { ChatOpenAI } from '@langchain/openai';
import Groq from 'groq-sdk';
import { LangChainTracer } from '@langchain/core/tracers/tracer_langchain';

// AI Service that uses your available API keys
class AIService {
  private openaiClient: ChatOpenAI | null = null;
  private groqClient: Groq | null = null;
  private tracer: LangChainTracer | null = null;

  constructor() {
    // Initialize LangSmith tracer if configured
    if (process.env.LANGSMITH_API_KEY && process.env.LANGCHAIN_TRACING_V2 === 'true') {
      this.tracer = new LangChainTracer({
        projectName: process.env.LANGCHAIN_PROJECT || 'kent-traders-ai',
      });
      console.log('✅ LangSmith tracing enabled');
    }

    // Initialize OpenAI client if key is available
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-key') {
      this.openaiClient = new ChatOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        model: 'gpt-4o-mini', // Cost-effective model
        temperature: 0.7,
      });
      console.log('✅ OpenAI client initialized');
    }

    // Initialize Groq client if key is available
    if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your-groq-key') {
      this.groqClient = new Groq({
        apiKey: process.env.GROQ_API_KEY,
      });
      console.log('✅ Groq client initialized');
    }

    if (!this.openaiClient && !this.groqClient) {
      console.warn('⚠️ No AI providers available. Please check your API keys.');
    }
  }

  // Check which AI services are available
  getAvailableProviders() {
    const providers = [];
    if (this.groqClient) providers.push('Groq');
    if (this.openaiClient) providers.push('OpenAI');
    return providers;
  }

  // Simple chat completion with Groq (faster, preferred)
  async chatWithGroq(message: string, systemPrompt?: string) {
    if (!this.groqClient) {
      throw new Error('Groq client not available');
    }

    const messages: any[] = [];
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: message });

    try {
      const response = await this.groqClient.chat.completions.create({
        messages,
        model: 'llama-3.3-70b-versatile', // Updated to current working model
        temperature: 0.7,
        max_tokens: 1000,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Groq Chat Error:', error);
      throw error;
    }
  }

  // Simple chat completion with OpenAI (fallback) with tracing
  async chatWithOpenAI(message: string, systemPrompt?: string) {
    if (!this.openaiClient) {
      throw new Error('OpenAI client not available');
    }

    const messages = [];
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: message });

    try {
      const config = this.tracer ? { callbacks: [this.tracer] } : {};
      const response = await this.openaiClient.invoke(messages, config);
      return response.content;
    } catch (error) {
      console.error('OpenAI Chat Error:', error);
      throw error;
    }
  }

  // Smart chat that uses best available provider
  async chat(message: string, systemPrompt?: string) {
    // Prefer Groq for speed and cost-effectiveness
    if (this.groqClient) {
      try {
        return await this.chatWithGroq(message, systemPrompt);
      } catch (error) {
        console.warn('Groq failed, falling back to OpenAI:', error);
      }
    }

    // Fallback to OpenAI
    if (this.openaiClient) {
      return await this.chatWithOpenAI(message, systemPrompt);
    }

    throw new Error('No AI provider available');
  }

  // Kent Traders specific AI assistant
  async getBusinessInsight(query: string) {
    const systemPrompt = `You are an AI assistant for Kent Traders, a UK-based trading company. 
    You help with inventory management, market analysis, and business operations. 
    Provide helpful, professional responses focused on business efficiency and growth.
    Keep responses concise and actionable.`;

    return this.chat(query, systemPrompt);
  }

  // Test connectivity
  async testConnection() {
    const providers = this.getAvailableProviders();
    const results: any = { providers };

    for (const provider of providers) {
      try {
        if (provider === 'Groq') {
          const response = await this.chatWithGroq('Hello, are you working?');
          results.groq = { status: 'success', response: response.substring(0, 50) + '...' };
        } else if (provider === 'OpenAI') {
          const response = await this.chatWithOpenAI('Hello, are you working?');
          results.openai = { status: 'success', response: String(response).substring(0, 50) + '...' };
        }
      } catch (error) {
        results[provider.toLowerCase()] = { status: 'error', error: String(error) };
      }
    }

    return results;
  }
}

export const aiService = new AIService();
export default AIService;
