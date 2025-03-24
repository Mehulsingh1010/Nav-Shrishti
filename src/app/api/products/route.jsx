/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import { db } from "../../../../configs/db";
import { products } from "../../../../configs/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { put } from '@vercel/blob';

// GET all products for the current seller
export async function GET(req) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sellerId = Number.parseInt(token);

    const sellerProducts = await db.query.products.findMany({
      where: eq(products.sellerId, sellerId),
      with: {
        reviews: true,
      },
    });

    return NextResponse.json(sellerProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST a new product
export async function POST(req) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sellerId = Number.parseInt(token);
    
    // Handle form data for file uploads
    const formData = await req.formData();
    const name = formData.get('name');
    const description = formData.get('description');
    const category = formData.get('category');
    const price = formData.get('price');
    const availableUnits = formData.get('availableUnits');
    const photoFile = formData.get('photoFile');
    const photoUrl = formData.get('photoUrl');
    
    const productId = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    const priceInPaise = Math.round(Number.parseFloat(price) * 100);
    
    // Handle image upload - either from file or URL
    let finalPhotoUrl = photoUrl;
    
    if (photoFile && photoFile instanceof File) {
      // Upload the file to Vercel Blob
      const blob = await put(`products/${productId}/${photoFile.name}`, photoFile, {
        access: 'public',
      });
      
      finalPhotoUrl = blob.url;
    }

    const newProduct = await db
      .insert(products)
      .values({
        productId,
        sellerId,
        name,
        description,
        category,
        price: priceInPaise,
        availableUnits: Number.parseInt(availableUnits),
        status: Number.parseInt(availableUnits) > 0 ? "available" : "sold_out",
        photoUrl: finalPhotoUrl,
      })
      .returning();

    return NextResponse.json(newProduct[0]);
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
