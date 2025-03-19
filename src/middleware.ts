import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = [
  "/",
  "/navlinks",
  "/navlinks/contact",
  "/navlinks/about",
  "/navlinks/gallery",
  "/navlinks/products",
  "/auth/login",
  "/auth/register",
]; // Define routes that don't require authentication

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // Allow public routes without authentication
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Redirect to login if token is missing
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/((?!_next|static|favicon.ico|api).*)"], 
  // Protect "/dashboard" and its subpaths, and apply middleware only to non-public assets
};
