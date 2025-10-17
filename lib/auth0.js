/**
 * Auth0 Integration Module
 * 
 * This module provides authentication functionality using Auth0.
 * 
 * To use Auth0, install the required packages:
 * npm install @auth0/nextjs-auth0
 * 
 * Then wrap your app with the UserProvider in layout.js
 */

/**
 * Auth0 Configuration
 * 
 * Required environment variables:
 * - AUTH0_SECRET: A long, random string for encrypting cookies
 * - AUTH0_BASE_URL: Your app URL (e.g., http://localhost:3000)
 * - AUTH0_ISSUER_BASE_URL: Your Auth0 domain (e.g., https://your-domain.auth0.com)
 * - AUTH0_CLIENT_ID: Your Auth0 application client ID
 * - AUTH0_CLIENT_SECRET: Your Auth0 application client secret
 */

// Uncomment when @auth0/nextjs-auth0 is installed:
// import { handleAuth, handleLogin, handleCallback, handleLogout } from '@auth0/nextjs-auth0';
// import { getSession, withApiAuthRequired, withPageAuthRequired } from '@auth0/nextjs-auth0';

/**
 * Check if Auth0 is configured
 * @returns {boolean} Whether Auth0 is configured
 */
export function isAuth0Configured() {
  return !!(
    process.env.AUTH0_SECRET &&
    process.env.AUTH0_BASE_URL &&
    process.env.AUTH0_ISSUER_BASE_URL &&
    process.env.AUTH0_CLIENT_ID &&
    process.env.AUTH0_CLIENT_SECRET
  );
}

/**
 * Get the current user session
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 * @returns {Promise<Object|null>} User session or null
 */
export async function getUserSession(req, res) {
  if (!isAuth0Configured()) {
    console.warn("Auth0 not configured, returning mock user session");
    return getMockSession();
  }

  try {
    /* Uncomment when ready to use Auth0:
    
    const session = await getSession(req, res);
    return session;
    */

    return getMockSession();
  } catch (error) {
    console.error("Error getting user session:", error);
    return null;
  }
}

/**
 * Protect API routes with authentication
 * This is a higher-order function that wraps API routes
 * @param {Function} handler - API route handler
 * @returns {Function} Protected handler
 */
export function protectApiRoute(handler) {
  if (!isAuth0Configured()) {
    console.warn("Auth0 not configured, API route not protected");
    return handler;
  }

  /* Uncomment when ready to use Auth0:
  return withApiAuthRequired(handler);
  */

  return handler;
}

/**
 * Protect pages with authentication
 * This is a higher-order function that wraps page components
 * @param {Function} Component - Page component
 * @returns {Function} Protected component
 */
export function protectPage(Component) {
  if (!isAuth0Configured()) {
    console.warn("Auth0 not configured, page not protected");
    return Component;
  }

  /* Uncomment when ready to use Auth0:
  return withPageAuthRequired(Component);
  */

  return Component;
}

/**
 * Get user profile information
 * @param {Object} session - User session
 * @returns {Object} User profile
 */
export function getUserProfile(session) {
  if (!session || !session.user) {
    return null;
  }

  return {
    id: session.user.sub,
    email: session.user.email,
    name: session.user.name,
    picture: session.user.picture,
    emailVerified: session.user.email_verified,
  };
}

/**
 * Get mock session for development
 * @returns {Object} Mock session
 */
function getMockSession() {
  return {
    user: {
      sub: "auth0|mock_user_123456789",
      email: "demo@aiinterviewer.com",
      name: "Demo User",
      picture: "https://via.placeholder.com/150",
      email_verified: true,
    },
  };
}

/**
 * Auth0 Setup Instructions
 * 
 * 1. Create an Auth0 Account:
 *    - Go to https://auth0.com/ and sign up
 *    - Create a new tenant (e.g., "ai-interviewer")
 * 
 * 2. Create an Application:
 *    - In Auth0 Dashboard, go to Applications > Create Application
 *    - Choose "Regular Web Application"
 *    - Select "Next.js" as the technology
 * 
 * 3. Configure Application Settings:
 *    - Allowed Callback URLs: http://localhost:3000/api/auth/callback
 *    - Allowed Logout URLs: http://localhost:3000
 *    - Application Login URI: http://localhost:3000/api/auth/login
 * 
 * 4. Get Credentials:
 *    - Copy Domain, Client ID, and Client Secret
 *    - Add to .env.local file
 * 
 * 5. Install Package:
 *    npm install @auth0/nextjs-auth0
 * 
 * 6. Create Auth API Route:
 *    Create file: app/api/auth/[auth0]/route.js
 *    Content:
 *    ```javascript
 *    import { handleAuth } from '@auth0/nextjs-auth0';
 *    export const GET = handleAuth();
 *    ```
 * 
 * 7. Wrap App with UserProvider:
 *    In app/layout.js, wrap children with:
 *    ```javascript
 *    import { UserProvider } from '@auth0/nextjs-auth0/client';
 *    
 *    export default function RootLayout({ children }) {
 *      return (
 *        <html>
 *          <body>
 *            <UserProvider>
 *              {children}
 *            </UserProvider>
 *          </body>
 *        </html>
 *      );
 *    }
 *    ```
 * 
 * 8. Use in Components:
 *    ```javascript
 *    import { useUser } from '@auth0/nextjs-auth0/client';
 *    
 *    function MyComponent() {
 *      const { user, error, isLoading } = useUser();
 *      
 *      if (isLoading) return <div>Loading...</div>;
 *      if (error) return <div>{error.message}</div>;
 *      
 *      if (user) {
 *        return <div>Welcome {user.name}!</div>;
 *      }
 *      
 *      return <a href="/api/auth/login">Login</a>;
 *    }
 *    ```
 */

export const AUTH0_SETUP_GUIDE = {
  step1: "Create Auth0 account at https://auth0.com/",
  step2: "Create a Regular Web Application",
  step3: "Configure callback URLs in application settings",
  step4: "Copy credentials to .env.local",
  step5: "Install @auth0/nextjs-auth0 package",
  step6: "Create app/api/auth/[auth0]/route.js",
  step7: "Wrap app with UserProvider in layout.js",
  step8: "Use useUser hook in components",
};
