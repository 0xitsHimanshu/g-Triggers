import NextAuth from "next-auth";
import TwitchProvider from "next-auth/providers/twitch";
import GoogleProvider from "next-auth/providers/google";


export const authOptions = {
  providers: [
    TwitchProvider({
      clientId: process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_TWITCH_CLIENT_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: "https://www.googleapis.com/auth/youtube.readonly",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Automatically create user in MongoDB
      const { email, name } = user;
      const platformDetails = {
        provider: account.provider,
        access_token: account.access_token,
        refresh_token: account.refresh_token,
        profile_url: account.providerAccountId, // Twitch, YouTube, or Trovo
      };

      await fetch(`${process.env.NEXTAUTH_URL}/api/auth/create-user`, {
        method: "POST",
        body: JSON.stringify({
          email,
          name,
          platform: account.provider,
          platformDetails,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      return true;
    },
    async session({ session, token }) {
      (session as any).user.id = token.id;
      (session as any).accessToken = token.accessToken;
      return session;
    },
    async jwt({ token, user, account }) {
      if (account) {
        (token as any).id = user.id;
        (token as any).accessToken = account.access_token;
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };