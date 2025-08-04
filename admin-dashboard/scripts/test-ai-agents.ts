import { AutonomousInventoryAgent } from '../../packages/ai-insights/src/agents/autonomous-inventory-agent';

async function testAIAgents() {
  console.log('🤖 Testing AI Agents...\n');

  try {
    const inventoryAgent = new AutonomousInventoryAgent();
    
    // Test inventory agent
    console.log('📦 Testing Inventory Agent...');
    
    const testObjectives = [
      'Analyze current stock levels',
      'Predict demand for next month',
      'Optimize reorder points',
      'Identify slow-moving inventory'
    ];

    for (const objective of testObjectives) {
      console.log(`\n🎯 Testing objective: "${objective}"`);
      
      try {
        const result = await inventoryAgent.run(objective);
        console.log('✅ Agent execution successful');
        console.log('📊 Result:', result.output);
      } catch (error) {
        console.log(`❌ Agent execution failed: ${error}`);
      }
    }

    console.log('\n🎉 AI Agents test completed!');

  } catch (error) {
    console.error('❌ AI Agents test failed:', error);
  }
}

testAIAgents().catch(console.error); 