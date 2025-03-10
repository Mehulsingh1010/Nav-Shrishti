/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verify } from "jsonwebtoken"

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    const isPublicPath = path === "/auth/login" || path === "/auth/register" || path === "/auth/forgot-password"
    const token = request.cookies.get("auth-token")?.value || ""

    if (isPublicPath && token) {
        try {
            verify(token, process.env.JWT_SECRET || "your-secret-key")
            return NextResponse.redirect(new URL("/dashboard", request.url))
        } catch (error) {
            return NextResponse.next()
        }
    }

    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL("/auth/login", request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/dashboard/:path*", "/profile/:path*", "/auth/login", "/auth/register", "/auth/forgot-password"],
}
