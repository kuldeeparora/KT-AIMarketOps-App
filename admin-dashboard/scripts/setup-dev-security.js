const fs = require('fs');
const https = require('https');
const { execSync } = require('child_process');

console.log('🔒 Setting up development security...');

// Create a self-signed certificate for HTTPS
const createCertificate = () => {
  console.log('📜 Creating self-signed certificate...');
  
  const certConfig = `
[req]
distinguished_name = req_distinguished_name
x509_extensions = v3_req
prompt = no

[req_distinguished_name]
C = US
ST = State
L = City
O = Organization
OU = Organizational Unit
CN = localhost

[v3_req]
keyUsage = keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
DNS.2 = *.localhost
IP.1 = 127.0.0.1
`;

  fs.writeFileSync('cert.conf', certConfig);
  
  try {
    execSync('openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout localhost-key.pem -out localhost-cert.pem -config cert.conf', { stdio: 'inherit' });
    console.log('✅ Certificate created successfully');
  } catch (error) {
    console.log('⚠️ Could not create certificate. Using HTTP instead.');
  }
};

// Update Next.js config for HTTPS
const updateNextConfig = () => {
  console.log('⚙️ Updating Next.js configuration...');
  
  const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // For development and Vercel deployment (with API routes)
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: undefined,
  },
  // Add security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;`;
  
  fs.writeFileSync('next.config.js', nextConfig);
  console.log('✅ Next.js configuration updated');
};

// Create environment template
const createEnvTemplate = () => {
  console.log('📝 Creating environment template...');
  
  const envTemplate = `# Next.js
NEXTAUTH_SECRET=your-super-secret-key-here-make-it-long-and-random
NEXTAUTH_URL=https://localhost:3001

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=kt-aimarketops.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=kt-aimarketops
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=kt-aimarketops.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Development
NODE_ENV=development
DEBUG_ENABLED=1`;
  
  fs.writeFileSync('.env.local.template', envTemplate);
  console.log('✅ Environment template created');
};

const main = () => {
  createCertificate();
  updateNextConfig();
  createEnvTemplate();
  
  console.log('🎉 Development security setup complete!');
  console.log('📋 Next steps:');
  console.log('1. Copy .env.local.template to .env.local');
  console.log('2. Update the environment variables with your actual values');
  console.log('3. Run: npm run dev');
  console.log('4. Access via: https://localhost:3001');
};

main(); 