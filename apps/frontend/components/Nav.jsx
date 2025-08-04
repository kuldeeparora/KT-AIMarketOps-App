import Link from 'next/link';
import { useRouter } from 'next/router';

const navStyle = {
  display: 'flex', 
  flexDirection: 'column', 
  gap: 16, 
  padding: 24, 
  background: '#f5f5f5', 
  minHeight: '100vh', 
  minWidth: 220,
  borderRight: '1px solid #e5e7eb'
};

const linkStyle = {
  padding: '12px 16px',
  borderRadius: '8px',
  textDecoration: 'none',
  color: '#374151',
  fontWeight: '500',
  transition: 'all 0.2s',
  display: 'flex',
  alignItems: 'center',
  gap: '12px'
};

const activeLinkStyle = {
  ...linkStyle,
  backgroundColor: '#3b82f6',
  color: 'white'
};

const iconStyle = {
  width: '20px',
  height: '20px'
};

const sectionHeaderStyle = {
  fontSize: '12px',
  color: '#6b7280',
  marginBottom: '8px',
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};

const sectionDividerStyle = {
  marginTop: '16px',
  marginBottom: '8px',
  borderTop: '1px solid #e5e7eb',
  paddingTop: '16px'
};

export default function Nav() {
  const router = useRouter();
  
  const isActive = (path) => router.pathname === path;

  return (
    <nav style={navStyle}>
      <div style={{ marginBottom: '24px', padding: '0 16px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827' }}>Kent Traders</h2>
        <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>Admin Dashboard</p>
      </div>
      
      {/* Additional Tools Section - Moved to Top */}
      <div>
        <div style={sectionHeaderStyle}>Additional Tools</div>
        <Link href="/accounting" style={isActive('/accounting') ? activeLinkStyle : linkStyle}>
          <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
          Accounting
        </Link>
        
        <Link href="/inventory" style={isActive('/inventory') ? activeLinkStyle : linkStyle}>
          <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          Inventory
        </Link>
        
        <Link href="/plugins" style={isActive('/plugins') ? activeLinkStyle : linkStyle}>
          <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          Plugins
        </Link>
        
        <Link href="/ai-copilot" style={isActive('/ai-copilot') ? activeLinkStyle : linkStyle}>
          <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          AI Copilot
        </Link>
      </div>
      
      {/* Navigation Section - Grouped Together */}
      <div style={sectionDividerStyle}>
        <div style={sectionHeaderStyle}>Navigation</div>
        <Link href="/" style={isActive('/') ? activeLinkStyle : linkStyle}>
          <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          </svg>
          Dashboard
        </Link>
        
        <Link href="/orders" style={isActive('/orders') ? activeLinkStyle : linkStyle}>
          <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Orders
        </Link>
        
        <Link href="/analytics" style={isActive('/analytics') ? activeLinkStyle : linkStyle}>
          <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Analytics
        </Link>
        
        <Link href="/audit" style={isActive('/audit') ? activeLinkStyle : linkStyle}>
          <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Audit
        </Link>
      </div>
    </nav>
  );
}
