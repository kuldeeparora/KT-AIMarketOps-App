// packages/ai-insights/src/rag/advanced-rag.ts
import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
import { Document } from "langchain/document";
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const DocumentSchema = z.object({
  id: z.string(),
  content: z.string(),
  metadata: z.object({
    source: z.string(),
    type: z.enum(['product', 'order', 'customer', 'documentation']),
    timestamp: z.string(),
    relevanceScore: z.number().optional()
  })
});

export class AdvancedRAGSystem {
  private pinecone: Pinecone;
  private embeddings: OpenAIEmbeddings;
  private splitter: RecursiveCharacterTextSplitter;
  private llm: ChatOpenAI;

  constructor() {
    // Check if Pinecone API key is available
    if (!process.env.PINECONE_API_KEY) {
      console.log('⚠️  Pinecone API key not configured - RAG system will not work');
      throw new Error('PINECONE_API_KEY environment variable is required');
    }

    this.pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
    
    this.embeddings = new OpenAIEmbeddings({
      modelName: "text-embedding-3-large"
    });

    this.splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
      separators: ["\n\n", "\n", " ", ""]
    });

    // Use Groq for better performance and no quota issues
    this.llm = new ChatOpenAI({
      modelName: "llama3-8b-8192",
      temperature: 0,
      configuration: {
        baseURL: "https://api.groq.com/openai/v1"
      }
    });
  }

  async indexDocuments(documents: z.infer<typeof DocumentSchema>[]) {
    const index = this.pinecone.Index('kent-traders-knowledge');
    
    for (const doc of documents) {
      const chunks = await this.splitter.splitText(doc.content);
      
      const embeddings = await Promise.all(
        chunks.map(chunk => this.embeddings.embedQuery(chunk))
      );

      const vectors = chunks.map((chunk, i) => ({
        id: `${doc.id}_chunk_${i}`,
        values: embeddings[i],
        metadata: {
          ...doc.metadata,
          text: chunk,
          chunkIndex: i,
          totalChunks: chunks.length
        }
      }));

      await index.upsert(vectors);
    }
  }

  async hybridSearch(query: string, filters?: Record<string, any>) {
    const index = this.pinecone.Index('kent-traders-knowledge');
    
    // Semantic search
    const queryEmbedding = await this.embeddings.embedQuery(query);
    
    const semanticResults = await index.query({
      vector: queryEmbedding,
      topK: 20,
      includeMetadata: true,
      filter: filters
    });

    // Rerank using cross-encoder
    const rerankedResults = await this.rerankResults(
      query,
      semanticResults.matches
    );

    return rerankedResults;
  }

  private async rerankResults(query: string, results: any[]) {
    // Implement cross-encoder reranking
    const rerankedResults = await Promise.all(
      results.map(async (result) => {
        const relevanceScore = await this.calculateRelevance(query, result.metadata.text);
        return {
          ...result,
          relevanceScore
        };
      })
    );

    return rerankedResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  private async calculateRelevance(query: string, text: string): Promise<number> {
    const response = await this.llm.invoke({
      messages: [{
        role: 'system',
        content: 'Rate the relevance of the text to the query on a scale of 0-1'
      }, {
        role: 'user',
        content: `Query: ${query}\nText: ${text}`
      }]
    });

    return parseFloat(response.content as string) || 0;
  }

  async generateAnswer(query: string, context: any[]) {
    const prompt = `
      Based on the following context, answer the user's question.
      If you cannot answer based on the context, say so.
      
      Context:
      ${context.map(c => c.metadata.text).join('\n\n')}
      
      Question: ${query}
      
      Answer:
    `;

    const response = await this.llm.invoke({
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    return response.content;
  }
}