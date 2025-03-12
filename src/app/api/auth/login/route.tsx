/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server"
import { z } from "zod"
import { compare } from "bcrypt"
import { db } from "../../../../../configs/db"
import { cookies } from "next/headers"
import { sign } from "jsonwebtoken"
import postgres from "postgres"
// Schema for validation
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json()

    // Validate request data
    const validatedData = loginSchema.parse(body)

    // Find user by email
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, validatedData.email),
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Verify password
    const passwordMatch = await compare(validatedData.password, user.password)

    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Create JWT token
    const token = sign(
      {
        id: user.id,
        email: user.email,
        referenceId: user.referenceId,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" },
    )

    // Set cookie
    ;(await
          // Set cookie
          cookies()).set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        referenceId: user.referenceId,
        name: `${user.firstName} ${user.surname}`,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Login error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

