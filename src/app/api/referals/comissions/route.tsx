/* eslint-disable @typescript-eslint/no-explicit-any */
import { type NextRequest, NextResponse } from "next/server"
import { db } from "../../../../../configs/db"
import { referrals, users } from "../../../../../configs/schema"
import { eq, sql } from "drizzle-orm"

// Define promotional rankings with 5 levels
const PROMOTIONAL_RANKINGS = [
  { level: 1, threshold: 0, monthlyBonus: 0 },
  { level: 2, threshold: 1000000, monthlyBonus: 50000 },
  { level: 3, threshold: 5000000, monthlyBonus: 250000 },
  { level: 4, threshold: 10000000, monthlyBonus: 500000 },
  { level: 5, threshold: 20000000, monthlyBonus: 1000000 },
]

export async function POST(req: NextRequest) {
  try {
    const { userId, orderAmount } = await req.json()

    if (!userId || !orderAmount) {
      return NextResponse.json({ error: "Missing userId or orderAmount" }, { status: 400 })
    }

    // Find the user's referrer chain
    const referralChain = await getReferralChain(userId)

    // Update promotional rankings for all users in the chain
    await updatePromotionalRankings(referralChain, orderAmount)

    return NextResponse.json({ message: "Commission processed successfully" }, { status: 200 })
  } catch (error) {
    console.error("[COMMISSION_POST]", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}

// Function to get the referral chain
async function getReferralChain(userId: string) {
  const referralChain = []
  let currentUserId: string | null = userId
  let degree = 0

  while (currentUserId && degree < 5) {
    const referral: { referrerId: number | null }[] = await db
      .select({
        referrerId: referrals.referrerId,
      })
      .from(referrals)
      .where(eq(referrals.referredId, Number(currentUserId)))
      .limit(1)

    if (referral.length > 0 && referral[0].referrerId) {
      const referrerId = referral[0].referrerId
      referralChain.push({ userId: referrerId, degree: degree + 1 })
      currentUserId = referrerId.toString()
      degree++
    } else {
      currentUserId = null // End the chain
    }
  }

  return referralChain
}

// Function to update promotional rankings for all users in the chain
async function updatePromotionalRankings(referralChain: any[], orderAmount: number) {
  for (const referrer of referralChain) {
    const { userId } = referrer

    // Get current user data
    const userData = await db
      .select({
        totalNetworkSales: users.totalNetworkSales,
        promotionalRank: users.promotionalRank,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (userData.length === 0) continue

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

    // Update total network sales
    const currentNetworkSales = userData[0].totalNetworkSales || 0

    // If we have no network sales but have earnings, use earnings as the base
    let newNetworkSales = currentNetworkSales
    if (currentNetworkSales === 0 && totalEarnings > 0) {
      newNetworkSales = totalEarnings + orderAmount
    } else {
      newNetworkSales = currentNetworkSales + orderAmount
    }

    const currentRank = userData[0].promotionalRank || 1

    // Check if user qualifies for a rank upgrade
    let newRank = currentRank
    for (const ranking of PROMOTIONAL_RANKINGS) {
      if (newNetworkSales >= ranking.threshold && ranking.level > newRank) {
        newRank = ranking.level
      }
    }

    // Update user record
    await db
      .update(users)
      .set({
        totalNetworkSales: newNetworkSales,
        promotionalRank: newRank,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
  }
}

