import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';

export default function MarketIntelligence() {
  const [activeTab, setActiveTab] = useState('overview');
  const [marketData, setMarketData] = useState({
    competitors: [],
    trends: [],
    opportunities: [],
    threats: []
  });

  useEffect(() => {
    // Mock market data,
    setMarketData({
      competitors: [
        {
          name: 'TechCorp Ltd',
          marketShare: 25.5,
          strengths: ['Strong brand', 'Wide distribution'],
          weaknesses: ['High prices', 'Slow innovation'],
          opportunities: ['Emerging markets', 'Digital transformation']
        },
        {
          name: 'InnovateTech',
          marketShare: 18.2,
          strengths: ['Innovation leader', 'Agile development'],
          weaknesses: ['Limited scale', 'Resource constraints'],
          opportunities: ['AI integration', 'Partnerships']
        }
      ],
      trends: [
        { name: 'AI Integration', impact: 'high', growth: 45 },
        { name: 'Sustainability', impact: 'medium', growth: 32 },
        { name: 'Remote Work', impact: 'high', growth: 28 },
        { name: 'E-commerce', impact: 'high', growth: 38 }
      ],
      opportunities: [
        { title: 'Emerging Markets', potential: 'high', timeframe: '6-12 months' },
        { title: 'Digital Transformation', potential: 'medium', timeframe: '3-6 months' },
        { title: 'Partnership Opportunities', potential: 'high', timeframe: '1-3 months' }
      ],
      threats: [
        { title: 'Economic Downturn', severity: 'medium', probability: 0.4 },
        { title: 'New Competitors', severity: 'high', probability: 0.7 },
        { title: 'Regulatory Changes', severity: 'low', probability: 0.2 }
      ]
    });
  }, []);

  const tabs = [
    { id: 'overview', name: 'Market Overview', icon: '📊' },
    { id: 'competitors', name: 'Competitor Analysis', icon: '🏢' },
    { id: 'trends', name: 'Market Trends', icon: '📈' },
    { id: 'opportunities', name: 'Opportunities', icon: '🎯' },
    { id: 'threats', name: 'Threats', icon: '⚠️' }
  ];

  return (
    <>
      <Head>
        <title>Market Intelligence - Kent Traders Admin</title>
        <meta name="description" content="Market intelligence and competitive analysis" />
      </Head>
      
      <Layout>
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Market Intelligence Dashboard
            </h1>
            <p className="text-gray-600">
              Comprehensive market analysis and competitive intelligence
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              {tabs.map((tab) => (
                <button
                  key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-2 rounded-md font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover: text-gray-900'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-lg shadow">
            {activeTab === 'overview' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Market Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Market Size</h3>
                    <p className="text-2xl font-bold text-blue-600">£2.4B</p>
                    <p className="text-sm text-blue-700">+12% YoY growth</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-2">Market Share</h3>
                    <p className="text-2xl font-bold text-green-600">8.5%</p>
                    <p className="text-sm text-green-700">+2.1% vs last year</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h3 className="font-semibold text-purple-900 mb-2">Growth Rate</h3>
                    <p className="text-2xl font-bold text-purple-600">15.2%</p>
                    <p className="text-sm text-purple-700">Industry average: 8.7%</p>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'competitors' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Competitor Analysis</h2>
                <div className="space-y-4">
                  {marketData.competitors.map((competitor, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{competitor.name}</h3>
                        <span className="text-sm font-medium text-gray-600">
                          {competitor.marketShare}% market share
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Strengths</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {competitor.strengths.map((strength, i) => (
                              <li key={i} className="flex items-center">
                                <span className="text-green-500 mr-2">✓</span>
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Weaknesses</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {competitor.weaknesses.map((weakness, i) => (
                              <li key={i} className="flex items-center">
                                <span className="text-red-500 mr-2">✗</span>
                                {weakness}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'trends' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Market Trends</h2>
                <div className="space-y-4">
                  {marketData.trends.map((trend, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-gray-900">{trend.name}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          trend.impact === 'high' ? 'bg-red-100 text-red-800' :
                          trend.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {trend.impact} impact
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${trend.growth}%` }}></div>
                        </div>
                        <span className="text-sm font-medium text-gray-600">{trend.growth}% growth</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'opportunities' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Market Opportunities</h2>
                <div className="space-y-4">
                  {marketData.opportunities.map((opportunity, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">{opportunity.title}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          opportunity.potential === 'high' ? 'bg-green-100 text-green-800' :
                          opportunity.potential === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {opportunity.potential} potential
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Timeframe: {opportunity.timeframe}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'threats' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Market Threats</h2>
                <div className="space-y-4">
                  {marketData.threats.map((threat, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">{threat.title}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          threat.severity === 'high' ? 'bg-red-100 text-red-800' :
                          threat.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {threat.severity} severity
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Probability: {(threat.probability * 100).toFixed(0)}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}
