import { NextResponse } from "next/server"
import { db } from "../../../../../configs/db"
import { orders } from "../../../../../configs/schema"
import { eq } from "drizzle-orm"
import { cookies } from "next/headers"

// This endpoint will be called when an order is marked as completed
// It will update the order status and trigger the commission calculation
export async function POST(request: Request) {
  try {
    const { orderId } = await request.json()

    // Get the token (user ID) from cookies for authentication
    const token = (await cookies()).get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
    }

    // Update the order status to completed
    const updatedOrder = await db
      .update(orders)
      .set({
        status: "completed",
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId))
      .returning({
        id: orders.id,
        orderId: orders.orderId,
        userId: orders.userId,
        totalAmount: orders.totalAmount,
      })

    if (!updatedOrder || updatedOrder.length === 0) {
      return NextResponse.json({ error: "Order not found or could not be updated" }, { status: 404 })
    }

    // Process commissions by calling the commission API
    const commissionResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/referrals/commission`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderId: updatedOrder[0].id }),
    })

    if (!commissionResponse.ok) {
      console.error("Failed to process commissions:", await commissionResponse.text())
      return NextResponse.json({
        message: "Order marked as completed but failed to process commissions",
        order: updatedOrder[0],
      })
    }

    const commissionResult = await commissionResponse.json()

    return NextResponse.json({
      message: "Order completed and commissions processed successfully",
      order: updatedOrder[0],
      commissions: commissionResult,
    })
  } catch (error) {
    console.error("Error completing order:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

