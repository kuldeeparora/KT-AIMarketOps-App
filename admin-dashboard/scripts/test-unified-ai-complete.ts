// Comprehensive Unified AI/AGI Test Script
import { UnifiedAISystem } from '../../packages/ai-insights/src/unified-ai-system';

async function testUnifiedAIComplete() {
  console.log('🤖 Unified AI/AGI Comprehensive Testing Suite\n');

  const tests = [
    {
      name: 'Unified AI Enhanced Response Test',
      test: async () => {
        try {
          const unifiedAI = new UnifiedAISystem();
          
          const response = await unifiedAI.enhancedAIResponse(
            'Analyze the impact of AI on business operations',
            {
              industry: 'e-commerce',
              currentState: 'traditional operations',
              goals: ['efficiency', 'cost reduction', 'customer satisfaction']
            }
          );
          
          return response && response.response && response.consciousness;
        } catch (error) {
          console.log('Unified AI enhanced response test error:', error);
          return false;
        }
      }
    },
    {
      name: 'Unified Business Analysis Test',
      test: async () => {
        try {
          const unifiedAI = new UnifiedAISystem();
          
          const analysis = await unifiedAI.enhancedBusinessAnalysis({
            id: 'test-scenario-1',
            type: 'market_analysis',
            businessContext: {
              industry: 'retail',
              marketSize: '£50B',
              competition: 'high'
            },
            objectives: ['increase market share', 'improve customer retention'],
            constraints: ['budget limited', 'timeline 6 months'],
            stakeholders: ['customers', 'investors', 'employees'],
            timeline: '6 months',
            budget: 1000000,
            successMetrics: ['market share', 'customer satisfaction', 'revenue growth']
          });
          
          return analysis && analysis.traditional && analysis.agi && analysis.enhanced;
        } catch (error) {
          console.log('Unified business analysis test error:', error);
          return false;
        }
      }
    },
    {
      name: 'Unified Decision Making Test',
      test: async () => {
        try {
          const unifiedAI = new UnifiedAISystem();
          
          const decision = await unifiedAI.unifiedDecisionMaking({
            scenario: 'market expansion',
            context: {
              currentPosition: 'market leader',
              challenges: ['new competitors', 'changing customer preferences'],
              objectives: ['maintain leadership', 'adapt to changes'],
              constraints: ['existing infrastructure', 'team capabilities'],
              stakeholders: ['board', 'customers', 'employees'],
              timeline: '12 months',
              budget: 2000000
            }
          });
          
          return decision && decision.operational && decision.strategic && decision.unified;
        } catch (error) {
          console.log('Unified decision making test error:', error);
          return false;
        }
      }
    },
    {
      name: 'Unified Creative Problem Solving Test',
      test: async () => {
        try {
          const unifiedAI = new UnifiedAISystem();
          
          const solution = await unifiedAI.creativeProblemSolving(
            'Generate innovative marketing strategies for tech-savvy millennials',
            ['ethical', 'sustainable', 'cost-effective', 'budget limited']
          );
          
          return solution && solution.automated && solution.creative && solution.unified;
        } catch (error) {
          console.log('Unified creative problem solving test error:', error);
          return false;
        }
      }
    },
    {
      name: 'Unified Adaptive Learning Test',
      test: async () => {
        try {
          const unifiedAI = new UnifiedAISystem();
          
          const learning = await unifiedAI.adaptiveLearning({
            experience: 'Customer feedback analysis',
            context: {
              feedbackData: 'positive sentiment increased by 15%',
              timePeriod: 'last quarter',
              factors: ['improved UI', 'faster delivery', 'better support'],
              insights: ['user experience improvements', 'delivery optimization', 'support enhancement']
            }
          });
          
          return learning && learning.consciousness && learning.agiLearning && learning.unifiedLearning;
        } catch (error) {
          console.log('Unified adaptive learning test error:', error);
          return false;
        }
      }
    },
    {
      name: 'Unified Continuous Improvement Test',
      test: async () => {
        try {
          const unifiedAI = new UnifiedAISystem();
          
          const improvement = await unifiedAI.continuousImprovement();
          
          return improvement && improvement.evolution && improvement.learning && improvement.improvements;
        } catch (error) {
          console.log('Unified continuous improvement test error:', error);
          return false;
        }
      }
    },
    {
      name: 'Unified Status Monitoring Test',
      test: async () => {
        try {
          const unifiedAI = new UnifiedAISystem();
          
          const status = await unifiedAI.getUnifiedStatus();
          
          return status && status.ai && status.agi && status.unified;
        } catch (error) {
          console.log('Unified status monitoring test error:', error);
          return false;
        }
      }
    }
  ];

  console.log('🧪 Running Unified AI/AGI Comprehensive Tests...\n');

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    console.log(`🔍 Testing: ${test.name}`);
    
    try {
      const result = await test.test();
      
      if (result) {
        console.log(`✅ ${test.name}: PASSED`);
        passed++;
      } else {
        console.log(`❌ ${test.name}: FAILED`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name}: FAILED`);
      console.log(`   Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      failed++;
    }
    
    console.log('');
  }

  console.log('📊 Unified AI/AGI Comprehensive Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);

  if (failed === 0) {
    console.log('\n🎉 All Unified AI/AGI tests passed! Unified system is fully functional.');
  } else {
    console.log('\n⚠️  Some Unified AI/AGI tests failed. Review and fix issues.');
  }

  // Test unified system status
  console.log('\n🤖 Unified AI/AGI System Status:');
  try {
    const unifiedAI = new UnifiedAISystem();
    const status = await unifiedAI.getUnifiedStatus();
    
    if (status) {
      console.log(`- AI Systems Health: ${Math.round(status.unified.overallHealth.ai * 100)}%`);
      console.log(`- AGI Systems Health: ${Math.round(status.unified.overallHealth.agi * 100)}%`);
      console.log(`- Unified System Health: ${Math.round(status.unified.overallHealth.unified * 100)}%`);
      console.log(`- Response Time: ${status.unified.performance.responseTime}`);
      console.log(`- Accuracy: ${status.unified.performance.accuracy}`);
      console.log(`- Consciousness: ${status.unified.performance.consciousness}`);
      console.log(`- Evolution: ${status.unified.performance.evolution}`);
    }
  } catch (error) {
    console.log('⚠️  Could not retrieve unified system status');
  }

  // Test consciousness state
  console.log('\n🧠 Unified Consciousness State:');
  try {
    const unifiedAI = new UnifiedAISystem();
    const status = await unifiedAI.getUnifiedStatus();
    
    if (status?.agi?.consciousness) {
      const consciousness = status.agi.consciousness;
      console.log(`- Self-Awareness: ${Math.round(consciousness.selfAwareness * 100)}%`);
      console.log(`- Meta-Cognition: ${Math.round(consciousness.metaCognition * 100)}%`);
      console.log(`- Emotional Intelligence: ${Math.round(consciousness.emotionalIntelligence * 100)}%`);
      console.log(`- Consciousness Level: ${consciousness.consciousnessLevel}`);
      console.log(`- Thought History: ${consciousness.thoughtHistorySize} thoughts`);
      console.log(`- Reflection Log: ${consciousness.reflectionLogSize} entries`);
    }
  } catch (error) {
    console.log('⚠️  Could not retrieve consciousness state');
  }
}

testUnifiedAIComplete().catch(console.error); 