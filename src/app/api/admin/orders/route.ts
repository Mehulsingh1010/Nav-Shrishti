import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { db } from "../../../../../configs/db"
import { users, orders, orderItems, products, payments } from "../../../../../configs/schema"
import { eq, desc, sql } from "drizzle-orm"

export async function GET(request: Request) {
  try {
    // Get the token cookie
    const cookieStore = cookies()
    const tokenCookie = (await cookieStore).get("token")

    if (!tokenCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user ID from token
    const userId = Number.parseInt(tokenCookie.value, 10)

    // Verify the user exists and is an admin
    const adminUser = await db.select().from(users).where(eq(users.id, userId))

    if (adminUser.length === 0 || adminUser[0].role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get pagination parameters
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1", 10)
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10)
    const offset = (page - 1) * limit

    // Get paginated orders
    const allOrders = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(limit)
      .offset(offset)

    // Get total order count using correct COUNT query
    const countResult = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(orders)
    
    const totalOrders = Number(countResult[0]?.count || 0)

    // Fetch full details for each order
    const ordersWithDetails = await Promise.all(
      allOrders.map(async (order) => {
        const items = await db
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, order.id))

        const itemsWithProducts = await Promise.all(
          items.map(async (item) => {
            const product = await db
              .select()
              .from(products)
              .where(eq(products.id, item.productId))
            return {
              ...item,
              product: product[0] || null,
            }
          })
        )

        const payment = await db
          .select()
          .from(payments)
          .where(eq(payments.orderId, order.id))

        const customer = await db
          .select({
            id: users.id,
            referenceId: users.referenceId,
            firstName: users.firstName,
            surname: users.surname,
            email: users.email,
            mobile: users.mobile,
          })
          .from(users)
          .where(eq(users.id, order.userId))

        return {
          ...order,
          items: itemsWithProducts,
          payment: payment[0] || null,
          customer: customer[0] || null,
        }
      })
    )

    return NextResponse.json({
      orders: ordersWithDetails,
      pagination: {
        total: totalOrders,
        page,
        limit,
        pages: Math.ceil(totalOrders / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
