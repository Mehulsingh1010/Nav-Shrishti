import { NextResponse } from "next/server"
import { z } from "zod"
import { hash } from "bcrypt"
import { db } from "../../../../../configs/db"
import { users } from "../../../../../configs/schema"
import { eq } from "drizzle-orm"
import { sql } from "drizzle-orm"

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
  referralCode: z.string().length(6).optional(), // Optional referral code
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
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, validatedData.email))
    
    if (existingUser.length > 0) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Verify referral code if provided
    let referrerExists = false
    if (validatedData.referralCode) {
      const referrer = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.referenceId, validatedData.referralCode))
      
      referrerExists = referrer.length > 0
      
      if (!referrerExists) {
        return NextResponse.json({ error: "Invalid referral code" }, { status: 400 })
      }
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
        referredBy: validatedData.referralCode || null, // Store referral code if provided
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({ id: users.id, referenceId: users.referenceId })

    console.log("User created:", newUser[0])

    // If user was referred, create a referral record
    if (validatedData.referralCode && referrerExists) {
      // Get referrer's ID
      const referrer = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.referenceId, validatedData.referralCode))
      
      if (referrer.length > 0) {
        // Create referral record
        await db.execute(sql`
          INSERT INTO referrals (referrer_id, referred_id, status, earnings, created_at, updated_at)
          VALUES (${referrer[0].id}, ${newUser[0].id}, 'active', 0, NOW(), NOW())
        `)
      }
    }

    return NextResponse.json({
      message: "User registered successfully",
      referenceId: newUser[0].referenceId,
    })
  } catch (error) {
    console.error("Registration error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
