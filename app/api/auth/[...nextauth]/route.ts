import NextAuth , {AuthOptions, Session, User as UserType} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import TwitchProvider from "next-auth/providers/twitch";
import connectToDatabase from "@/lib/mongodb";
import { JWT } from "next-auth/jwt";
import User from "@/models/User";
import bcrypt from 'bcrypt';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const { email, password } = credentials;

        // Connect to MongoDB and find the user
        await connectToDatabase();
        const user = await User.findOne({ email});

        if (!user) throw new Error("User not found");

        // Verify the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new Error("Invalid credentials");

        return {
          id: user._id,
          email: user.email,
          name: user.name,
        };
      },
    }),
    TwitchProvider({
      clientId: process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_TWITCH_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }: {session: Session; token: JWT}) {
      if (token.sub) {
        session.user.id = token.sub; // `sub` contains the user ID
      }
      return session;
    },
    async jwt({ token, user }: {token: JWT; user: UserType}) {
      if (user) {
        token.sub = user.id; // Store the user ID in the JWT `sub` field
      }
      return token;
    },
  },
  
  pages: {
    signIn: "/sign-in",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };