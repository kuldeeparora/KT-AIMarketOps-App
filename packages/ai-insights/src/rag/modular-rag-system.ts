// Modular RAG System - Scalable and Extensible
import { BaseModule, BaseConfig, BaseConfigSchema } from '../core/base-module';
import { ChatOpenAI } from '@langchain/openai';
import { OpenAIEmbeddings } from '@langchain/openai';
import { MemoryVectorStore } from '@langchain/community/vectorstores/memory';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { z } from 'zod';

// RAG-specific schemas
const RAGConfigSchema = BaseConfigSchema.extend({
  modelName: z.string().default('gpt-4'),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().min(100).max(4000).default(2000),
  chunkSize: z.number().min(100).max(2000).default(1000),
  chunkOverlap: z.number().min(0).max(500).default(200)
});

export type RAGConfig = z.infer<typeof RAGConfigSchema>;

const RAGResponseSchema = z.object({
  content: z.string(),
  sources: z.array(z.string()),
  confidence: z.number().min(0).max(1),
  metadata: z.record(z.any()).optional()
});

export type RAGResponse = z.infer<typeof RAGResponseSchema>;

export class ModularRAGSystem extends BaseModule {
  private llm: ChatOpenAI | null = null;
  private embeddings: OpenAIEmbeddings | null = null;
  private vectorStore: MemoryVectorStore | null = null;
  private textSplitter: RecursiveCharacterTextSplitter;
  private documents: string[] = [];

  constructor(config: Partial<RAGConfig> = {}) {
    super(config);
    this.textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: config.chunkSize || 1000,
      chunkOverlap: config.chunkOverlap || 200
    });
  }

  protected getModuleName(): string {
    return 'Modular RAG System';
  }

  protected async initialize(): Promise<void> {
    try {
      // Initialize LLM
      this.llm = new ChatOpenAI({
        modelName: this.config.modelName as any,
        temperature: this.config.temperature,
        maxTokens: this.config.maxTokens,
        openAIApiKey: process.env.OPENAI_API_KEY
      });

      // Initialize embeddings
      this.embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY
      });

      // Initialize vector store
      this.vectorStore = await MemoryVectorStore.fromTexts(
        ['Initial document'],
        [{ id: 1 }],
        this.embeddings
      );

      this.updateMetrics('initialization', 1);
    } catch (error) {
      throw new Error(`RAG System initialization failed: ${error}`);
    }
  }

  protected async execute(input: any): Promise<RAGResponse> {
    const query = typeof input === 'string' ? input : input.query || input;
    
    if (!this.vectorStore || !this.llm) {
      throw new Error('RAG System not properly initialized');
    }

    try {
      // Perform similarity search
      const docs = await this.vectorStore.similaritySearch(query, 3);
      
      // Create context from documents
      const context = docs.map(doc => doc.pageContent).join('\n\n');
      
      // Generate response using LLM
      const prompt = `Based on the following context, answer the question. If the context doesn't contain enough information, say so.

Context:
${context}

Question: ${query}

Answer:`;

      const response = await this.llm.invoke(prompt);
      const content = response.content as string;

      // Calculate confidence based on document relevance
      const confidence = this.calculateConfidence(docs, query);

      this.updateMetrics('queries', 1);
      this.updateMetrics('successful_queries', 1);

      return {
        content,
        sources: docs.map(doc => doc.metadata?.source || 'Unknown'),
        confidence,
        metadata: {
          query,
          documentsFound: docs.length,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      this.updateMetrics('failed_queries', 1);
      throw error;
    }
  }

  protected getFallbackResponse(input: any): RAGResponse {
    const query = typeof input === 'string' ? input : input.query || input;
    
    return {
      content: `I'm currently in fallback mode and cannot provide a comprehensive answer for: "${query}". Please try again later or check your API configuration.`,
      sources: [],
      confidence: 0.1,
      metadata: {
        fallback: true,
        query,
        timestamp: new Date().toISOString()
      }
    };
  }

  // Public methods for document management
  public async addDocument(content: string, metadata: Record<string, any> = {}): Promise<void> {
    try {
      if (!this.vectorStore || !this.embeddings) {
        throw new Error('RAG System not initialized');
      }

      // Split content into chunks
      const chunks = await this.textSplitter.splitText(content);
      
      // Add chunks to vector store
      await this.vectorStore.addDocuments(
        chunks.map((chunk, index) => ({
          pageContent: chunk,
          metadata: { ...metadata, chunkIndex: index }
        }))
      );

      this.documents.push(content);
      this.updateMetrics('documents_added', 1);
    } catch (error) {
      this.handleError('Document addition failed', error);
    }
  }

  public async addDocuments(documents: Array<{ content: string; metadata?: Record<string, any> }>): Promise<void> {
    for (const doc of documents) {
      await this.addDocument(doc.content, doc.metadata);
    }
  }

  public async clearDocuments(): Promise<void> {
    try {
      if (this.vectorStore) {
        // Reinitialize vector store to clear documents
        this.vectorStore = await MemoryVectorStore.fromTexts(
          ['Initial document'],
          [{ id: 1 }],
          this.embeddings!
        );
      }
      this.documents = [];
      this.updateMetrics('documents_cleared', 1);
    } catch (error) {
      this.handleError('Document clearing failed', error);
    }
  }

  public async getDocumentCount(): Promise<number> {
    return this.documents.length;
  }

  // Enhanced search methods
  public async hybridSearch(query: string, options: { k?: number; threshold?: number } = {}): Promise<RAGResponse> {
    const k = options.k || 3;
    const threshold = options.threshold || 0.7;

    try {
      if (!this.vectorStore || !this.llm) {
        throw new Error('RAG System not initialized');
      }

      // Perform similarity search with more documents
      const docs = await this.vectorStore.similaritySearch(query, k * 2);
      
      // Filter by relevance threshold
      const relevantDocs = docs.filter((_, index) => index < k);
      
      // Create enhanced context
      const context = relevantDocs.map(doc => doc.pageContent).join('\n\n');
      
      // Generate enhanced response
      const prompt = `Based on the following context, provide a comprehensive answer to the question. Include relevant details and insights.

Context:
${context}

Question: ${query}

Comprehensive Answer:`;

      const response = await this.llm.invoke(prompt);
      const content = response.content as string;

      const confidence = this.calculateConfidence(relevantDocs, query);

      this.updateMetrics('hybrid_searches', 1);

      return {
        content,
        sources: relevantDocs.map(doc => doc.metadata?.source || 'Unknown'),
        confidence,
        metadata: {
          query,
          documentsFound: relevantDocs.length,
          searchType: 'hybrid',
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      this.updateMetrics('failed_hybrid_searches', 1);
      throw error;
    }
  }

  // Private utility methods
  private calculateConfidence(docs: any[], query: string): number {
    if (docs.length === 0) return 0.1;
    
    // Simple confidence calculation based on document count and content length
    const avgDocLength = docs.reduce((sum, doc) => sum + doc.pageContent.length, 0) / docs.length;
    const docCountScore = Math.min(docs.length / 3, 1);
    const lengthScore = Math.min(avgDocLength / 1000, 1);
    
    return (docCountScore + lengthScore) / 2;
  }

  // Override status method to include RAG-specific metrics
  public async getStatus(): Promise<any> {
    const baseStatus = await super.getStatus();
    
    return {
      ...baseStatus,
      ragSpecific: {
        documentCount: this.documents.length,
        vectorStoreStatus: this.vectorStore ? 'operational' : 'failed',
        llmStatus: this.llm ? 'operational' : 'failed',
        embeddingsStatus: this.embeddings ? 'operational' : 'failed'
      }
    };
  }
} 