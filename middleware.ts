import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res: response });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isAuthPage =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register") ||
    request.nextUrl.pathname.startsWith("/forgot-password");

  const isProtectedPage =
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/host") ||
    request.nextUrl.pathname.startsWith("/reservations") ||
    request.nextUrl.pathname.startsWith("/bookings") ||
    request.nextUrl.pathname.startsWith("/admin");

  // Redirect authenticated users away from auth pages
  if (isAuthPage && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect unauthenticated users to login
  if (isProtectedPage && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Only hosts can access /host routes
  if (request.nextUrl.pathname.startsWith("/host")) {
    const role = session?.user?.user_metadata?.role;
    if (!session || role !== "host") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Only admins can access /admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const role = session?.user?.user_metadata?.role;
    if (!session || role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/forgot-password",
    "/dashboard/:path*",
    "/host/:path*",
    "/reservations/:path*",
    "/bookings/:path*",
    "/admin/:path*",
  ],
};
