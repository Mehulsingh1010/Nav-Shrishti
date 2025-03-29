/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import { db } from "../../../../../configs/db"
import { users, referrals, orders } from "../../../../../configs/schema"
import { eq, and } from "drizzle-orm"

// Commission rates by degree (index 0 = 1st degree, etc.)
const COMMISSION_RATES = [0.07, 0.05, 0.03, 0.01, 0.01, 0.01]

// This function will be called when an order is completed
export async function POST(request: Request) {
  try {
    const { orderId } = await request.json()

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
    }

    // Get the order details
    const order = await db
      .select({
        id: orders.id,
        userId: orders.userId,
        totalAmount: orders.totalAmount,
        status: orders.status,
      })
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1)

    if (order.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Only process if order is completed
    if (order[0].status !== "completed") {
      return NextResponse.json({
        message: "Order is not completed, no commission processed",
      })
    }

    const purchaserUserId = order[0].userId
    const orderAmount = order[0].totalAmount

    // Find the referral chain for this user
    const referralChain = await findReferralChain(purchaserUserId)

    // Calculate and distribute commissions
    const commissionResults = await distributeCommissions(referralChain, orderAmount, orderId)

    return NextResponse.json({
      message: "Commissions processed successfully",
      commissions: commissionResults,
    })
  } catch (error) {
    console.error("Error processing commissions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Function to find the referral chain (upline) for a user
async function findReferralChain(userId: number) {
  const chain = []
  let currentUserId = userId
  let depth = 0

  // Maximum depth to prevent infinite loops and match our commission structure
  const MAX_DEPTH = 6

  while (depth < MAX_DEPTH) {
    // Find who referred this user
    const referrer = await db
      .select({
        id: users.id,
        referenceId: users.referenceId,
      })
      .from(users)
      .where(eq(users.id, currentUserId))
      .limit(1)

    if (referrer.length === 0 || !referrer[0].referenceId) {
      break
    }

    // Find the user with this reference ID
    const referrerUser = await db
      .select({
        id: users.id,
        referredBy: users.referredBy,
      })
      .from(users)
      .where(eq(users.id, currentUserId))
      .limit(1)

    if (referrerUser.length === 0 || !referrerUser[0].referredBy) {
      break
    }

    // Find the actual user who referred
    const uplineUser = await db
      .select({
        id: users.id,
      })
      .from(users)
      .where(eq(users.referenceId, referrerUser[0].referredBy))
      .limit(1)

    if (uplineUser.length === 0) {
      break
    }

    // Add to chain and continue up
    chain.push({
      userId: uplineUser[0].id,
      degree: depth + 1,
    })

    currentUserId = uplineUser[0].id
    depth++
  }

  return chain
}

// Function to calculate and distribute commissions
async function distributeCommissions(referralChain: any[], orderAmount: number, orderId: number) {
  const results = []

  for (const referrer of referralChain) {
    const { userId, degree } = referrer

    // Get commission rate based on degree
    const commissionRate =
      degree <= COMMISSION_RATES.length ? COMMISSION_RATES[degree - 1] : COMMISSION_RATES[COMMISSION_RATES.length - 1]

    // Calculate commission amount
    const commissionAmount = Math.floor(orderAmount * commissionRate)

    if (commissionAmount > 0) {
      // Find the referral record
      const referralRecord = await db
        .select({
          id: referrals.id,
          earnings: referrals.earnings,
        })
        .from(referrals)
        .where(and(eq(referrals.referrerId, userId), eq(referrals.status, "active")))
        .limit(1)

      if (referralRecord.length > 0) {
        // Update the earnings in the referral record
        const newEarnings = Number(referralRecord[0].earnings) + commissionAmount

        await db
          .update(referrals)
          .set({
            earnings: newEarnings,
            updatedAt: new Date(),
          })
          .where(eq(referrals.id, referralRecord[0].id))

        results.push({
          userId,
          degree,
          commissionRate,
          commissionAmount,
          newTotalEarnings: newEarnings,
        })
      }
    }
  }

  return results
}

