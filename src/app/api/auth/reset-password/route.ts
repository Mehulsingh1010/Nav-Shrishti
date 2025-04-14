/* eslint-disable @typescript-eslint/ban-ts-comment */
import { NextResponse } from "next/server"
import { db } from "../../../../../configs/db"
import { users } from "../../../../../configs/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"

// reuse OTP store
// @ts-expect-error
const otpStore: Record<string, { otp: string; expires: number }> = globalThis.otpStore || {}
// @ts-expect-error
if (!globalThis.otpStore) globalThis.otpStore = otpStore

export async function POST(req: Request) {
  try {
    const { email, otp, newPassword } = await req.json()

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const record = otpStore[email]
    if (!record) {
      return NextResponse.json({ error: "No OTP found for this email. Please request a new one." }, { status: 400 })
    }

    if (record.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP. Please try again." }, { status: 400 })
    }

    if (Date.now() > record.expires) {
      delete otpStore[email]
      return NextResponse.json({ error: "OTP has expired. Please request a new one." }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    try {
      await db.update(users).set({ password: hashedPassword }).where(eq(users.email, email))
    } catch (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ error: "Failed to update password in database" }, { status: 500 })
    }

    // Delete OTP after successful password reset
    delete otpStore[email]

    return NextResponse.json({ message: "Password reset successful" }, { status: 200 })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
