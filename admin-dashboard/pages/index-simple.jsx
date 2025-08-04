import React from 'react';
import Head from 'next/head';

export default function IndexSimple() {
  return (
    <>
      <Head>
        <title>Kent Traders - Simple Test</title>
      </Head>
      <div>
        <h1>Kent Traders Dashboard</h1>
        <p>Simple test page without Layout component.</p>
      </div>
    </>
  );
} 