import { NextResponse } from "next/server"
import { z } from "zod"
import { hash } from "bcrypt"
import { db } from "../../../../../configs/db"
import { users, referrals } from "../../../../../configs/schema"
import { eq } from "drizzle-orm"
import { cookies } from "next/headers"

// Schema for validation
const registerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  firstName: z.string().min(1, "First name is required"),
  surname: z.string().min(1, "Surname is required"),
  mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  addressLine1: z.string().min(1, "Address line 1 is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().min(6, "Pincode must be 6 digits"),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
  // Fixed: Make referral code truly optional by allowing it to be undefined, null, or a string
  // If it's a string, it should be 6 characters long
  referralCode: z
    .union([
      z.string().length(6, "Referral code must be 6 characters"),
      z
        .string()
        .max(0), // Allow empty string
      z.null(),
      z.undefined(),
    ])
    .optional(),
})

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json()

    // Log the incoming request body for debugging
    console.log("Registration request body:", body)

    // Validate request data
    const validatedData = registerSchema.parse(body)

    // Check if user already exists with the email
    const existingUser = await db.select({ id: users.id }).from(users).where(eq(users.email, validatedData.email))

    if (existingUser.length > 0) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Verify referral code if provided
    let referrerExists = false
    let referrerId = null

    // Only check referral if it's provided and not empty
    if (validatedData.referralCode && validatedData.referralCode.trim() !== "") {
      const referrer = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.referenceId, validatedData.referralCode))

      referrerExists = referrer.length > 0

      if (!referrerExists) {
        return NextResponse.json({ error: "Invalid referral code" }, { status: 400 })
      }

      referrerId = referrer[0].id
    }

    // Hash password
    const hashedPassword = await hash(validatedData.password, 10)

    // Generate a random 6-digit reference ID
    const referenceId = Math.floor(100000 + Math.random() * 900000).toString()

    // Create new user
    const newUser = await db
      .insert(users)
      .values({
        referenceId,
        title: validatedData.title,
        firstName: validatedData.firstName,
        surname: validatedData.surname,
        mobile: validatedData.mobile,
        email: validatedData.email,
        password: hashedPassword,
        addressLine1: validatedData.addressLine1,
        addressLine2: validatedData.addressLine2 || null, // Handle optional field
        city: validatedData.city,
        state: validatedData.state,
        pincode: validatedData.pincode,
        termsAccepted: validatedData.termsAccepted,
        // Only store non-empty referral codes
        referredBy:
          validatedData.referralCode && validatedData.referralCode.trim() !== "" ? validatedData.referralCode : null,
        createdAt: new Date(),
        updatedAt: new Date(),
        role: "user", // Set default role to "user"
      })
      .returning({ id: users.id, referenceId: users.referenceId })

    console.log("User created:", newUser[0])

    // If user was referred, create a referral record
    if (validatedData.referralCode && validatedData.referralCode.trim() !== "" && referrerExists && referrerId) {
      // Create referral record
      await db
        .insert(referrals)
        .values({
          referrerId: referrerId,
          referredId: newUser[0].id,
          status: "active",
          earnings: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning({ id: referrals.id })

      console.log(`Referral record created for user ${newUser[0].id} referred by ${referrerId}`)
    }

    // Set authentication token (auto-login)
    // Make sure to convert the ID to a string
    const cookieStore = await cookies()
    cookieStore.set("token", String(newUser[0].id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })

    return NextResponse.json({
      message: "User registered successfully",
      referenceId: newUser[0].referenceId,
      role: "user", // Default role
    })
  } catch (error) {
    console.error("Registration error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

