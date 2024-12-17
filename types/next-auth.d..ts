import NextAuth, { DefaultSession, DefaultUser, DefaultAccount, DefaultJWT } from "next-auth";

// 1. Extend the default session
declare module "next-auth" {
  interface Session {
    accessToken?: string; // Add custom access token
    refreshToken?: string; // Add refresh token
    provider?: string; // Add provider name
    user: DefaultSession["user"] & {
      id: string; // Add user ID from Supabase
    };
  }

  // 2. Extend the User object
  interface User extends DefaultUser {
    id: string; // Custom user ID
  }

  // 3. Extend the Account object
  interface Account extends DefaultAccount {
    access_token?: string; // OAuth access token
    refresh_token?: string; // OAuth refresh token
    provider?: string; // OAuth provider name
  }
}

// 4. Extend JWT token
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessToken?: string; // OAuth access token
    refreshToken?: string; // OAuth refresh token
    provider?: string; // OAuth provider name
  }
}
