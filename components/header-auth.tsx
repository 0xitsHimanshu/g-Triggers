import { getCurrentUser } from "@/utils/getCurrentUser";
import ClientAuthButton from "./clientAuthButton";

export default async function AuthButton() {
  const user = await getCurrentUser(); // Fetch the authenticated user
  return <ClientAuthButton user={user} />;
}
