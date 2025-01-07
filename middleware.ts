import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  // Define a secret for JWT validation (set this in your .env file)
  const secret = process.env.NEXTAUTH_SECRET;

  // Extract token from the request
  const token = await getToken({ req: request, secret });

  // Get the current pathname
  const pathname = request.nextUrl.pathname;

  // Handle redirect for authenticated users accessing `/`
  if (pathname === "/" && token) {
    // Redirect authenticated users to `/platform`
    const platformUrl = new URL("/platform", request.url);
    return NextResponse.redirect(platformUrl);
  }

  // Protect specific routes based on authentication
  const protectedRoutes = ["/platform", "/dashboard"]; // Add routes you want to protect
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      // Redirect unauthenticated users to the login page
      const loginUrl = new URL("/sign-in", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Allow request to proceed for public routes or unauthenticated users
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
