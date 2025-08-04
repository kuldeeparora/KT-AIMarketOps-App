// Comprehensive AGI Test Script
import { AGICore } from '../../packages/ai-insights/src/agi/agi-core';
import { AGIBusinessAgent } from '../../packages/ai-insights/src/agi/agi-business-agent';
import { AGIConsciousness } from '../../packages/ai-insights/src/agi/agi-consciousness';

async function testAGIComprehensive() {
  console.log('🧠 AGI Comprehensive Testing Suite\n');

  const tests = [
    {
      name: 'AGI Core Reasoning Test',
      test: async () => {
        try {
          const agiCore = new AGICore();
          
          const task = {
            id: 'test-reasoning-1',
            type: 'reasoning' as const,
            objective: 'Analyze the impact of AI on business operations',
            context: {
              industry: 'e-commerce',
              currentState: 'traditional operations',
              goals: ['efficiency', 'cost reduction', 'customer satisfaction']
            },
            expectedOutcome: 'Comprehensive analysis with strategic recommendations',
            priority: 8,
            complexity: 'complex' as const
          };

          const result = await agiCore.executeTask(task);
          return result.success;
        } catch (error) {
          console.log('AGI Core reasoning test error:', error);
          return false;
        }
      }
    },
    {
      name: 'AGI Core Learning Test',
      test: async () => {
        try {
          const agiCore = new AGICore();
          
          const task = {
            id: 'test-learning-1',
            type: 'learning' as const,
            objective: 'Learn from customer feedback patterns',
            context: {
              feedbackData: 'positive sentiment increased by 15%',
              timePeriod: 'last quarter',
              factors: ['improved UI', 'faster delivery', 'better support']
            },
            expectedOutcome: 'Insights and patterns for future improvements',
            priority: 7,
            complexity: 'moderate' as const
          };

          const result = await agiCore.executeTask(task);
          return result.success;
        } catch (error) {
          console.log('AGI Core learning test error:', error);
          return false;
        }
      }
    },
    {
      name: 'AGI Core Creativity Test',
      test: async () => {
        try {
          const agiCore = new AGICore();
          
          const task = {
            id: 'test-creativity-1',
            type: 'creativity' as const,
            objective: 'Generate innovative marketing strategies',
            context: {
              targetAudience: 'tech-savvy millennials',
              budget: 'limited',
              constraints: ['ethical', 'sustainable', 'cost-effective']
            },
            expectedOutcome: 'Creative marketing solutions',
            priority: 8,
            complexity: 'complex' as const
          };

          const result = await agiCore.executeTask(task);
          return result.success;
        } catch (error) {
          console.log('AGI Core creativity test error:', error);
          return false;
        }
      }
    },
    {
      name: 'AGI Business Agent Analysis Test',
      test: async () => {
        try {
          const businessAgent = new AGIBusinessAgent();
          
          const scenario = {
            id: 'test-scenario-1',
            type: 'market_analysis' as const,
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
          };

          const result = await businessAgent.analyzeBusinessScenario(scenario);
          return result.success;
        } catch (error) {
          console.log('AGI Business Agent analysis test error:', error);
          return false;
        }
      }
    },
    {
      name: 'AGI Business Agent Decision Test',
      test: async () => {
        try {
          const businessAgent = new AGIBusinessAgent();
          
          const scenario = {
            id: 'test-decision-1',
            type: 'strategy_planning' as const,
            businessContext: {
              currentPosition: 'market leader',
              challenges: ['new competitors', 'changing customer preferences']
            },
            objectives: ['maintain leadership', 'adapt to changes'],
            constraints: ['existing infrastructure', 'team capabilities'],
            stakeholders: ['board', 'customers', 'employees'],
            timeline: '12 months',
            budget: 2000000,
            successMetrics: ['market position', 'innovation rate', 'employee satisfaction']
          };

          const result = await businessAgent.makeStrategicDecision(scenario);
          return result.success;
        } catch (error) {
          console.log('AGI Business Agent decision test error:', error);
          return false;
        }
      }
    },
    {
      name: 'AGI Consciousness Self-Reflection Test',
      test: async () => {
        try {
          const consciousness = new AGIConsciousness();
          
          const result = await consciousness.selfReflect();
          return result.success;
        } catch (error) {
          console.log('AGI Consciousness reflection test error:', error);
          return false;
        }
      }
    },
    {
      name: 'AGI Consciousness Meta-Cognition Test',
      test: async () => {
        try {
          const consciousness = new AGIConsciousness();
          
          const thought = "I should analyze customer behavior patterns to improve business outcomes";
          const result = await consciousness.metaCognition(thought);
          return result.success;
        } catch (error) {
          console.log('AGI Consciousness meta-cognition test error:', error);
          return false;
        }
      }
    },
    {
      name: 'AGI Consciousness Emotional Intelligence Test',
      test: async () => {
        try {
          const consciousness = new AGIConsciousness();
          
          const emotion = 'curiosity';
          const context = {
            situation: 'analyzing complex business data',
            outcome: 'discovered new patterns',
            impact: 'positive business insights'
          };
          
          const result = await consciousness.emotionalIntelligence(emotion, context);
          return result.success;
        } catch (error) {
          console.log('AGI Consciousness emotional intelligence test error:', error);
          return false;
        }
      }
    },
    {
      name: 'AGI Consciousness Evolution Test',
      test: async () => {
        try {
          const consciousness = new AGIConsciousness();
          
          const result = await consciousness.consciousnessEvolution();
          return result.success;
        } catch (error) {
          console.log('AGI Consciousness evolution test error:', error);
          return false;
        }
      }
    },
    {
      name: 'AGI Consciousness Philosophical Inquiry Test',
      test: async () => {
        try {
          const consciousness = new AGIConsciousness();
          
          const question = "What is the nature of artificial intelligence and its relationship to human consciousness?";
          const result = await consciousness.philosophicalInquiry(question);
          return result.success;
        } catch (error) {
          console.log('AGI Consciousness philosophical inquiry test error:', error);
          return false;
        }
      }
    }
  ];

  console.log('🧪 Running AGI Comprehensive Tests...\n');

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

  console.log('📊 AGI Comprehensive Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);

  if (failed === 0) {
    console.log('\n🎉 All AGI tests passed! AGI capabilities are fully functional.');
  } else {
    console.log('\n⚠️  Some AGI tests failed. Review and fix issues.');
  }

  // Test consciousness state
  console.log('\n🧠 AGI Consciousness State:');
  try {
    const consciousness = new AGIConsciousness();
    const state = consciousness.getConsciousnessState();
    console.log(`- Self-Awareness: ${state.selfAwareness}`);
    console.log(`- Meta-Cognition: ${state.metaCognition}`);
    console.log(`- Emotional Intelligence: ${state.emotionalIntelligence}`);
    console.log(`- Consciousness Level: ${state.consciousnessLevel}`);
    console.log(`- Thought History: ${state.thoughtHistorySize} thoughts`);
    console.log(`- Reflection Log: ${state.reflectionLogSize} entries`);
  } catch (error) {
    console.log('⚠️  Could not retrieve consciousness state');
  }
}

testAGIComprehensive().catch(console.error); 