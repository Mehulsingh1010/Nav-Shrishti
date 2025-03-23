import { NextResponse } from "next/server";
import { db } from "../../../../../../configs/db";
import { products } from "../../../../../../configs/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request, 
  { params }: { params: { productId: string } }
) {
  try {
    // Fix: Await the params object to properly access its properties
    const unwrappedParams = await params;
    const productId = unwrappedParams.productId;
    
    console.log("Original API route - Fetching product with ID:", productId);

    // Find the product by productId
    const product = await db.query.products.findFirst({
      where: eq(products.productId, productId),
    });
    
    console.log("Original API route - Product found:", product);
    
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: `Failed to fetch product: ${(error as Error).message}` }, 
      { status: 500 }
    );
  }
}