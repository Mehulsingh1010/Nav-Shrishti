/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { db } from "../../../../../configs/db"
import { users } from "../../../../../configs/schema"
import { eq, sql } from "drizzle-orm"

// Updated promotional rankings with 5 levels
const PROMOTIONAL_RANKINGS = [
  { level: 1, name: "Bronze", threshold: 0, monthlyBonus: 0 },
  { level: 2, name: "Silver", threshold: 1000000, monthlyBonus: 50000 },
  { level: 3, name: "Gold", threshold: 5000000, monthlyBonus: 250000 },
  { level: 4, name: "Platinum", threshold: 10000000, monthlyBonus: 500000 },
  { level: 5, name: "Diamond", threshold: 20000000, monthlyBonus: 1000000 },
]

export async function GET() {
  try {
    // Get the token (user ID) from cookies
    const token = (await cookies()).get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const userId = Number(token)

    // Get user's current promotional ranking
    const user = await db
      .select({
        id: users.id,
        promotionalRank: users.promotionalRank,
        totalNetworkSales: users.totalNetworkSales,
      })
      .from(users)
      .where(eq(users.id, userId))

    if (user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Fetch earnings by degree - using the same query as in the referrals API
    const earningsByDegree = await db.execute(sql`
      WITH RECURSIVE referral_chain AS (
        SELECT 
          referred_id,
          referrer_id,
          1 as degree
        FROM 
          referrals
        WHERE 
          referrer_id = ${userId}
        UNION ALL
        SELECT 
          r.referred_id,
          r.referrer_id,
          rc.degree + 1
        FROM 
          referrals r
        JOIN 
          referral_chain rc ON r.referrer_id = rc.referred_id
        WHERE 
          rc.degree < 5
      )
      SELECT 
        rc.degree,
        SUM(CASE 
          WHEN rc.degree = 1 THEN o.total_amount * 0.07
          WHEN rc.degree = 2 THEN o.total_amount * 0.05
          WHEN rc.degree = 3 THEN o.total_amount * 0.03
          ELSE o.total_amount * 0.01
        END) as earnings
      FROM 
        referral_chain rc
      JOIN 
        orders o ON o.user_id = rc.referred_id
      WHERE 
        o.status = 'completed'
      GROUP BY 
        rc.degree
      ORDER BY 
        rc.degree
    `)

    // Calculate total earnings the same way as in the referrals API
    const totalEarnings = earningsByDegree.rows.reduce((sum: number, row: any) => sum + Number(row.earnings || 0), 0)

    // Use the calculated total earnings as part of network sales if network sales is 0
    let totalNetworkSales = user[0].totalNetworkSales || 0
    if (totalNetworkSales === 0 && totalEarnings > 0) {
      totalNetworkSales = totalEarnings

      // Update the user's totalNetworkSales
      await db
        .update(users)
        .set({
          totalNetworkSales: totalEarnings,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId))
    }

    // Check if user qualifies for a rank upgrade
    let currentRank = user[0].promotionalRank || 1
    let newRank = currentRank

    for (const ranking of PROMOTIONAL_RANKINGS) {
      if (totalNetworkSales >= ranking.threshold && ranking.level > newRank) {
        newRank = ranking.level
      }
    }

    // Update user's rank if it has changed
    if (newRank !== currentRank) {
      await db
        .update(users)
        .set({
          promotionalRank: newRank,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId))

      currentRank = newRank
    }

    // Get ranking details
    const currentRankDetails = PROMOTIONAL_RANKINGS.find((r) => r.level === currentRank)
    const nextRankDetails = PROMOTIONAL_RANKINGS.find((r) => r.level === currentRank + 1)

    // Calculate progress to next rank
    let progressPercentage = 0
    let remainingAmount = 0

    if (nextRankDetails) {
      remainingAmount = Math.max(0, nextRankDetails.threshold - totalNetworkSales)
      if (currentRankDetails && nextRankDetails.threshold > currentRankDetails.threshold) {
        const totalNeeded = nextRankDetails.threshold - currentRankDetails.threshold
        const achieved = totalNetworkSales - currentRankDetails.threshold
        progressPercentage = Math.min(100, Math.max(0, (achieved / totalNeeded) * 100))
      }
    } else {
      // Already at highest rank
      progressPercentage = 100
    }

    return NextResponse.json({
      currentRank,
      totalNetworkSales,
      monthlyBonus: currentRankDetails?.monthlyBonus || 0,
      nextRankThreshold: nextRankDetails?.threshold || null,
      remainingAmount,
      progressPercentage,
      allRanks: PROMOTIONAL_RANKINGS,
    })
  } catch (error) {
    console.error("Error fetching promotional ranking:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

