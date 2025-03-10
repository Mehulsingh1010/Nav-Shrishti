import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "../../../../../configs/db"
import { randomBytes } from "crypto"

// Schema for validation
const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json()

    // Validate request data
    const validatedData = forgotPasswordSchema.parse(body)

    // Find user by email
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, validatedData.email),
    })

    // If user exists, generate a reset token
    if (user) {
      // Generate a random token
      const resetToken = randomBytes(32).toString("hex")

      // Store the token in the database with an expiry time
      // This would typically be done in a separate table
      // For now, we'll just log it
      console.log(`Reset token for ${user.email}: ${resetToken}`)

      // In a real application, you would:
      // 1. Store the token in the database with an expiry time
      // 2. Send an email to the user with a link containing the token

      // For this example, we'll just return success
    }

    // Always return success, even if the email doesn't exist
    // This is for security reasons - we don't want to reveal if an email exists
    return NextResponse.json({
      message: "If an account with that email exists, a password reset link has been sent.",
    })
  } catch (error) {
    console.error("Forgot password error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

