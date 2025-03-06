import NextAuth from "next-auth";
import TwitchProvider from "next-auth/providers/twitch";
import GoogleProvider from "next-auth/providers/google";
import User from "../../../../models/User";
import { updateUserStreak } from "../../../../utils/streakService";
// Type definitions
interface PlatformDetails {
  provider: string;
  access_token: string;
  refresh_token?: string;
  user_id: string;
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

// PROVIDER FOR DIFFERENT PLATFORMS
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
    async signIn({ user, account }: { user: any; account: any }) {
      try {
        if (!user.email) {
          console.error("User email is missing in signIn callback.");
          return false;
        }
    
        let platformDetails: PlatformDetails | null = null;
    
        if (account?.provider === "twitch") {
          // Fetch user details from Twitch API
          const twitchUserResponse = await fetch("https://api.twitch.tv/helix/users", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${account.access_token}`,
              "Client-Id": process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID as string,
            },
          });
    
          const twitchUserData = await twitchUserResponse.json();
          if (!twitchUserData?.data?.length) {
            console.error("Failed to fetch Twitch user data.");
            return false;
          }
    
          const twitchUser = twitchUserData.data[0]; // Extract user details
          platformDetails = {
            provider: account.provider,
            user_id: twitchUser.id, // Save Twitch user ID
            access_token: account.access_token,
            refresh_token: account.refresh_token,
            expires_at: account.expires_at,
          };
        } else if (account?.provider === "google") {
          platformDetails = {
            provider: account.provider,
            user_id: user.id, // Use Google user ID
            access_token: account.access_token,
          };
        }
    
        if (!platformDetails) {
          console.error("Platform details are missing.");
          return false;
        }
    
        // Check if the user exists in the database
        const existingUserResponse = await fetch(
          `${process.env.NEXTAUTH_URL}/api/auth/get-user?email=${user.email}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
    
        const existingUser = await existingUserResponse.json();
    
        if (existingUser && existingUser._id) {
          // User exists → Add platform details but keep primaryPlatform unchanged
          await fetch(`${process.env.NEXTAUTH_URL}/api/auth/update-user`, {
            method: "PUT",
            body: JSON.stringify({
              email: user.email,
              platformDetails,
              platform: account.provider,
            }),
            headers: { "Content-Type": "application/json" },
          });
        } else {
          // New user → Set the first platform as their primary platform
          await fetch(`${process.env.NEXTAUTH_URL}/api/auth/create-user`, {
            method: "POST",
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              primaryPlatform: account.provider, // ✅ Set primary platform on first sign-in
              platform: account.provider,
              platformDetails,
            }),
            headers: { "Content-Type": "application/json" },
          });
        }

        // Update the user's streak using direct DB access:
        const dbUser = await User.findOne({ email: user.email });
        if (dbUser) {
          await updateUserStreak(dbUser);
        }
    
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },

    async session({ session, token }: { session: any; token: any }) {
      try {
        if (!session.user?.email) {
          console.error("Error: session.user.email is undefined");
          return session;
        }

        const response = await fetch(
          `${process.env.NEXTAUTH_URL}/api/auth/get-user?email=${session.user.email}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.statusText}`);
        }

        const userData = await response.json();
        session.user.id = token.id || userData?.id;
        session.accessToken = token.accessToken;
        session.user.platforms = userData?.platforms || {};

        // Expose the updated streak count in the session
        session.user.strekCount = token.streakCount || userData?.streakCount || 0;

        return session;
      } catch (error) {
        console.error("Error in session callback:", error);
        return session;
      }
    },

    async jwt({ token, user, account }: { token: any; user: any; account: any }) {
      if(user) {
        token.id = user.id;
        // Pass along the current streak count (defaulting to 0 if undefined)
        token.streakCount = user.streakCount || 0;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };