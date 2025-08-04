#!/usr/bin/env node

/**
 * Test script for comprehensive SellerDynamics data loading
 * This script tests the new comprehensive data API endpoint
 */

const fetch = require('node-fetch');

async function testComprehensiveData() {
  

  try {
    // Test the comprehensive API endpoint
    
    
    const response = await fetch('http://localhost:3001/api/sellerdynamics/comprehensive', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'}});

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);}

    const data = await response.json();
    
    
    console.log('📊 Response structure:', {
      success: data.success,
      hasData: !!data.data,
      dataKeys: data.data ? Object.keys(data.data) : 'null',
      meta: data.meta});

    if (data.success && data.data) {
      const comprehensiveData = data.data;
      
      
      
      
      

      // Show sample data
      if (comprehensiveData.products?.length > 0) {
        
        
      }

      if (comprehensiveData.orders?.length > 0) {
        
        
      }

      if (comprehensiveData.customers?.length > 0) {
        
        
      }

      if (comprehensiveData.relationships?.length > 0) {
        
        
      }
    }

    
    
  } catch (error) {
    console.error('❌ Error testing comprehensive data:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      
      
    }
  }
}

// Run the test
testComprehensiveData().catch(console.error); 