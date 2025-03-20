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
]; 

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  console.log("Middleware - Path:", pathname);
  console.log("Middleware - Token:", token);

  // Skip authentication check for public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Redirect to login if token is missing
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

// Adjust matcher to avoid applying middleware to public routes
export const config = {
  matcher: ["/dashboard/:path*"], // Apply middleware only to protected routes
};
