import { NextResponse } from "next/server"
import { db } from "../../../../../configs/db"
import { nomineeDetails } from "../../../../../configs/schema"
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
    const { name, relation, dob, mobile, address } = data

    if (!name || !relation) {
      return NextResponse.json({ error: "Name and relation are required" }, { status: 400 })
    }

    // Check if nominee already exists
    const existingNominee = await db
      .select()
      .from(nomineeDetails)
      .where(eq(nomineeDetails.userId, Number(token)))

    if (existingNominee.length > 0) {
      // Update existing nominee
      await db
        .update(nomineeDetails)
        .set({
          name,
          relation,
          dob,
          mobile,
          address,
          updatedAt: new Date(),
        })
        .where(eq(nomineeDetails.userId, Number(token)))
    } else {
      // Insert new nominee
      await db.insert(nomineeDetails).values({
        userId: Number(token),
        name,
        relation,
        dob,
        mobile,
        address,
      })
    }

    return NextResponse.json(
      {
        success: true,
        nominee: {
          name,
          relation,
          dob,
          mobile,
          address,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error updating nominee:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

