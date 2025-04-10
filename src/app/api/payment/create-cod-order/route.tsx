/* eslint-disable @typescript-eslint/no-unused-vars */
import { type NextRequest, NextResponse } from "next/server"
import { db } from "../../../../../configs/db"
import { orders, orderItems, payments, users } from "../../../../../configs/schema"
import { cookies } from "next/headers"
import { eq } from "drizzle-orm"





export async function POST(request: NextRequest) {
  try {
    // Get user ID from token cookie (matching your login logic)
    const cookieStore = cookies()
    const tokenCookie = (await cookieStore).get("token")

    if (!tokenCookie) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Get the user ID from the token and fetch user details
    const userId = tokenCookie.value
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.id, Number.parseInt(userId, 10)))

    if (userResult.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 401 })
    }

    const user = userResult[0]

    // Parse the request body
    const body = await request.json().catch(() => ({}))
    const { productId, productName, price, quantity = 1, shippingDetails } = body

    if (!productId || !price) {
      return NextResponse.json({ error: "Product ID and price are required" }, { status: 400 })
    }

    // Generate a unique order ID
    const orderId = `COD${Math.floor(100000 + Math.random() * 900000)}`

    // Create the order in your database
    const [newOrder] = await db
      .insert(orders)
      .values({
        orderId,
        userId: user.id,
        totalAmount: price * quantity,
        status: "processing", // Set as processing since it's COD
        shippingAddress: {
          name: shippingDetails.name || `${user.firstName || ""} ${user.surname || ""}`.trim(),
          addressLine1: shippingDetails.addressLine1 || user.addressLine1 || "",
          addressLine2: shippingDetails.addressLine2 || user.addressLine2 || "",
          city: shippingDetails.city || user.city || "",
          state: shippingDetails.state || user.state || "",
          pincode: shippingDetails.pincode || user.pincode || "",
          mobile: shippingDetails.mobile || user.mobile || "",
          notes: shippingDetails.notes || "",
        },
      })
      .returning()

    // Create order item
    await db.insert(orderItems).values({
      orderId: newOrder.id,
      productId: Number.parseInt(productId),
      quantity,
      pricePerUnit: price,
    })

    // Create payment record for COD
    await db.insert(payments).values({
      orderId: newOrder.id,
      razorpayOrderId: orderId, // Use the same orderId as razorpayOrderId for COD
      amount: price * quantity,
      currency: "INR",
      status: "pending", // Payment is pending for COD
      paymentMethod: "cod", // Indicate this is a COD payment
      paymentDetails: {
        method: "cash_on_delivery",
        notes: shippingDetails.notes || "",
      },
    })

    // Return the order details
    return NextResponse.json({
      success: true,
      orderId: newOrder.id,
      message: "Cash on Delivery order created successfully",
    })
  } catch (error) {
    console.error("Error creating COD order:", error)
    return NextResponse.json(
      {
        error: "Failed to create order",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
