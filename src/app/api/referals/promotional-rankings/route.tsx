/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "../../../../../configs/db";
import { users } from "../../../../../configs/schema";
import { eq, sql } from "drizzle-orm";

// Updated promotional rankings with 5 levels
const PROMOTIONAL_RANKINGS = [
  { level: 1, threshold: 0, monthlyBonus: 0 },
  { level: 2, threshold: 500000, monthlyBonus: 250000 }, // 5 lakh threshold, 2.5 lakh bonus
  { level: 3, threshold: 1500000, monthlyBonus: 750000 }, // 15 lakh threshold, 7.5 lakh bonus
  { level: 4, threshold: 3000000, monthlyBonus: 1500000 }, // 30 lakh threshold, 15 lakh bonus
  { level: 5, threshold: 5000000, monthlyBonus: 2500000 }, // 50 lakh threshold, 25 lakh bonus
]

export async function GET() {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = Number(token);

    const user = await db.select({
      id: users.id,
      promotionalRank: users.promotionalRank,
      totalNetworkSales: users.totalNetworkSales,
    })
    .from(users)
    .where(eq(users.id, userId));

    if (!user || user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const earningsByDegree = await db.execute(sql`
      WITH RECURSIVE referral_chain AS (
        SELECT referred_id, referrer_id, 1 as degree FROM referrals WHERE referrer_id = ${userId}
        UNION ALL
        SELECT r.referred_id, r.referrer_id, rc.degree + 1
        FROM referrals r
        JOIN referral_chain rc ON r.referrer_id = rc.referred_id
        WHERE rc.degree < 5
      )
      SELECT rc.degree, SUM(
        CASE WHEN rc.degree = 1 THEN o.total_amount * 0.07
        WHEN rc.degree = 2 THEN o.total_amount * 0.05
        WHEN rc.degree = 3 THEN o.total_amount * 0.03
        ELSE o.total_amount * 0.01 END
      ) as earnings
      FROM referral_chain rc
      JOIN orders o ON o.user_id = rc.referred_id
      WHERE o.status = 'completed'
      GROUP BY rc.degree
    `);

    const totalEarnings = earningsByDegree.rows.reduce((sum: number, row: any) => sum + Number(row.earnings || 0), 0);

    let totalNetworkSales = user[0].totalNetworkSales || 0;
    if (totalEarnings > totalNetworkSales) {
      totalNetworkSales = totalEarnings;
      await db.update(users)
        .set({ totalNetworkSales: totalEarnings, updatedAt: new Date() })
        .where(eq(users.id, userId));
    }

    let currentRank = user[0].promotionalRank || 1;
    let newRank = currentRank;

    for (const ranking of PROMOTIONAL_RANKINGS) {
      if (totalNetworkSales >= ranking.threshold) {
        newRank = ranking.level;
      }
    }

    if (newRank !== currentRank) {
      await db.update(users)
        .set({ promotionalRank: newRank, updatedAt: new Date() })
        .where(eq(users.id, userId));
      currentRank = newRank;
    }

    const currentRankDetails = PROMOTIONAL_RANKINGS.find((r) => r.level === currentRank);
    const nextRankDetails = PROMOTIONAL_RANKINGS.find((r) => r.level === currentRank + 1);

    let progressPercentage = 0;
    let remainingAmount = 0;

    if (nextRankDetails) {
      remainingAmount = Math.max(0, nextRankDetails.threshold - totalNetworkSales);
      const totalNeeded = nextRankDetails.threshold - (currentRankDetails?.threshold || 0);
      const achieved = totalNetworkSales - (currentRankDetails?.threshold || 0);
      progressPercentage = Math.min(100, (achieved / totalNeeded) * 100);
    } else {
      progressPercentage = 100;
    }

    return NextResponse.json({
      currentRank,
      totalNetworkSales,
      monthlyBonus: currentRankDetails?.monthlyBonus || 0,
      nextRankThreshold: nextRankDetails?.threshold || null,
      remainingAmount,
      progressPercentage,
      allRanks: PROMOTIONAL_RANKINGS,
    });
  } catch (error) {
    console.error("Error fetching promotional ranking:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}