import pkg from '@shopify/shopify-app-express';
import { SQLiteSessionStorage } from '@shopify/shopify-app-session-storage-sqlite';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve('../../.env') });

const { shopifyApp, LATEST_API_VERSION } = pkg;

const DB_PATH = path.resolve(process.cwd(), 'database.sqlite');

export const shopify = shopifyApp({
  api: {
    apiKey: process.env.SHOPIFY_API_KEY,
    apiSecretKey: process.env.SHOPIFY_API_SECRET,
    hostName: process.env.HOST.replace(/^https?:\/\//, ''),
    scopes: process.env.SCOPES.split(','),
    apiVersion: LATEST_API_VERSION,
  },
  auth: {
    path: '/api/auth',
    callbackPath: '/api/auth/callback',
    exitIframePath: '/api/auth/exit-iframe',
    returnSplashPage: true,
  },
  webhooks: {
    path: '/api/webhooks',
  },
  // Set to true since we fixed the iframe issues
  isEmbeddedApp: true,
  // Required for proper embedded app behavior
  useOnlineTokens: true,
  hooks: {
    afterAuth: async ({ session, req, res }) => {
      const { shop, accessToken } = session;
      
      if (!shop || !accessToken) {
        console.error('Missing shop or accessToken in session:', { shop, hasToken: !!accessToken });
        return;
      }

      // Store session info in cookies with proper security settings
      res.cookie('shopOrigin', shop, {
        httpOnly: false,
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });

      // Pass the access token to the frontend
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000
      });

      // You can setup webhooks here if needed
      try {
        const response = await shopify.api.rest.Webhook.all({
          session: session,
        });
        console.log('Current webhooks:', response);
      } catch (error) {
        console.error('Error fetching webhooks:', error);
      }
    },
  },
  sessionStorage: new SQLiteSessionStorage(DB_PATH),
});
