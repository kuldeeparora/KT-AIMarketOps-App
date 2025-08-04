import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';

export default function SimpleTest() {
  const [testResults, setTestResults] = useState({
    sellerdynamics: { loading: true, data: null, error: null },
    relationships: { loading: true, data: null, error: null },
    shopify: { loading: true, data: null, error: null }});

  useEffect(() => {
    runTests();
  }, []);

  const runTests = async () => {
    console.log('[SimpleTest] Starting API tests...');

    // Test SellerDynamics API
    try {
      console.log('[SimpleTest] Testing SellerDynamics API...');
      const sdResponse = await fetch('/api/sellerdynamics');
      const sdData = await sdResponse.json();
      console.log('[SimpleTest] SellerDynamics response:', sdData);
      
      setTestResults(prev => ({
        ...prev,
        sellerdynamics: {
          loading: false,
          data: sdData,
          error: null
        }
      }));
    } catch (error) {
      console.error('[SimpleTest] SellerDynamics API error:', error);
      setTestResults(prev => ({
        ...prev,
        sellerdynamics: {
          loading: false,
          data: null,
          error: error.message
        }
      }));
    }

    // Test Relationships API
    try {
      console.log('[SimpleTest] Testing Relationships API...');
      const relResponse = await fetch('/api/sellerdynamics/relationships');
      const relData = await relResponse.json();
      console.log('[SimpleTest] Relationships response:', relData);
      
      setTestResults(prev => ({
        ...prev,
        relationships: {
          loading: false,
          data: relData,
          error: null
        }
      }));
    } catch (error) {
      console.error('[SimpleTest] Relationships API error:', error);
      setTestResults(prev => ({
        ...prev,
        relationships: {
          loading: false,
          data: null,
          error: error.message
        }
      }));
    }

    // Test Shopify API
    try {
      console.log('[SimpleTest] Testing Shopify API...');
      const shopifyResponse = await fetch('/api/shopify-inventory');
      const shopifyData = await shopifyResponse.json();
      console.log('[SimpleTest] Shopify response:', shopifyData);
      
      setTestResults(prev => ({
        ...prev,
        shopify: {
          loading: false,
          data: shopifyData,
          error: null
        }
      }));
    } catch (error) {
      console.error('[SimpleTest] Shopify API error:', error);
      setTestResults(prev => ({
        ...prev,
        shopify: {
          loading: false,
          data: null,
          error: error.message
        }
      }));
    }
  };

  return (
    <>
      <Head>
        <title>Simple API Test - Kent Traders Admin Dashboard</title>
        <meta name="description" content="Simple API test page" />
      </Head>
      
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm: px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Simple API Test</h1>
          
          <div className="mb-6">
            <button
              onClick={runTests}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Run Tests Again
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* SellerDynamics Test */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">SellerDynamics API</h2>
              <div className="space-y-2">
                <p><strong>Status: </strong> {testResults.sellerdynamics.loading ? 'Loading...' : 'Complete'}</p>
                <p><strong>Error: </strong> {testResults.sellerdynamics.error || 'None'}</p>
                {testResults.sellerdynamics.data && (
                  <>
                    <p><strong>Stock Levels: </strong> {testResults.sellerdynamics.data.stockLevels?.length || 0}</p>
                    <p><strong>Meta: </strong> {testResults.sellerdynamics.data.meta ? 'Present' : 'None'}</p>
                    <details className="mt-4">
                      <summary className="cursor-pointer text-blue-600">View Raw Data</summary>
                      <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                        {JSON.stringify(testResults.sellerdynamics.data, null, 2)}
                      </pre>
                    </details>
                  </>
                )}
              </div>
            </div>

            {/* Relationships Test */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Relationships API</h2>
              <div className="space-y-2">
                <p><strong>Status: </strong> {testResults.relationships.loading ? 'Loading...' : 'Complete'}</p>
                <p><strong>Error: </strong> {testResults.relationships.error || 'None'}</p>
                {testResults.relationships.data && (
                  <>
                    <p><strong>Success: </strong> {testResults.relationships.data.success ? 'Yes' : 'No'}</p>
                    <p><strong>Total Products: </strong> {testResults.relationships.data.data?.totalProducts || 0}</p>
                    <p><strong>Master Products: </strong> {testResults.relationships.data.data?.masterProducts?.length || 0}</p>
                    <p><strong>Kit Products: </strong> {testResults.relationships.data.data?.kitProducts?.length || 0}</p>
                    <details className="mt-4">
                      <summary className="cursor-pointer text-blue-600">View Raw Data</summary>
                      <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                        {JSON.stringify(testResults.relationships.data, null, 2)}
                      </pre>
                    </details>
                  </>
                )}
              </div>
            </div>

            {/* Shopify Test */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Shopify API</h2>
              <div className="space-y-2">
                <p><strong>Status: </strong> {testResults.shopify.loading ? 'Loading...' : 'Complete'}</p>
                <p><strong>Error: </strong> {testResults.shopify.error || 'None'}</p>
                {testResults.shopify.data && (
                  <>
                    <p><strong>Success: </strong> {testResults.shopify.data.success ? 'Yes' : 'No'}</p>
                    <p><strong>Products: </strong> {testResults.shopify.data.data?.products?.length || 0}</p>
                    <details className="mt-4">
                      <summary className="cursor-pointer text-blue-600">View Raw Data</summary>
                      <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                        {JSON.stringify(testResults.shopify.data, null, 2)}
                      </pre>
                    </details>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Test Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {Object.values(testResults).filter(r => !r.loading && !r.error).length}
                </p>
                <p className="text-sm text-gray-600">Working APIs</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {Object.values(testResults).filter(r => !r.loading && r.error).length}
                </p>
                <p className="text-sm text-gray-600">Failed APIs</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">
                  {Object.values(testResults).filter(r => r.loading).length}
                </p>
                <p className="text-sm text-gray-600">Loading APIs</p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
} 