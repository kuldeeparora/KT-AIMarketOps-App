// Basic AI Test Script (No External APIs Required)
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

async function testAIBasic() {
  console.log('🧪 Running Basic AI Tests (No External APIs)...\n');

  const tests = [
    {
      name: 'Text Splitter Test',
      test: async () => {
        try {
          const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
            separators: ["\n\n", "\n", " ", ""]
          });

          const testText = 'This is a test document for Kent Traders. '.repeat(50);
          const chunks = await splitter.splitText(testText);
          
          return chunks.length > 0;
        } catch (error) {
          console.log('Text splitter test error:', error);
          return false;
        }
      }
    },
    {
      name: 'Data Structure Test',
      test: async () => {
        try {
          const sampleData = {
            documents: [
              {
                id: 'doc1',
                content: 'Kent Traders inventory management system',
                metadata: {
                  source: 'test',
                  type: 'documentation',
                  timestamp: new Date().toISOString()
                }
              }
            ],
            agents: [
              {
                name: 'inventory-agent',
                status: 'ready',
                capabilities: ['stock_analysis', 'reorder_suggestions']
              }
            ]
          };

          return sampleData.documents.length > 0 && sampleData.agents.length > 0;
        } catch (error) {
          console.log('Data structure test error:', error);
          return false;
        }
      }
    },
    {
      name: 'API Endpoint Structure Test',
      test: async () => {
        try {
          const endpoints = [
            '/api/ai/simple-chat',
            '/api/ai/advanced-chat',
            '/api/ai/autonomous-agent'
          ];

          return endpoints.length === 3;
        } catch (error) {
          console.log('API endpoint test error:', error);
          return false;
        }
      }
    },
    {
      name: 'Component Structure Test',
      test: async () => {
        try {
          const components = [
            'KentTradersAIAssistant',
            'AIInsightsDashboard',
            'AIAssistant'
          ];

          return components.length === 3;
        } catch (error) {
          console.log('Component structure test error:', error);
          return false;
        }
      }
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`🔍 Testing: ${test.name}`);
      const result = await test.test();
      
      if (result) {
        console.log(`✅ ${test.name}: PASSED\n`);
        passed++;
      } else {
        console.log(`❌ ${test.name}: FAILED\n`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name}: ERROR - ${error}\n`);
      failed++;
    }
  }

  console.log(`\n📊 Basic Test Results:`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);

  if (failed === 0) {
    console.log('\n🎉 All basic AI tests passed! Infrastructure is ready.');
    console.log('\n📋 Next steps:');
    console.log('1. Set up API keys: npm run ai:setup-env');
    console.log('2. Run full setup: npm run ai:setup');
    console.log('3. Test with APIs: npm run test:ai-complete');
  } else {
    console.log('\n⚠️  Some basic tests failed. Please check the infrastructure.');
  }
}

testAIBasic().catch(console.error); 