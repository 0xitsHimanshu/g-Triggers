import Button from "@/components/button";
import Image from "next/image";
import Link from "next/link";

export default function SignUp() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <Image src="/Logo-Transparent.png" alt="Game Triggers" width={150} height={30} />
        </div>
        <h1 className="text-white text-2xl font-bold mb-4">Welcome back!</h1>
        <p className="text-gray-400 mb-8">Login to your account by using one of your streaming platform accounts.</p>
        <div className="space-y-4">
         <Button providerName={'Twitch'} bgColor={'purple'} method="Sign Up" />
         <Button providerName={'Youtube'} bgColor={'red'} method="Sign Up" />
        </div>
        <p className="text-gray-400 mt-8 text-center">
          Already have an account? <Link href="/" className="text-purple-600 hover:text-purple-700">Login</Link>
        </p>
      </div>
    </div>
  );
}