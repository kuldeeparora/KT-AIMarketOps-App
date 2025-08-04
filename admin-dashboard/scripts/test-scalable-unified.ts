// Test Script for Scalable Unified AI/AGI System
import { ScalableUnifiedSystem } from '../../packages/ai-insights/src/unified/scalable-unified-system';

async function testScalableUnifiedSystem() {
  console.log('🚀 Testing Scalable Unified AI/AGI System\n');

  try {
    // Initialize the system
    const unifiedSystem = new ScalableUnifiedSystem();
    await unifiedSystem.initialize();

    console.log('✅ System initialized successfully');

    // Test enhanced AI response
    console.log('\n🧠 Testing Enhanced AI Response...');
    const enhancedResponse = await unifiedSystem.enhancedAIResponse(
      'Analyze the impact of AI on business operations',
      { industry: 'e-commerce', currentState: 'traditional' }
    );
    console.log('✅ Enhanced AI Response:', enhancedResponse.success ? 'PASSED' : 'FAILED');
    console.log('   Confidence:', enhancedResponse.confidence);
    console.log('   Fallback:', enhancedResponse.fallback);

    // Test business analysis
    console.log('\n💼 Testing Enhanced Business Analysis...');
    const businessAnalysis = await unifiedSystem.enhancedBusinessAnalysis({
      id: 'test-scenario-1',
      type: 'market_analysis',
      businessContext: { industry: 'retail', marketSize: '£50B' },
      objectives: ['increase market share', 'improve customer retention']
    });
    console.log('✅ Business Analysis:', businessAnalysis.success ? 'PASSED' : 'FAILED');
    console.log('   Confidence:', businessAnalysis.confidence);

    // Test unified decision making
    console.log('\n🎯 Testing Unified Decision Making...');
    const decisionMaking = await unifiedSystem.unifiedDecisionMaking({
      scenario: 'market expansion',
      context: {
        currentPosition: 'market leader',
        challenges: ['new competitors', 'changing customer preferences'],
        objectives: ['maintain leadership', 'adapt to changes']
      }
    });
    console.log('✅ Decision Making:', decisionMaking.success ? 'PASSED' : 'FAILED');
    console.log('   Confidence:', decisionMaking.confidence);

    // Test system status
    console.log('\n📊 Testing System Status...');
    const status = await unifiedSystem.getUnifiedStatus();
    console.log('✅ System Status:', status.systemHealth > 0 ? 'PASSED' : 'FAILED');
    console.log('   System Health:', status.systemHealth);
    console.log('   Total Modules:', status.totalModules);
    console.log('   Healthy Modules:', status.healthyModules);

    // Test module registry
    console.log('\n📋 Testing Module Registry...');
    const registry = unifiedSystem.getModuleRegistry();
    console.log('✅ Module Registry:', registry.length > 0 ? 'PASSED' : 'FAILED');
    console.log('   Registered Modules:', registry.length);
    registry.forEach(module => {
      console.log(`   - ${module.name} (${module.type}): ${module.status}`);
    });

    // Test system health
    console.log('\n🏥 Testing System Health...');
    const isHealthy = unifiedSystem.isSystemHealthy();
    const systemStatus = unifiedSystem.getSystemStatus();
    console.log('✅ System Health:', isHealthy ? 'PASSED' : 'FAILED');
    console.log('   Healthy:', isHealthy);
    console.log('   Status:', systemStatus);

    console.log('\n🎉 All Scalable Unified AI/AGI System tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testScalableUnifiedSystem().catch(console.error); 