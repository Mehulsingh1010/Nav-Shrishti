import { NextResponse } from "next/server"
import { db } from "../../../../../configs/db"
import { users } from "../../../../../configs/schema"
import { eq } from "drizzle-orm"
import nodemailer from "nodemailer"

// In-memory OTP storage (in a production app, use Redis or a database)
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-expect-error
const otpStore: Record<string, { otp: string; expires: number }> = globalThis.otpStore || {}
// @ts-expect-error
if (!globalThis.otpStore) globalThis.otpStore = otpStore

// Generate a random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: Number.parseInt(process.env.EMAIL_PORT || "587"),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Check if user exists
    const existingUser = await db.select().from(users).where(eq(users.email, email))

    if (existingUser.length === 0) {
      return NextResponse.json({ error: "No account found with this email" }, { status: 404 })
    }

    const user = existingUser[0]

    // Generate OTP
    const otp = generateOTP()

    // Store OTP with expiration (15 minutes)
    otpStore[email] = {
      otp,
      expires: Date.now() + 15 * 60 * 1000,
    }

    // Send email with OTP
    const mailOptions = {
      from: process.env.EMAIL_FROM || "noreply@vaidikbharat.com",
      to: email,
      subject: "Password Reset OTP - वैदिक भारत",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="background-color: #c14d14; padding: 15px; text-align: center; border-radius: 5px 5px 0 0;">
            <h1 style="color: white; margin: 0;">वैदिक भारत</h1>
          </div>
          <div style="padding: 20px;">
            <p>Dear ${user.firstName},</p>
            <p>We received a request to reset your password. Please use the following One-Time Password (OTP) to complete the process:</p>
            <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
              ${otp}
            </div>
            <p>This OTP is valid for 15 minutes. If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
            <p>Regards,<br>वैदिक भारत Team</p>
          </div>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({ message: "OTP sent to your email" }, { status: 200 })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
