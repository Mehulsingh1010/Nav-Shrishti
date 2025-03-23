import { type NextRequest, NextResponse } from "next/server"
import { db } from "../../../../../configs/db"
import { orders, payments, products} from "../../../../../configs/schema"
import { eq } from "drizzle-orm"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json()

    // Verify the payment signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`
    const generatedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!).update(text).digest("hex")

    const isAuthentic = generatedSignature === razorpay_signature

    if (!isAuthentic) {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 })
    }

    // Find the payment record
    const payment = await db.query.payments.findFirst({
      where: eq(payments.razorpayOrderId, razorpay_order_id),
    })

    if (!payment) {
      return NextResponse.json({ error: "Payment record not found" }, { status: 404 })
    }

    // Update payment status
    await db
      .update(payments)
      .set({
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: "captured",
        updatedAt: new Date(),
        paymentMethod: "razorpay",
        paymentDetails: { payment_id: razorpay_payment_id },
      })
      .where(eq(payments.razorpayOrderId, razorpay_order_id))

    // Update order status
    await db
      .update(orders)
      .set({
        status: "processing",
        updatedAt: new Date(),
      })
      .where(eq(orders.id, payment.orderId))

    // Get order items to update product inventory
    const orderItems = await db.query.orderItems.findMany({
      where: eq(payments.orderId, payment.orderId),
    })

    // Update product inventory
    for (const item of orderItems) {
      const product = await db.query.products.findFirst({
        where: eq(products.id, item.productId),
      })

      if (product) {
        const newAvailableUnits = product.availableUnits - item.quantity

        await db
          .update(products)
          .set({
            availableUnits: newAvailableUnits,
            status: newAvailableUnits <= 0 ? "sold_out" : "available",
            updatedAt: new Date(),
          })
          .where(eq(products.id, item.productId))
      }
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
    })
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 })
  }
}

