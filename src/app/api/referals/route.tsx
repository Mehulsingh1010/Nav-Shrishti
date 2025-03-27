/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import { db } from "../../../../configs/db"
import { users } from "../../../../configs/schema"
import { eq, sql } from "drizzle-orm"
import { cookies } from "next/headers"

export async function GET() {
  try {
    // Get the token (user ID) from cookies
    const token = (await cookies()).get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Get user's reference ID
    const user = await db
      .select({ referenceId: users.referenceId })
      .from(users)
      .where(eq(users.id, Number(token)))

    if (user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const referralCode = user[0].referenceId

    // Get all referrals made by this user
    const referralsList = await db.execute(sql`
      SELECT 
        r.id,
        CONCAT(u.first_name, ' ', u.surname) as name,
        r.created_at as date,
        r.status,
        r.earnings
      FROM 
        referrals r
      JOIN 
        users u ON r.referred_id = u.id
      JOIN 
        users referrer ON r.referrer_id = referrer.id
      WHERE 
        referrer.id = ${Number(token)}
      ORDER BY 
        r.created_at DESC
    `)

    // Calculate statistics
    const totalReferrals = referralsList.rows.length
    const activeReferrals = referralsList.rows.filter((r: any) => r.status === "active").length
    const totalEarnings = referralsList.rows.reduce((sum: number, r: any) => sum + Number(r.earnings), 0)

    return NextResponse.json({
      referralCode,
      totalReferrals,
      activeReferrals,
      totalEarnings,
      referrals: referralsList.rows.map((r: any) => ({
        id: r.id,
        name: r.name,
        date: r.date,
        status: r.status,
        earnings: Number(r.earnings),
      })),
    })
  } catch (error) {
    console.error("Error fetching referrals:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

