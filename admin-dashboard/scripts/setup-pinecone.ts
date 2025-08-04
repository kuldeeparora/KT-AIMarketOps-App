import { Pinecone } from '@pinecone-database/pinecone';

async function setupPinecone() {
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });

  try {
    await pinecone.createIndex({
      name: 'kent-traders-knowledge',
      dimension: 1536,
      metric: 'cosine',
      spec: {
        pod: {
          environment: process.env.PINECONE_ENVIRONMENT!,
          podType: 'p1.x1'
        }
      }
    });
    console.log('✅ Pinecone index created');
  } catch (error) {
    console.log('Index might already exist:', (error as Error).message);
  }
}

setupPinecone().catch(console.error);
