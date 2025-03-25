import { NextResponse } from "next/server"
import { db } from "../../../../../configs/db"
import { users } from "../../../../../configs/schema"
import { eq } from "drizzle-orm"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    // Get the token (user ID) from cookies
    const token = (await cookies()).get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const data = await request.json()
    const {
      firstName,
      surname,
      dob,
      fatherName,
      mobile,
      email,
      addressLine1,
      addressLine2,
      landmark,
      city,
      state,
      pincode,
    } = data

    if (!firstName || !surname || !email || !mobile) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 })
    }

    // Update user details
    await db
      .update(users)
      .set({
        firstName,
        surname,
        // dob,
        // fatherName,
        mobile,
        email,
        addressLine1,
        addressLine2,
        // landmark,
        city,
        state,
        pincode,
        updatedAt: new Date(),
      })
      .where(eq(users.id, Number(token)))

    return NextResponse.json(
      {
        success: true,
        user: {
          firstName,
          surname,
          dob,
          fatherName,
          mobile,
          email,
          addressLine1,
          addressLine2,
          landmark,
          city,
          state,
          pincode,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error updating personal info:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

