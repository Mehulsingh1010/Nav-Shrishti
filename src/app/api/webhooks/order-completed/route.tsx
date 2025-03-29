import { NextResponse } from "next/server"
import { db } from "../../../../../configs/db"
import { orders } from "../../../../../configs/schema"
import { eq } from "drizzle-orm"

// This webhook should be called when an order is marked as completed
export async function POST(request: Request) {
  try {
    const { orderId, secret } = await request.json()

    // Validate webhook secret (you should implement proper authentication)
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "your-webhook-secret"
    if (secret !== WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
    }

    // Verify the order exists and is completed
    const order = await db
      .select({
        id: orders.id,
        status: orders.status,
      })
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1)

    if (order.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    if (order[0].status !== "completed") {
      return NextResponse.json({
        message: "Order is not completed, skipping commission processing",
      })
    }

    // Process commissions by calling the commission API
    const commissionResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/referrals/commission`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderId }),
    })

    if (!commissionResponse.ok) {
      throw new Error("Failed to process commissions")
    }

    const commissionResult = await commissionResponse.json()

    return NextResponse.json({
      message: "Order completed and commissions processed",
      commissions: commissionResult,
    })
  } catch (error) {
    console.error("Error processing order completion:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

