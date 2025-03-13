import { NextResponse } from "next/server";
import { db } from "../../../../../configs/db";
import { users } from "../../../../../configs/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";


export async function GET() {
  try {
    // Get the token (user ID) from cookies
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Fetch user details from DB
    const existingUser = await db.select().from(users).where(eq(users.id, Number(token)));

    if (existingUser.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = existingUser[0];

    // Return user details (excluding password)
    return NextResponse.json({
      id: user.id,
      name: user.firstName + " " + user.surname,
      email: user.email,
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
