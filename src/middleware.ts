/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public routes that don't require authentication
const publicRoutes = [
  "/",
  "/navlinks",
  "/navlinks/contact",
  "/navlinks/about",
  "/navlinks/gallery",
  "/navlinks/products",
  "/navlinks/services/aashram",
  "/navlinks/services",
  "/navlinks/services/product-listing",
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
];

// Admin UI routes that require admin verification
const adminRoutes = [
  "/admin",
  "/admin/users",
  "/admin/products",
  "/admin/orders",
  "/admin/referrals",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  console.log("Middleware - Path:", pathname);
  console.log("Middleware - Token:", token);

  // Allow public routes without auth
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Check for admin route
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // API admin routes are verified in their handlers
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.next();
    }

    try {
      // Verify admin token for UI admin pages
      const verifyRes = await fetch(new URL("/api/admin/verify", req.url), {
        headers: {
          Cookie: `token=${token}`,
        },
      });

      if (!verifyRes.ok) {
        const res = NextResponse.redirect(new URL("/auth/login", req.url));
        res.cookies.set("token", "", { maxAge: 0 });
        return res;
      }

      return NextResponse.next();
    } catch (err) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  // Handle protected routes like /dashboard
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  return NextResponse.next();
}

// Match all relevant protected routes
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
