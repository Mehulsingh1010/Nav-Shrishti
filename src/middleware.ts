import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verify } from "jsonwebtoken"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === "/auth/login" || path === "/auth/register" || path === "/auth/forgot-password"

  // Get the token from the cookies
  const token = request.cookies.get("auth-token")?.value || ""

  // If the path is public and the user is already logged in, redirect to dashboard
  if (isPublicPath && token) {
    try {
      // Verify the token
      verify(token, process.env.JWT_SECRET || "your-secret-key")

      // If token is valid, redirect to dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url))
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // If token verification fails, continue to the public path
      return NextResponse.next()
    }
  }

  // If the path requires authentication and the user is not logged in, redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  // For all other cases, continue with the request
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/auth/login", "/auth/register", "/auth/forgot-password"],
}

