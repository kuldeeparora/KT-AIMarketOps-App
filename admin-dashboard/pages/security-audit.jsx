import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import SecurityAudit from '../components/auth/SecurityAudit';

export default function SecurityAuditPage() {
  return (
    <>
      <Head>
        <title>Security Audit - Kent Traders Admin Dashboard</title>
        <meta name="description" content="Security audit and authentication status" />
      </Head>
      <Layout>
        <SecurityAudit />
      </Layout>
    </>
  );
} 