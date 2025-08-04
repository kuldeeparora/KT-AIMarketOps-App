// Test SellerDynamics API connectivity and credentials
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env.local') });

async function testSellerDynamicsAPI() {
  console.log('🔍 SELLERDYNAMICS API DIAGNOSTIC TEST');
  console.log('=====================================\n');

  // Check environment variables
  console.log('📋 ENVIRONMENT VARIABLES:');
  console.log(`   SELLERDYNAMICS_RETAILER_ID: ${process.env.SELLERDYNAMICS_RETAILER_ID ? '✅ Set' : '❌ Missing'}`);
  console.log(`   SELLERDYNAMICS_ENCRYPTED_LOGIN: ${process.env.SELLERDYNAMICS_ENCRYPTED_LOGIN ? '✅ Set' : '❌ Missing'}`);
  console.log(`   SELLERDYNAMICS_SOAP_ENDPOINT: ${process.env.SELLERDYNAMICS_SOAP_ENDPOINT ? '✅ Set' : '❌ Missing'}`);
  console.log(`   SELLERDYNAMICS_PAGE_SIZE: ${process.env.SELLERDYNAMICS_PAGE_SIZE || 'Not set'}\n`);

  // Test 1: Basic connectivity
  console.log('🌐 1. TESTING SOAP ENDPOINT CONNECTIVITY:');
  try {
    const response = await fetch(process.env.SELLERDYNAMICS_SOAP_ENDPOINT || '');
    console.log(`   Status: ${response.status} ${response.statusText}`);
    console.log(`   Headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2)}`);
    
    if (response.ok) {
      const text = await response.text();
      console.log(`   Response preview: ${text.substring(0, 200)}...`);
    }
  } catch (error) {
    console.log(`   ❌ Connection failed: ${error.message}`);
  }

  console.log('\n🔍 2. TESTING SELLERDYNAMICS SOAP CALL:');
  
  // Test SOAP call
  const soapEnvelope = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
               xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
               xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetStockLevels xmlns="http://sellerdynamics.com/">
      <RetailerID>${process.env.SELLERDYNAMICS_RETAILER_ID}</RetailerID>
      <EncryptedLogin>${process.env.SELLERDYNAMICS_ENCRYPTED_LOGIN}</EncryptedLogin>
      <PageNumber>1</PageNumber>
      <PageSize>10</PageSize>
    </GetStockLevels>
  </soap:Body>
</soap:Envelope>`;

  try {
    const response = await fetch(process.env.SELLERDYNAMICS_SOAP_ENDPOINT || '', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': '"http://sellerdynamics.com/GetStockLevels"', // Fixed: Added quotes
        'User-Agent': 'Kent-Traders-Admin/1.0'
      },
      body: soapEnvelope
    });

    console.log(`   SOAP Response Status: ${response.status} ${response.statusText}`);
    
    const responseText = await response.text();
    console.log(`   Response length: ${responseText.length} characters`);
    
    if (responseText.includes('fault') || responseText.includes('error')) {
      console.log('   ❌ SOAP Fault detected:');
      console.log(`   ${responseText.substring(0, 500)}...`);
    } else if (responseText.includes('GetStockLevelsResponse')) {
      console.log('   ✅ SOAP call successful!');
      console.log(`   Response preview: ${responseText.substring(0, 300)}...`);
    } else {
      console.log('   ⚠️  Unexpected response format:');
      console.log(`   ${responseText.substring(0, 300)}...`);
    }

  } catch (error) {
    console.log(`   ❌ SOAP call failed: ${error.message}`);
  }

  console.log('\n🔍 3. TESTING PRODUCTION API ENDPOINT:');
  
  // Test the actual API endpoint used in production
  try {
    const response = await fetch('https://kent-traders.vercel.app/api/sellerdynamics', {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Kent-Traders-Test/1.0'
      }
    });

    console.log(`   Production API Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('   ✅ Production API responsive');
      console.log(`   Data structure: ${JSON.stringify(Object.keys(data), null, 2)}`);
    } else {
      const errorText = await response.text();
      console.log('   ❌ Production API error:');
      console.log(`   ${errorText.substring(0, 300)}...`);
    }

  } catch (error) {
    console.log(`   ❌ Production API test failed: ${error.message}`);
  }

  console.log('\n📋 DIAGNOSTIC SUMMARY:');
  console.log('   1. Check if SellerDynamics credentials are valid in production');
  console.log('   2. Verify Vercel environment variables are set correctly');
  console.log('   3. Test API connectivity from Vercel deployment location');
  console.log('   4. Implement retry logic and better error handling');
  console.log('   5. Add logging and monitoring for production API calls');
}

testSellerDynamicsAPI().catch(console.error);
