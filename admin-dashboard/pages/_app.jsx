import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import { AIMarketOpsThemeProvider } from '../components/AIMarketOpsTheme';
import ErrorBoundary from '../components/ErrorBoundary';
import { useEffect, useState } from 'react';

// Custom SessionProvider for static environments
function StaticSessionProvider({ children }) {
  const [isStatic, setIsStatic] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    // Check if we're in a static environment (Firebase hosting)
    const staticEnv = typeof window !== 'undefined' && 
      (window.location.hostname.includes('web.app') || 
       window.location.hostname.includes('firebaseapp.com'));
    
    setIsStatic(staticEnv);
  }, []);

  // Prevent SSR hydration issues
  if (!isMounted) {
    return (
      <SessionProvider>
        {children}
      </SessionProvider>
    );
  }

  if (isStatic) {
    // In static environment, provide a mock session
    const mockSession = {
      data: {
        user: {
          id: 'demo-user',
          email: 'demo@kenttraders.co.uk',
          name: 'Demo User',
          image: null
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      },
      status: 'authenticated'
    };

    return (
      <SessionProvider session={mockSession}>
        {children}
      </SessionProvider>
    );
  }

  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Suppress browser extension errors
    const originalError = console.error;
    console.error = (...args) => {
      const message = args[0]?.toString() || '';
      if (message.includes('message channel closed') || 
          message.includes('Invalid frameId') ||
          message.includes('Cannot create item with duplicate id') ||
          message.includes('useContext')) {
        // Suppress browser extension errors and context errors
        return;
      }
      originalError.apply(console, args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  // Prevent hydration issues by not rendering until mounted
  if (!isMounted) {
    return null;
  }

  return (
    <ErrorBoundary>
      <StaticSessionProvider>
        <AIMarketOpsThemeProvider>
          <Component {...pageProps} />
        </AIMarketOpsThemeProvider>
      </StaticSessionProvider>
    </ErrorBoundary>
  );
} 