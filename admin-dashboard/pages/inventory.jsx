import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import InventoryDashboard from '../components/inventory/InventoryDashboard';

export default function InventoryPage() {
  return (
    <>
      <Head>
        <title>Inventory Management - Kent Traders Admin Dashboard</title>
        <meta name="description" content="Comprehensive inventory management and stock tracking" />
      </Head>
      <Layout>
        <InventoryDashboard />
      </Layout>
    </>
  );
} 