import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if(session) console.log(session?.user);
  
  return session?.user || null; // Return user if authenticated, else null
}
