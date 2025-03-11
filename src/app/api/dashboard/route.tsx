import { NextResponse } from "next/server"
import db from "../../../../configs/db"
import { users, purchases, referrals, income, payments } from "../../../../configs/schema"
import { eq, count, sum } from "drizzle-orm"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Get user details
    const userDetails = await db.query.users.findFirst({
      where: eq(users.id, Number.parseInt(userId)),
    })

    if (!userDetails) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get purchase count
    const purchaseCount = await db
      .select({ count: count() })
      .from(purchases)
      .where(eq(purchases.userId, Number.parseInt(userId)))

    // Get total income
    const totalIncome = await db
      .select({ total: sum(income.amount) })
      .from(income)
      .where(eq(income.userId, Number.parseInt(userId)))

    // Get team count
    const teamCount = await db
      .select({ count: count() })
      .from(referrals)
      .where(eq(referrals.referrerId, Number.parseInt(userId)))

    // Get referral income
    const referralIncome = await db
      .select({ total: sum(income.amount) })
      .from(income)
      .where(eq(income.userId, Number.parseInt(userId)))
      .where(eq(income.type, "referral"))

    // Get salary income
    const salaryIncome = await db
      .select({ total: sum(income.amount) })
      .from(income)
      .where(eq(income.userId, Number.parseInt(userId)))
      .where(eq(income.type, "salary"))

    // Get promotional income
    const promotionalIncome = await db
      .select({ total: sum(income.amount) })
      .from(income)
      .where(eq(income.userId, Number.parseInt(userId)))
      .where(eq(income.type, "promotional"))

    // Get reward income
    const rewardIncome = await db
      .select({ total: sum(income.amount) })
      .from(income)
      .where(eq(income.userId, Number.parseInt(userId)))
      .where(eq(income.type, "reward"))

    // Get available balance
    const availableBalance = await db
      .select({ total: sum(payments.amount) })
      .from(payments)
      .where(eq(payments.userId, Number.parseInt(userId)))
      .where(eq(payments.status, "completed"))

    return NextResponse.json({
      user: {
        title: userDetails.title,
        firstName: userDetails.firstName,
        surname: userDetails.surname,
        referenceId: userDetails.referenceId,
      },
      stats: {
        purchaseCount: purchaseCount[0]?.count || 0,
        totalIncome: totalIncome[0]?.total || 0,
        teamCount: teamCount[0]?.count || 0,
        referralIncome: referralIncome[0]?.total || 0,
        salaryIncome: salaryIncome[0]?.total || 0,
        promotionalIncome: promotionalIncome[0]?.total || 0,
        rewardIncome: rewardIncome[0]?.total || 0,
        availableBalance: availableBalance[0]?.total || 0,
      },
      subscription: {
        daysRemaining: 23, // This would come from the subscription table in a real implementation
        isActive: true,
      },
    })
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}

