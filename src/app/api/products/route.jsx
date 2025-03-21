/* eslint-disable @typescript-eslint/no-unused-vars */
import {  NextResponse } from "next/server";
import { db } from "../../../../configs/db";
import { products } from "../../../../configs/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

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
    const data = await req.json();

    const productId = Math.floor(Math.random() * 1000000); // Replace with a proper ID generator

    const priceInPaise = Math.round(Number.parseFloat(data.price) * 100);

    const newProduct = await db
      .insert(products)
      .values({
        productId: productId.toString(),
        sellerId,
        name: data.name,
        description: data.description,
        category: data.category,
        price: priceInPaise,
        availableUnits: Number.parseInt(data.availableUnits),
        status: Number.parseInt(data.availableUnits) > 0 ? "available" : "sold_out",
        photoUrl: data.photoUrl,
      })
      .returning();

    return NextResponse.json(newProduct[0]);
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
