// Demo test for AI infrastructure
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { z } from "zod";

async function testAIDemo() {
  console.log('🎯 AI Infrastructure Demo Test\n');

  const tests = [
    {
      name: 'Text Processing Test',
      test: async () => {
        try {
          const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200
          });

          const text = "This is a test document for the AI infrastructure. It contains multiple sentences to demonstrate text splitting capabilities.";
          const chunks = await splitter.splitText(text);
          
          return {
            success: true,
            chunks: chunks.length,
            message: `Successfully split text into ${chunks.length} chunks`
          };
        } catch (error) {
          return {
            success: false,
            error: error.message
          };
        }
      }
    },
    {
      name: 'Data Structure Test',
      test: async () => {
        try {
          // Test Zod schema validation
          const ProductSchema = z.object({
            id: z.string(),
            name: z.string(),
            price: z.number(),
            stock: z.number()
          });

          const testProduct = {
            id: "PROD-001",
            name: "Test Product",
            price: 99.99,
            stock: 50
          };

          const validated = ProductSchema.parse(testProduct);
          
          return {
            success: true,
            message: `Successfully validated product: ${validated.name}`
          };
        } catch (error) {
          return {
            success: false,
            error: error.message
          };
        }
      }
    },
    {
      name: 'Module Loading Test',
      test: async () => {
        try {
          // Test if AI modules can be imported
          const modules = [
            'AdvancedRAGSystem',
            'AutonomousInventoryAgent', 
            'EnhancedLangSmithClient'
          ];

          const results = [];
          for (const moduleName of modules) {
            try {
              let module;
              switch (moduleName) {
                case 'AdvancedRAGSystem':
                  module = require('../../packages/ai-insights/src/rag/advanced-rag').AdvancedRAGSystem;
                  break;
                case 'AutonomousInventoryAgent':
                  module = require('../../packages/ai-insights/src/agents/autonomous-inventory-agent').AutonomousInventoryAgent;
                  break;
                case 'EnhancedLangSmithClient':
                  module = require('../../packages/ai-insights/src/observability/langsmith-client').EnhancedLangSmithClient;
                  break;
              }
              results.push({ module: moduleName, loaded: !!module });
            } catch (error) {
              results.push({ module: moduleName, loaded: false, error: error.message });
            }
          }

          const loadedCount = results.filter(r => r.loaded).length;
          
          return {
            success: loadedCount > 0,
            message: `${loadedCount}/${modules.length} modules loaded successfully`,
            details: results
          };
        } catch (error) {
          return {
            success: false,
            error: error.message
          };
        }
      }
    },
    {
      name: 'Environment Test',
      test: async () => {
        try {
          const requiredVars = [
            'PINECONE_API_KEY',
            'OPENAI_API_KEY', 
            'GROQ_API_KEY',
            'LANGSMITH_API_KEY'
          ];

          const results = requiredVars.map(varName => ({
            variable: varName,
            set: !!process.env[varName],
            value: process.env[varName] ? `${process.env[varName].substring(0, 10)}...` : 'Not set'
          }));

          const setCount = results.filter(r => r.set).length;
          
          return {
            success: setCount > 0,
            message: `${setCount}/${requiredVars.length} environment variables configured`,
            details: results
          };
        } catch (error) {
          return {
            success: false,
            error: error.message
          };
        }
      }
    }
  ];

  console.log('🧪 Running AI Infrastructure Demo Tests...\n');

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    console.log(`🔍 Testing: ${test.name}`);
    
    try {
      const result = await test.test();
      
      if (result.success) {
        console.log(`✅ ${test.name}: PASSED`);
        console.log(`   ${result.message}`);
        if (result.details) {
          console.log(`   Details:`, result.details);
        }
        passed++;
      } else {
        console.log(`❌ ${test.name}: FAILED`);
        console.log(`   Error: ${result.error}`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name}: FAILED`);
      console.log(`   Error: ${error.message}`);
      failed++;
    }
    
    console.log('');
  }

  console.log('📊 Demo Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);

  if (failed === 0) {
    console.log('\n🎉 All demo tests passed! AI infrastructure is ready.');
  } else {
    console.log('\n⚠️  Some demo tests failed. Check configuration.');
  }
}

testAIDemo().catch(console.error); 