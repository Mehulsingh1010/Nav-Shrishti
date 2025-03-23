import { type NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../configs/db";
import { orders, orderItems, payments, users } from "../../../../../configs/schema";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import Razorpay from "razorpay";

// Initialize Razorpay with your key_id and key_secret
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    // Get user ID from token cookie (matching your login logic)
    const cookieStore = cookies();
    const tokenCookie = (await cookieStore).get("token");

    if (!tokenCookie) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Get the user ID from the token and fetch user details
    const userId = tokenCookie.value;
    const userResult = await db.select().from(users).where(eq(users.id, parseInt(userId, 10)));
    
    if (userResult.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }
    
    const user = userResult[0];

    // Parse the request body
    const body = await request.json().catch(() => ({}));
    const { productId, productName, price, quantity = 1 } = body;

    if (!productId || !price) {
      return NextResponse.json({ error: "Product ID and price are required" }, { status: 400 });
    }

    // Generate a unique order ID
    const orderId = `ORD${Math.floor(100000 + Math.random() * 900000)}`;

    // Create a Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: price * quantity, // amount in paise
      currency: "INR",
      receipt: orderId,
      notes: {
        productId,
        userId: user.id,
      },
    });

    // Create the order in your database
    const [newOrder] = await db
      .insert(orders)
      .values({
        orderId,
        userId: user.id,
        totalAmount: price * quantity,
        status: "pending",
        shippingAddress: {
          name: `${user.firstName || ''} ${user.surname || ''}`.trim(),
          addressLine1: user.addressLine1 || '',
          addressLine2: user.addressLine2 || "",
          city: user.city || '',
          state: user.state || '',
          pincode: user.pincode || '',
        },
      })
      .returning();

    // Create order item
    await db.insert(orderItems).values({
      orderId: newOrder.id,
      productId: Number.parseInt(productId),
      quantity,
      pricePerUnit: price,
    });

    // Create payment record
    await db.insert(payments).values({
      orderId: newOrder.id,
      razorpayOrderId: razorpayOrder.id,
      amount: price * quantity,
      currency: "INR",
      status: "pending",
    });

    // Return the Razorpay order details
    return NextResponse.json({
      orderId: newOrder.id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
      productName,
      customerName: `${user.firstName || ''} ${user.surname || ''}`.trim(),
      customerEmail: user.email || '',
      customerPhone: user.mobile || '',
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ 
      error: "Failed to create order",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}