import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import Image from "next/image";
import { Toaster } from "@/components/ui/toaster";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Game Triggers",
  description: "The best place for streamers to find their sponsors!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main className="min-h-screen flex flex-col items-center">
              <div className="flex-1 w-full flex flex-col items-center">
                <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                  <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                    {" "}
                    {/* Navbar and */}
                    <div className="flex gap-5 items-center font-semibold">
                      <Link href={"/"} className="flex items-center gap-2">
                        <Image
                          src={"/logo.png"}
                          alt="Game Triggers"
                          width={32}
                          height={32}
                        ></Image>
                        Game Triggers
                      </Link>
                      <div className="flex items-center gap-2"></div>
                    </div>
                    <div className="flex justify-center items-center gap-4">
                      <ThemeSwitcher />
                      <span className="border-l h-6" />
                      <HeaderAuth />
                    </div>
                  </div>
                </nav>
                <div className="flex flex-col w-full items-center">
                  {children}
                </div>
                {/* <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
                  Add some footer info here! 
              </footer> */}
              </div>
                  <Toaster />
            </main>
          </ThemeProvider>
      </body>
    </html>
  );
}
