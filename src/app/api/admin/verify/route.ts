import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { db } from "../../../../../configs/db"
import { users } from "../../../../../configs/schema"
import { eq } from "drizzle-orm"

export async function GET() {
  try {
    // Get the token cookie
    const cookieStore = cookies()
    const tokenCookie = (await cookieStore).get("token")

    if (!tokenCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user ID from token
    const userId = Number.parseInt(tokenCookie.value, 10)

    // Verify the user exists and is an admin
    const userResult = await db.select().from(users).where(eq(users.id, userId))

    if (userResult.length === 0 || userResult[0].role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userResult[0].id,
        referenceId: userResult[0].referenceId,
        firstName: userResult[0].firstName,
        surname: userResult[0].surname,
        email: userResult[0].email,
        role: userResult[0].role,
      },
    })
  } catch (error) {
    console.error("Admin verification error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

