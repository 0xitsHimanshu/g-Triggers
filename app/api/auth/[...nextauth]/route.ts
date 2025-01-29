import NextAuth from "next-auth";
import TwitchProvider from "next-auth/providers/twitch";
import GoogleProvider from "next-auth/providers/google";

// Type definitions
interface PlatformDetails {
  provider: string;
  access_token: string;
  refresh_token: string;
  // profile_url: string;
  expires_at?: number;
}

interface UserPlatforms {
  [key: string]: PlatformDetails;
}

interface User {
  id?: string;
  email: string;
  name: string;
  platforms?: UserPlatforms;
}

export const authOptions = {
  providers: [
    TwitchProvider({
      clientId: process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_TWITCH_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: "openid user:read:email user:read:broadcast analytics:read:games moderator:read:followers",
        },
      },
    }),
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/youtube.readonly",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }: { user: any; account: any; profile?: any }) {
      try {
        const platformDetails: PlatformDetails = {
          provider: account.provider,
          access_token: account.access_token,
          refresh_token: account.refresh_token,
          // profile_url: getProfileUrl(account.provider, profile),
          expires_at: account.expires_at,
        };

        // Fetch existing user data first
        const existingUserResponse = await fetch(
          `${process.env.NEXTAUTH_URL}/api/auth/get-user?email=${user.email}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const existingUser = await existingUserResponse.json();

        if (existingUser && existingUser._id) {
          // Update existing user with new platform
          await fetch(`${process.env.NEXTAUTH_URL}/api/auth/update-user`, {
            method: "PUT",
            body: JSON.stringify({
              email: user.email,
              platformDetails,
              platform: account.provider,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });
        } else {
          // Create new user with initial platform
          await fetch(`${process.env.NEXTAUTH_URL}/api/auth/create-user`, {
            method: "POST",
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              platform: account.provider,
              platformDetails,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });
        }

        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },

    async session({ session, token }: { session: any; token: any }) {
      try {
        // Fetch user data including platforms
        const response = await fetch(
          `${process.env.NEXTAUTH_URL}/api/auth/get-user?email=${session.user.email}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const userData = await response.json();

        // Add user data to session
        session.user.id = token.id;
        session.accessToken = token.accessToken;
        session.user.platforms = userData.platforms || {};

        return session;
      } catch (error) {
        console.error("Error in session callback:", error);
        return session;
      }
    },

    async jwt({ token, user, account }: { token: any; user: any; account: any }) {
      if (account) {
        token.id = user.id;
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Helper function to get profile URLs based on provider
function getProfileUrl(provider: string, profile: any): string {
  switch (provider) {
    case "twitch":
      return `https://twitch.tv/${profile.preferred_username || profile.name}`;
    case "google":
      // For YouTube, you might need to make an additional API call to get the channel URL
      // For now, we'll use the email as a placeholder
      return profile.email;
    default:
      return profile.email || "";
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST };