import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import FirebaseConfigTest from '../components/FirebaseConfigTest';

export default function FirebaseTestPage() {
  return (
    <>
      <Head>
        <title>Firebase Test - Kent Traders Admin Dashboard</title>
        <meta name="description" content="Firebase configuration and service testing" />
      </Head>
      <Layout>
        <FirebaseConfigTest />
      </Layout>
    </>
  );
} 