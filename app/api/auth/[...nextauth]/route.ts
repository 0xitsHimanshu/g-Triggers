import NextAuth from "next-auth";
import TwitchProvider from "next-auth/providers/twitch";
import GoogleProvider from "next-auth/providers/google";

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

          const twitchUser = twitchUserData.data[0];
          platformDetails = {
            provider: account.provider,
            user_id: twitchUser.id,
            access_token: account.access_token,
            refresh_token: account.refresh_token,
            expires_at: account.expires_at,
          };
        } else if (account?.provider === "google") {
          platformDetails = {
            provider: account.provider,
            user_id: user.id,
            access_token: account.access_token,
          };
        }

        if (!platformDetails) {
          console.error("Platform details are missing.");
          return false;
        }

        const existingUserResponse = await fetch(
          `${process.env.NEXTAUTH_URL}/api/auth/get-user?email=${user.email}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        const existingUser = await existingUserResponse.json();

        if (existingUser && existingUser._id) {
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
          await fetch(`${process.env.NEXTAUTH_URL}/api/auth/create-user`, {
            method: "POST",
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              platform: account.provider,
              platformDetails,
            }),
            headers: { "Content-Type": "application/json" },
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

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };  