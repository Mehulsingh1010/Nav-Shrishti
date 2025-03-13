import { NextResponse } from "next/server";
import { db } from "../../../../../configs/db";
import { users } from "../../../../../configs/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Validate email and password presence
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Find user by email
    const existingUser = await db.select().from(users).where(eq(users.email, email));

    if (existingUser.length === 0) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const user = existingUser[0];

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Set authentication token in cookies (simple session-based auth)
    (await
              // Set authentication token in cookies (simple session-based auth)
              cookies()).set("token", user.id.toString(), {
          httpOnly: true, // Prevent access from JavaScript
          secure: process.env.NODE_ENV === "production", // Secure in production
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 7, // 1 week
        });

    return NextResponse.json({ message: "Login successful", user }, { status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
