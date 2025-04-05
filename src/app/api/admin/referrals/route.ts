import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { db } from "../../../../../configs/db"
import { users, referrals } from "../../../../../configs/schema"
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

    // Pagination params
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1", 10)
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10)
    const offset = (page - 1) * limit

    // Get all referrals with pagination
    const allReferrals = await db.select().from(referrals).limit(limit).offset(offset)

    // Get total count safely
    const countResult = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(referrals)

    const totalReferrals = Number(countResult[0]?.count || 0)

    // Fetch user details for each referral
    const referralsWithUsers = await Promise.all(
      allReferrals.map(async (referral) => {
        const referrer = await db
          .select({
            id: users.id,
            referenceId: users.referenceId,
            firstName: users.firstName,
            surname: users.surname,
            email: users.email,
            promotionalRank: users.promotionalRank,
            totalNetworkSales: users.totalNetworkSales,
          })
          .from(users)
          .where(eq(users.id, referral.referrerId))

        const referred = await db
          .select({
            id: users.id,
            referenceId: users.referenceId,
            firstName: users.firstName,
            surname: users.surname,
            email: users.email,
          })
          .from(users)
          .where(eq(users.id, referral.referredId))

        return {
          ...referral,
          referrer: referrer[0] || null,
          referred: referred[0] || null,
        }
      })
    )

    return NextResponse.json({
      referrals: referralsWithUsers,
      pagination: {
        total: totalReferrals,
        page,
        limit,
        pages: Math.ceil(totalReferrals / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching referrals:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
