import { AdvancedRAGSystem } from '../../packages/ai-insights/src/rag/advanced-rag';

async function testRAGSystem() {
  console.log('🔍 Testing RAG System...\n');

  try {
    const rag = new AdvancedRAGSystem();
    
    // Test queries
    const testQueries = [
      'inventory optimization',
      'supplier management',
      'cost reduction strategies',
      'customer service best practices'
    ];

    for (const query of testQueries) {
      console.log(`\n🔍 Testing query: "${query}"`);
      
      try {
        const results = await rag.hybridSearch(query);
        console.log(`✅ Found ${results.length} results`);
        
        if (results.length > 0) {
          console.log('📄 Sample result:', results[0].metadata);
        }
      } catch (error) {
        console.log(`❌ Query failed: ${error}`);
      }
    }

    console.log('\n🎉 RAG System test completed!');

  } catch (error) {
    console.error('❌ RAG System test failed:', error);
  }
}

testRAGSystem().catch(console.error); 