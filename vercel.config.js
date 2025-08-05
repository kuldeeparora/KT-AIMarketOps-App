/** @type {import('@vercel/node').VercelConfig} */
module.exports = {
  buildCommand: 'cd admin-dashboard && npm run build',
  outputDirectory: 'admin-dashboard/.next',
  installCommand: 'npm install',
  framework: 'nextjs',
  functions: {
    'admin-dashboard/pages/api/**/*.js': {
      runtime: 'nodejs18.x'
    }
  },
  rewrites: [
    {
      source: '/api/(.*)',
      destination: '/api/$1'
    },
    {
      source: '/(.*)',
      destination: '/$1'
    }
  ]
}; 