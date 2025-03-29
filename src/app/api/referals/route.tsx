/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { db } from "../../../../configs/db";
import { users } from "../../../../configs/schema";
import { eq, sql } from "drizzle-orm";
import { cookies } from "next/headers";

// Commission rates by degree (index 0 = 1st degree, etc.)
const COMMISSION_RATES = [0.07, 0.05, 0.03, 0.01, 0.01, 0.01];

export async function GET() {
  try {
    // Get the token (user ID) from cookies
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = Number(token);

    // Get user's reference ID
    const user = await db
      .select({ referenceId: users.referenceId })
      .from(users)
      .where(eq(users.id, userId));

    if (user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const referralCode = String(user[0].referenceId);

    // Get direct referrals (1st degree)
    const directReferrals = await db.execute(sql`
      SELECT 
        r.id,
        CONCAT(u.first_name, ' ', u.surname) as name,
        r.created_at as date,
        r.status,
        r.earnings,
        u.reference_id as reference_id,
        1 as degree
      FROM 
        referrals r
      JOIN 
        users u ON r.referred_id = u.id
      WHERE 
        r.referrer_id = ${userId}
      ORDER BY 
        r.created_at DESC
    `);

    let allReferrals = [...directReferrals.rows];
    let currentDegree = 1;
    let currentLevelReferrals = directReferrals.rows.map((r: any) => String(r.reference_id));

    // Fetch indirect referrals (up to 5 levels deep)
    while (currentDegree < 5 && currentLevelReferrals.length > 0) {
      currentDegree++;
      const placeholders = currentLevelReferrals.map(() => "?").join(",");
      const nextLevelQuery = `
        SELECT 
          r.id,
          CONCAT(u.first_name, ' ', u.surname) as name,
          r.created_at as date,
          r.status,
          r.earnings,
          u.reference_id as reference_id,
          ${currentDegree} as degree
        FROM 
          referrals r
        JOIN 
          users u ON r.referred_id = u.id
        JOIN
          users referrer ON r.referrer_id = referrer.id
        WHERE 
          referrer.reference_id::TEXT IN (${placeholders})
        ORDER BY 
          r.created_at DESC
      `;

      const nextLevelReferrals = await db.execute(
        sql.raw(nextLevelQuery.replace("?", currentLevelReferrals.map(id => `'${id}'`).join(",")))
      );

      if (nextLevelReferrals.rows.length > 0) {
        allReferrals = [...allReferrals, ...nextLevelReferrals.rows];
        currentLevelReferrals = nextLevelReferrals.rows.map((r: any) => String(r.reference_id));
      } else {
        break;
      }
    }

    // Fetch earnings by degree
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
    `);

    // Calculate statistics
    const totalReferrals = allReferrals.length;
    const activeReferrals = allReferrals.filter((r: any) => r.status === "active").length;
    const totalEarnings = earningsByDegree.rows.reduce((sum: number, row: any) => sum + Number(row.earnings || 0), 0);

    // Group referrals by degree
    const referralsByDegree: Record<number, any[]> = {};
    allReferrals.forEach((referral: any) => {
      const degree = referral.degree;
      if (!referralsByDegree[degree]) {
        referralsByDegree[degree] = [];
      }
      referralsByDegree[degree].push({
        id: referral.id,
        name: referral.name,
        date: referral.date,
        status: referral.status,
        earnings: Number(referral.earnings || 0),
        referenceId: referral.reference_id,
      });
    });

    // Format earnings for the dashboard
    const earningsSummary = earningsByDegree.rows.map((row: any) => ({
      degree: row.degree,
      earnings: Number(row.earnings || 0),
      percentage: COMMISSION_RATES[row.degree - 1] * 100,
    }));

    return NextResponse.json({
      referralCode,
      totalReferrals,
      activeReferrals,
      totalEarnings,
      referrals: allReferrals.map((r: any) => ({
        id: r.id,
        name: r.name,
        date: r.date,
        status: r.status,
        earnings: Number(r.earnings || 0),
        degree: r.degree,
      })),
      referralsByDegree,
      earningsSummary,
    });
  } catch (error) {
    console.error("Error fetching referrals:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}