import { NextResponse } from "next/server"
import { db } from "../../../../../configs/db"
import { products } from "../../../../../configs/schema"
import { eq } from "drizzle-orm"
import { put } from "@vercel/blob"
import { cookies } from "next/headers"

export async function GET(request, { params }) {
  try {
    console.log("Fetching product with ID:", params.productId)

    // Find the product by productId
    const product = await db.query.products.findFirst({
      where: eq(products.productId, params.productId),
    })

    console.log("Product found:", product)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: `Failed to fetch product: ${error.message}` }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const token = (await cookies()).get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const sellerId = Number.parseInt(token)

    // Handle form data for file uploads
    const formData = await request.formData()
    const name = formData.get("name")
    const description = formData.get("description")
    const category = formData.get("category")
    const price = formData.get("price")
    const availableUnits = formData.get("availableUnits")
    const photoFile = formData.get("photoFile")
    const photoUrl = formData.get("photoUrl")

    // Find the product to update
    const existingProduct = await db.query.products.findFirst({
      where: eq(products.productId, params.productId),
    })

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    if (existingProduct.sellerId !== sellerId) {
      return NextResponse.json({ error: "Unauthorized to update this product" }, { status: 403 })
    }

    // Handle image upload - either from file or URL
    let finalPhotoUrl = photoUrl

    if (photoFile && photoFile instanceof File) {
      // Upload the file to Vercel Blob
      const blob = await put(`products/${params.productId}/${photoFile.name}`, photoFile, {
        access: "public",
      })

      finalPhotoUrl = blob.url
    }

    const priceInPaise = Math.round(Number.parseFloat(price) * 100)
    const availableUnitsInt = Number.parseInt(availableUnits)

    const updatedProduct = await db
      .update(products)
      .set({
        name,
        description,
        category,
        price: priceInPaise,
        availableUnits: availableUnitsInt,
        status: availableUnitsInt > 0 ? "available" : "sold_out",
        photoUrl: finalPhotoUrl,
      })
      .where(eq(products.productId, params.productId))
      .returning()

    return NextResponse.json(updatedProduct[0])
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: `Failed to update product: ${error.message}` }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const token = (await cookies()).get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const sellerId = Number.parseInt(token)

    // Find the product to delete
    const existingProduct = await db.query.products.findFirst({
      where: eq(products.productId, params.productId),
    })

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    if (existingProduct.sellerId !== sellerId) {
      return NextResponse.json({ error: "Unauthorized to delete this product" }, { status: 403 })
    }

    await db.delete(products).where(eq(products.productId, params.productId))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: `Failed to delete product: ${error.message}` }, { status: 500 })
  }
}

