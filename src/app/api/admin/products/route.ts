import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { db } from "../../../../../configs/db"
import { users, products } from "../../../../../configs/schema"
import { eq, sql } from "drizzle-orm"

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

    // Get pagination params
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1", 10)
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10)
    const offset = (page - 1) * limit

    // Get products
    const allProducts = await db
      .select()
      .from(products)
      .limit(limit)
      .offset(offset)

    // Get total count
    const countResult = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(products)

    const totalProducts = Number(countResult[0]?.count || 0)

    // Fetch seller info for each product
    const productsWithSellers = await Promise.all(
      allProducts.map(async (product) => {
        const seller = await db
          .select({
            id: users.id,
            referenceId: users.referenceId,
            firstName: users.firstName,
            surname: users.surname,
            email: users.email,
          })
          .from(users)
          .where(eq(users.id, product.sellerId))

        return {
          ...product,
          seller: seller[0] || null,
        }
      })
    )

    return NextResponse.json({
      products: productsWithSellers,
      pagination: {
        total: totalProducts,
        page,
        limit,
        pages: Math.ceil(totalProducts / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
