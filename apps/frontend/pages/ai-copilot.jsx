import React, { useState, useEffect } from 'react';
import { apiBaseUrl } from '../config/api';

export default function AICopilot() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Get shop from URL parameters or default to kenttraders
        let shop = 'kenttraders.myshopify.com';
        if (typeof window !== 'undefined') {
          const urlParams = new URLSearchParams(window.location.search);
          shop = urlParams.get('shop') || 'kenttraders.myshopify.com';
        }
        
        // First check authentication status with shop parameter
        const authResponse = await fetch(`${apiBaseUrl}/auth/status?shop=${shop}`);
        const authData = await authResponse.json();
        
        if (!authData.authenticated) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }
        
        setIsAuthenticated(true);

        // Fetch AI Copilot data
        const response = await fetch(`${apiBaseUrl}/ai-copilot?shop=${shop}`);
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const sendMessage = async () => {
    if (!chatMessage.trim()) return;

    const userMessage = {
      type: 'user',
      content: chatMessage,
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, userMessage]);
    setChatMessage('');
    setIsTyping(true);

    try {
      const response = await fetch(`${apiBaseUrl}/ai-copilot/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: chatMessage,
          shop: 'kenttraders.myshopify.com'
        })
      });

      const result = await response.json();
      
      const aiMessage = {
        type: 'ai',
        content: result.response,
        timestamp: new Date()
      };

      setChatHistory(prev => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage = {
        type: 'ai',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading AI Copilot...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-red-800">Error loading AI Copilot</h3>
          <p className="mt-2 text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Authentication Required</h2>
          <p className="text-gray-600 text-center mb-6">
            Please authenticate with your Shopify store to access AI Copilot.
          </p>
          <button 
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            onClick={() => window.location.href = '/auth'}
          >
            Connect Store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Copilot</h1>
        <p className="text-gray-600">Your intelligent assistant for store optimization and insights</p>
      </div>

      {/* AI Stats Cards */}
      <div className="grid grid-cols-1 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-medium">AI Conversations</p>
              <p className="text-lg font-bold text-gray-900">{data?.totalConversations || '0'}</p>
              <div className="flex items-center mt-1">
                <span className="text-blue-600 text-xs font-medium">This month</span>
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-0.5">
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-medium">Tasks Completed</p>
              <p className="text-lg font-bold text-gray-900">{data?.tasksCompleted || '0'}</p>
              <div className="flex items-center mt-1">
                <span className="text-green-600 text-xs font-medium">Automated</span>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-0.5">
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-medium">Time Saved</p>
              <p className="text-lg font-bold text-gray-900">{data?.timeSaved || '0'}h</p>
              <div className="flex items-center mt-1">
                <span className="text-purple-600 text-xs font-medium">This week</span>
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-0.5">
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-medium">AI Accuracy</p>
              <p className="text-lg font-bold text-gray-900">{data?.aiAccuracy || '0'}%</p>
              <div className="flex items-center mt-1">
                <span className="text-orange-600 text-xs font-medium">Learning</span>
              </div>
            </div>
            <div className="bg-orange-50 rounded-lg p-0.5">
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">AI Assistant</h2>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Online
              </div>
            </div>
            
            {/* Chat Messages */}
            <div className="h-96 overflow-y-auto mb-4 space-y-4">
              {chatHistory.map((message, index) => (
                <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Chat Input */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask me anything about your store..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={sendMessage}
                disabled={!chatMessage.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Features */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">AI Features</h2>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Generate Reports
              </button>
              <button className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Optimize Products
              </button>
              <button className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Predict Trends
              </button>
              <button className="w-full bg-orange-600 text-white p-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Auto-Tag Products
              </button>
            </div>
          </div>

          {/* Recent Insights */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Insights</h2>
            <div className="space-y-3">
              {data?.recentInsights?.map((insight, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-start">
                    <div className="bg-blue-500 rounded-full p-1 mr-2 mt-1">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{insight.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{insight.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{new Date(insight.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">AI Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Model Status</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Response Time</span>
                <span className="text-gray-900 font-medium">1.2s</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Accuracy</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">95%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Last Training</span>
                <span className="text-gray-900 font-medium">2 days ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 