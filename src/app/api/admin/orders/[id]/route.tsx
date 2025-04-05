/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { db } from "../../../../../../configs/db"
import { users, orders, orderItems, products, payments } from "../../../../../../configs/schema"
import { eq } from "drizzle-orm"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Get the token cookie
    const cookieStore = cookies()
    const tokenCookie = (await cookieStore).get("token")

    if (!tokenCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get admin user ID from token
    const adminId = Number.parseInt(tokenCookie.value, 10)

    // Verify the user exists and is an admin
    const adminUser = await db.select().from(users).where(eq(users.id, adminId))

    if (adminUser.length === 0 || adminUser[0].role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get order by ID
    const orderId = Number.parseInt(params.id, 10)
    const orderResult = await db.select().from(orders).where(eq(orders.id, orderId))

    if (orderResult.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const order = orderResult[0]

    // Get order items
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId))

    // Get product details for each item
    const itemsWithProducts = await Promise.all(
      items.map(async (item: { productId: any }) => {
        const product = await db.select().from(products).where(eq(products.id, item.productId))
        return {
          ...item,
          product: product[0] || null,
        }
      }),
    )

    // Get payment information
    const payment = await db.select().from(payments).where(eq(payments.orderId, orderId))

    // Get customer information
    const customer = await db
      .select({
        id: users.id,
        referenceId: users.referenceId,
        firstName: users.firstName,
        surname: users.surname,
        email: users.email,
        mobile: users.mobile,
        addressLine1: users.addressLine1,
        addressLine2: users.addressLine2,
        city: users.city,
        state: users.state,
        pincode: users.pincode,
      })
      .from(users)
      .where(eq(users.id, order.userId))

    const orderDetails = {
      ...order,
      items: itemsWithProducts,
      payment: payment[0] || null,
      customer: customer[0] || null,
    }

    return NextResponse.json(orderDetails)
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    // Get the token cookie
    const cookieStore = cookies()
    const tokenCookie = (await cookieStore).get("token")

    if (!tokenCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get admin user ID from token
    const adminId = Number.parseInt(tokenCookie.value, 10)

    // Verify the user exists and is an admin
    const adminUser = await db.select().from(users).where(eq(users.id, adminId))

    if (adminUser.length === 0 || adminUser[0].role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get order ID from params
    const orderId = Number.parseInt(params.id, 10)

    // Get update data from request body
    const data = await request.json()

    // Only allow updating specific fields
    const allowedFields = ["status"]
    const updateData: Record<string, any> = {}

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updateData[field] = data[field]
      }
    }

    // Update order
    await db
      .update(orders)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId))

    // Get updated order
    const updatedOrder = await db.select().from(orders).where(eq(orders.id, orderId))

    if (updatedOrder.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json(updatedOrder[0])
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

