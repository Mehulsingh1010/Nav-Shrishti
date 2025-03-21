import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { db } from "../../../../../configs/db"
import { eq } from "drizzle-orm"
import { products } from "../../../../../configs/schema"

// PUT (update) a product
export async function PUT(req, { params }) {
  try {
    const token = (await cookies()).get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const sellerId = Number.parseInt(token)
    const productId = Number.parseInt(params.id)
    const data = await req.json()

    const existingProduct = await db.query.products.findFirst({
      where: eq(products.id, productId),
    })

    if (!existingProduct || existingProduct.sellerId !== sellerId) {
      return NextResponse.json({ error: "Product not found or unauthorized" }, { status: 404 })
    }

    const priceInPaise = Math.round(Number.parseFloat(data.price) * 100)

    const updatedProduct = await db
      .update(products)
      .set({
        name: data.name,
        description: data.description,
        category: data.category,
        price: priceInPaise,
        availableUnits: Number.parseInt(data.availableUnits),
        status: Number.parseInt(data.availableUnits) > 0 ? "available" : "sold_out",
        photoUrl: data.photoUrl,
        updatedAt: new Date(),
      })
      .where(eq(products.id, productId))
      .returning()

    return NextResponse.json(updatedProduct[0])
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

// DELETE a product
export async function DELETE(req, { params }) {
  try {
    const token = (await cookies()).get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const sellerId = Number.parseInt(token)
    const productId = Number.parseInt(params.id)

    // First check if the product exists and belongs to this seller
    const existingProduct = await db.query.products.findFirst({
      where: eq(products.id, productId),
    })

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    if (existingProduct.sellerId !== sellerId) {
      return NextResponse.json({ error: "Unauthorized to delete this product" }, { status: 403 })
    }

    // Delete the product
    const deletedProduct = await db
      .delete(products)
      .where(eq(products.id, productId))
      .returning()

    if (!deletedProduct || deletedProduct.length === 0) {
      return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
    }

    return NextResponse.json({ 
      message: "Product deleted successfully",
      product: deletedProduct[0]
    })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}