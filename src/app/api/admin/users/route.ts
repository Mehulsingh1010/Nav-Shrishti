import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { db } from "../../../../../configs/db"
import { users, bankDetails } from "../../../../../configs/schema"
import { eq, sql } from "drizzle-orm"

export async function GET(request: Request) {
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
    const adminUser = await db.select().from(users).where(eq(users.id, userId))

    if (adminUser.length === 0 || adminUser[0].role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get URL parameters for pagination
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1", 10)
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10)
    const offset = (page - 1) * limit

    // Fetch users with pagination
    const allUsers = await db
      .select()
      .from(users)
      .limit(limit)
      .offset(offset)

    // Count total users
    const countResult = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(users)

    const totalUsers = Number(countResult[0]?.count || 0)

    // Fetch bank details for each user
    const usersWithBankDetails = await Promise.all(
      allUsers.map(async (user) => {
        const bankInfo = await db
          .select()
          .from(bankDetails)
          .where(eq(bankDetails.userId, user.id))

        return {
          ...user,
          password: undefined, // remove password
          email: user.email.replace(/(.{2})(.*)(@.*)/, "$1***$3"), // mask email
          bankDetails: bankInfo.map((bank) => ({
            ...bank,
            accountNumber: bank.accountNumber.replace(/\d(?=\d{4})/g, "*"), // mask account number
          })),
        }
      })
    )

    return NextResponse.json({
      users: usersWithBankDetails,
      pagination: {
        total: totalUsers,
        page,
        limit,
        pages: Math.ceil(totalUsers / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
