import { NextResponse } from "next/server"

// Access the same in-memory OTP store
// In a production app, this would be Redis or a database
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-expect-error
const otpStore: Record<string, { otp: string; expires: number }> = globalThis.otpStore || {}
// @ts-expect-error
if (!globalThis.otpStore) globalThis.otpStore = otpStore

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json()

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 })
    }

    // Check if OTP exists and is valid
    const storedOTPData = otpStore[email]

    if (!storedOTPData) {
      return NextResponse.json({ error: "No OTP found for this email. Please request a new one." }, { status: 400 })
    }

    // Check if OTP has expired
    if (Date.now() > storedOTPData.expires) {
      // Remove expired OTP
      delete otpStore[email]
      return NextResponse.json({ error: "OTP has expired. Please request a new one." }, { status: 400 })
    }

    // Verify OTP
    if (storedOTPData.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP. Please try again." }, { status: 400 })
    }

    // OTP is valid - don't delete it yet as we'll need it for the password reset step
    return NextResponse.json({ message: "OTP verified successfully" }, { status: 200 })
  } catch (error) {
    console.error("Verify OTP error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
