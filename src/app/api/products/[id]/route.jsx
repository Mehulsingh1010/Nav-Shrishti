import { NextResponse } from "next/server"
import { db } from "../../../../../configs/db"
import { products, orderItems, productReviews} from "../../../../../configs/schema"
import { eq } from "drizzle-orm"
import { put } from "@vercel/blob"
import { cookies } from "next/headers"

export async function GET(request, { params }) {
  try {
    console.log("Fetching product with productId (string):", params.productId)

    // Find the product by its string productId
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

    // Find the product by its string productId to get the numeric id
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
    let finalPhotoUrl = existingProduct.photoUrl // Default to existing URL

    if (photoUrl && photoUrl !== existingProduct.photoUrl) {
      finalPhotoUrl = photoUrl
    } else if (photoFile && photoFile instanceof File && photoFile.size > 0) {
      // Upload the file to Vercel Blob
      const blob = await put(`products/${params.productId}/${photoFile.name}`, photoFile, {
        access: "public",
      })

      finalPhotoUrl = blob.url
    }

    const priceInPaise = Math.round(Number.parseFloat(price) * 100)
    const availableUnitsInt = Number.parseInt(availableUnits)
    const status = availableUnitsInt > 0 ? "available" : "sold_out"

    // Use the numeric id for the update operation
    const updatedProduct = await db
      .update(products)
      .set({
        name,
        description,
        category,
        price: priceInPaise,
        availableUnits: availableUnitsInt,
        status,
        photoUrl: finalPhotoUrl,
        updatedAt: new Date(), // Update the timestamp
      })
      .where(eq(products.id, existingProduct.id))
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

    // Find the product by its string productId to get the numeric id
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

    // Begin a transaction to handle related records and constraints
    try {
      await db.transaction(async (tx) => {
        // Check if there are any order items referencing this product
        const relatedOrderItems = await tx.query.orderItems.findMany({
          where: eq(orderItems.productId, existingProduct.id),
        })

        console.log(`Found ${relatedOrderItems.length} related order items`)

        if (relatedOrderItems.length > 0) {
          throw new Error(
            "Cannot delete product because it has associated orders. Consider marking it as sold out instead.",
          )
        }

        // Check if product has reviews
        const relatedReviews = await tx.query.productReviews.findMany({
          where: eq(productReviews.productId, existingProduct.id),
        })

        // Delete related reviews first (if any)
        if (relatedReviews.length > 0) {
          await tx.delete(productReviews).where(eq(productReviews.productId, existingProduct.id))
        }

        // Finally delete the product
        await tx.delete(products).where(eq(products.id, existingProduct.id))
      })

      return NextResponse.json({ success: true, message: "Product deleted successfully" })
    } catch (error) {
      // Handle specific transaction errors
      if (error.message.includes("associated orders")) {
        return NextResponse.json(
          {
            error: error.message,
            hasOrders: true,
            canMarkAsSoldOut: true,
          },
          { status: 409 },
        )
      }
      throw error // Re-throw other errors
    }
  } catch (error) {
    console.error("Error deleting product:", error)

    // Check if it's a foreign key constraint error
    if (error.message && error.message.includes("foreign key constraint")) {
      return NextResponse.json(
        {
          error: "Cannot delete product because it has associated orders. Consider marking it as sold out instead.",
          constraintError: true,
          canMarkAsSoldOut: true,
        },
        { status: 409 },
      )
    }

    return NextResponse.json({ error: `Failed to delete product: ${error.message}` }, { status: 500 })
  }
}

