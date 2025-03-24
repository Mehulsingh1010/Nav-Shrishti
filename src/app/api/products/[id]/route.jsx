import { NextResponse } from "next/server"
import { db } from "../../../../../configs/db"
import { products, orderItems } from "../../../../../configs/schema"
import { eq } from "drizzle-orm"
import { put } from "@vercel/blob"
import { cookies } from "next/headers"

export async function GET(request, { params }) {
  try {
    console.log("Fetching product with productId (string):", params.productId)

    // First, find the product by its string productId
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
    console.log("Updating product with productId (string):", params.productId)

    // First, find the product by its string productId to get the numeric id
    const existingProduct = await db.query.products.findFirst({
      where: eq(products.productId, params.productId),
    })

    console.log("Product found for update:", existingProduct)

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    if (existingProduct.sellerId !== sellerId) {
      return NextResponse.json({ error: "Unauthorized to update this product" }, { status: 403 })
    }

    // Handle form data for file uploads
    const formData = await request.formData()
    const name = formData.get("name")
    const description = formData.get("description")
    const category = formData.get("category")
    const price = formData.get("price")
    const availableUnits = formData.get("availableUnits")
    const photoFile = formData.get("photoFile")
    const photoUrl = formData.get("photoUrl")

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

    // Use the numeric id for the update operation
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
      .where(eq(products.id, existingProduct.id)) // Use numeric id here
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
    console.log("Deleting product with productId (string):", params.productId)

    // First, find the product by its string productId to get the numeric id
    const existingProduct = await db.query.products.findFirst({
      where: eq(products.productId, params.productId),
    })

    console.log("Product found for deletion:", existingProduct)

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    if (existingProduct.sellerId !== sellerId) {
      return NextResponse.json({ error: "Unauthorized to delete this product" }, { status: 403 })
    }

    // Check if there are any order items referencing this product using the numeric id
    const relatedOrderItems = await db.query.orderItems.findMany({
      where: eq(orderItems.productId, existingProduct.id), // Use numeric id here
    })

    console.log(`Found ${relatedOrderItems.length} related order items`)

    if (relatedOrderItems.length > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete product because it has associated orders. Make sure no orders are in pending state.",
          hasOrders: true,
        },
        { status: 409 },
      )
    }

    // Use the numeric id for the delete operation
    await db.delete(products).where(eq(products.id, existingProduct.id)) // Use numeric id here

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting product:", error)

    // Check if it's a foreign key constraint error
    if (error.message && error.message.includes("foreign key constraint")) {
      return NextResponse.json(
        {
          error: "Cannot delete product because it has associated orders. Make sure no orders are in pending state.",
          constraintError: true,
        },
        { status: 409 },
      )
    }

    return NextResponse.json({ error: `Failed to delete product: ${error.message}` }, { status: 500 })
  }
}

