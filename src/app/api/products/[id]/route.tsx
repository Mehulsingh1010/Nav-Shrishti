import { type NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../configs/db";
import { products } from "../../../../../configs/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

// GET a specific product
export async function GET(req: NextRequest, { params }: { params?: { [key: string]: string | string[] | undefined } }) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const productId = Number.parseInt(Array.isArray(params?.id) ? params.id[0] : params?.id ?? "");

    const product = await db.query.products.findFirst({
      where: eq(products.id, productId),
      with: {
        reviews: {
          with: {
            user: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}





// DELETE a product
export async function DELETE(req: NextRequest, { params }: { params?: { [key: string]: string | string[] | undefined } }) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sellerId = Number.parseInt(token);
    const productId = Number.parseInt(Array.isArray(params?.id) ? params.id[0] : params?.id ?? "");

    const existingProduct = await db.query.products.findFirst({
      where: eq(products.id, productId),
    });

    if (!existingProduct || existingProduct.sellerId !== sellerId) {
      return NextResponse.json({ error: "Product not found or unauthorized" }, { status: 404 });
    }

    await db.delete(products).where(eq(products.id, productId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
