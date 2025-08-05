import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import adminAuth from '../../../lib/adminAuth';

// Check if we're in a static environment
const isStaticEnvironment = process.env.BUILD_TARGET === 'firebase' || 
  process.env.NODE_ENV === 'production';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Add your credential validation logic here
        if (credentials.email === "admin@kenttraders.com" && credentials.password === "password") {
          return {
            id: 1,
            name: "Admin User",
            email: "admin@kenttraders.com",
            role: "ADMIN"
          };
        }
        return null;
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          accessTokenExpires: account.expires_at * 1000,
          user,
        };
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.user = token.user;
      session.accessToken = token.accessToken;
      session.error = token.error;

      return session;
    },
    async signIn({ user, account, profile }) {
      // Skip approval for static environment
      if (isStaticEnvironment) {
        return true;
      }

      // Check if user is admin or pre-approved
      if (adminAuth.isAdmin(user.email) || adminAuth.isPreApproved(user.email)) {
        console.log(`✅ AUTO-APPROVED: ${user.email} (admin/pre-approved)`);
        return true;
      }

      // Request admin approval for all other users
      const userData = {
        email: user.email,
        name: user.name,
        provider: account?.provider || 'credentials',
        image: user.image
      };

      const requestId = adminAuth.requestApproval(userData);
      
      // Store request ID in user object for later reference
      user.approvalRequestId = requestId;
      
      console.log(`⏳ PENDING APPROVAL: ${user.email} - Request ID: ${requestId}`);
      
      // Return false to prevent sign in until approved
      return false;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify',
    newUser: '/auth/signin'
  },
  debug: process.env.NODE_ENV === 'development',
  logger: {
    error(code, ...message) {
      if (isStaticEnvironment) {
        // Suppress errors in static environment
        return;
      }
      console.error(code, ...message);
    },
    warn(code, ...message) {
      if (isStaticEnvironment) {
        // Suppress warnings in static environment
        return;
      }
      console.warn(code, ...message);
    },
    debug(code, ...message) {
      if (isStaticEnvironment) {
        // Suppress debug in static environment
        return;
      }
      console.debug(code, ...message);
    }
  }
});

async function refreshAccessToken(token) {
  try {
    const url = "https://oauth2.googleapis.com/token";
    const response = await fetch(url, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      method: "POST",
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error("Error refreshing access token", error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}
