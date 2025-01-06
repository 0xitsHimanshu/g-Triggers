import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";
import { Button } from "@/components/ui/button";
import twitchIcon from "@/public/twitch.svg"
import Image from "next/image";
import { signIn } from "next-auth/react";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <form className="flex flex-col min-w-64 max-w-64 mx-auto pt-20 ">
        <h1 className="text-2xl font-medium">Sign up</h1>
        <p className="text-sm text text-foreground">
          Already have an account?{" "}
          <Link className="text-primary font-medium underline" href="/sign-in">
            Sign in
          </Link>
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          {/* <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="you@example.com" required />
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            minLength={6}
            required
          />
          <SubmitButton formAction={signUpAction} pendingText="Signing up...">
            Sign up
          </SubmitButton> */}
          <Button className="bg-youtube-red hover:bg-red-600 text-white">
            <span className="flex items-center gap-4">
              <svg
                data-v-84aeb318=""
                version="1.1"
                viewBox="0 0 26 20"
                className="svg-icon svg-fill"
                style={{ width: 30, height: 22 }}
              >
                <path
                  fill="white"
                  fillRule="evenodd"
                  d="M23.149.597c1.123.338 2.009 1.306 2.304 2.532C26 5.355 26 10 26 10s0 4.645-.532 6.871c-.31 1.242-1.182 2.21-2.304 2.532C21.125 20 13 20 13 20s-8.125 0-10.149-.597C1.728 19.065.842 18.097.547 16.871 0 14.645 0 10 0 10s0-4.645.532-6.871C.842 1.887 1.714.919 2.836.597 4.875 0 13 0 13 0s8.125 0 10.149.597zM17.136 10l-6.795 4.226V5.774L17.136 10z"
                  clipRule="evenodd"
                ></path>
              </svg>
              Sign up with Youtube
            </span>
          </Button>

          <Button
            onClick={() => signIn("twitch", { callbackUrl: "/platform" })} 
            className="bg-twitch-purple hover:bg-purple-600 text-white"
          >
            <span className="flex items-center gap-4">
              <svg
                data-v-84aeb318=""
                version="1.1"
                viewBox="0 0 14 16"
                className="svg-icon svg-fill"
                style={{ width: 24, height: 24 }}
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0 3l3-3h11v8l-5 5H7l-3 3v-3H0V3zm4-2h9v6.5L10.5 10H8l-2 2v-2H4V1zm4 2H7v3.5h1V3zm2 0h1v3.5h-1V3z"
                  fill="#fff"
                ></path>
              </svg>
              Sign up with Twitch
            </span>
          </Button>

          <Button className="bg-trovo-green hover:bg-green-600 text-white">
            <span className="flex items-center gap-4">
              <svg
                data-v-84aeb318=""
                version="1.1"
                viewBox="0 0 32 32"
                className="svg-icon svg-fill"
                style={{width: 32, height: 32}}
              >
                <path
                  fill="white"
                  d="M25.97 21.114c-.44-1.764-1.76-2.94-3.62-2.926-1.821.014-2.832 1.17-2.97 2.453-.098.946.261 1.705.785 2.016.963.571 1.64-.402 1.264-.763-.241-.232-.353-.429-.3-.78.052-.352.321-.704.955-.704.634 0 1.168.453 1.282 1.39a2.369 2.369 0 01-1.877 2.574c-1.626.343-3.266-.524-3.846-1.921-.58-1.397-.424-3.575.966-4.907 1.101-1.055 2.524-1.444 3.74-1.444l4.057.178a.633.633 0 00.643-.478l1.732-7.076a.649.649 0 00.019-.154c0-.35-.243-.633-.594-.633H20.79a.317.317 0 01-.308-.388l.829-3.576a.632.632 0 00-.617-.775h-7.677a.95.95 0 00-.917.702l-.849 3.572a.634.634 0 01-.611.468H5.724a.95.95 0 00-.926.743l-1.583 7.037a.657.657 0 00.033.382.634.634 0 00.585.39h5.043a.474.474 0 01.466.567c-.148.74-.249 1.488-.302 2.24-.153 2.193.423 4.596 2.154 6.472 2.946 3.191 8.385 3.376 11.603 1.603 2.586-1.427 3.724-4.053 3.173-6.262z"
                ></path>
              </svg>
              Sign up with Trovo
            </span>
          </Button>
          <FormMessage message={searchParams} />
        </div>
      </form>
      <SmtpMessage />
    </>
  );
}
