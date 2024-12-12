'use client'

import Button from "@/components/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

/**
 * The homepage of the application.
 *
 * Displays a call-to-action to log in to their account using one of their
 * streaming platform accounts.
 *
 * @returns The JSX element representing the homepage.
 */

export default function Home() {
  const router = useRouter();
  const handleCLick = () => {
    return () => {
      router.push('/dashboard');
    }
  }
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <Image src="/Logo-Transparent.png" alt="Game Triggers" width={150} height={30} />
        </div>
        <h1 className="text-white text-2xl font-bold mb-4">Welcome back!</h1>
        <p className="text-gray-400 mb-8">Login to your account by using one of your streaming platform accounts.</p>
        <div className="space-y-4">
          <Button providerName={'Twitch'} bgColor={'purple'} method="Login" onClick={handleCLick()}/>
          <Button providerName={"Youtube"} bgColor={"red"} method="Login" onClick={handleCLick()}/>
        </div>
        <p className="text-gray-400 mt-8 text-center">
          Don&apos;t have an account yet? <Link href="/signup" className="text-purple-600 hover:text-purple-700">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
