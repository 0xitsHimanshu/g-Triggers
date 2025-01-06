import NextAuth , {AuthOptions, Session, User as UserType} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import TwitchProvider from "next-auth/providers/twitch";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from 'bcrypt';

export const authOptions: AuthOptions = {
  providers: [
    TwitchProvider({
      clientId: process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_TWITCH_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      const platformDetails = {
        provider: account?.provider,
        access_token: account?.access_token,
        refresh_token: account?.refresh_token,
        profile_url: account?.providerAccountId,
      };

      await fetch(`${process.env.NEXTAUTH_URL}/api/auth/create-user`, {
        method: "POST",
        body: JSON.stringify({
          email: user.email,
          name: user.name,
          platform: account?.provider,
          platformDetails,
        }),
        headers: { "Content-Type": "application/json" },
      });

      return true;
    },
  },
  
  pages: {
    signIn: "/sign-in",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };