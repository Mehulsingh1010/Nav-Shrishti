/* eslint-disable @typescript-eslint/no-explicit-any */
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
    
    // Log the received data to help with debugging
    console.log("Received data:", data)
    
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

    // Create an update object with only the fields that are provided
    const updateData: any = {
      firstName,
      surname,
      mobile,
      email,
      addressLine1,
      city,
      state,
      pincode,
      updatedAt: new Date(),
    }

    // Only add optional fields if they exist in the request
    if (dob !== undefined) {
      // Ensure dob is in the correct format for a date field
      updateData.dob = dob ? new Date(dob) : null
    }
    
    if (fatherName !== undefined) updateData.fatherName = fatherName
    if (addressLine2 !== undefined) updateData.addressLine2 = addressLine2
    if (landmark !== undefined) updateData.landmark = landmark

    // Update user details
    await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, Number(token)))

    return NextResponse.json(
      {
        success: true,
        user: {
          ...updateData,
          // Format date back to string for response
          dob: updateData.dob instanceof Date ? updateData.dob.toISOString().split('T')[0] : updateData.dob
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error updating personal info:", error)
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}