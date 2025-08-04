import React from 'react';

export default function LayoutSimple({ children }) {
  return (
    <div>
      <header style={{ background: '#1976d2', color: 'white', padding: '1rem' }}>
        <h1>Kent Traders</h1>
      </header>
      <div style={{ display: 'flex' }}>
        <nav style={{ width: '280px', background: '#f5f5f5', padding: '1rem', minHeight: '100vh' }}>
          <h3>Navigation</h3>
          <ul>
            <li>Dashboard</li>
            <li>Inventory</li>
            <li>Orders</li>
            <li>Analytics</li>
          </ul>
        </nav>
        <main style={{ flex: 1, padding: '2rem' }}>
          {children}
        </main>
      </div>
    </div>
  );
} 