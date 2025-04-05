/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "../../../../../../configs/db";
import { users } from "../../../../../../configs/schema";
import { eq } from "drizzle-orm";

export async function GET(_, { params }) {
  try {
    const tokenCookie = (await cookies()).get("token");
    if (!tokenCookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const adminId = Number.parseInt(tokenCookie.value, 10);
    const [adminUser] = await db.select().from(users).where(eq(users.id, adminId));
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const userId = Number.parseInt(params.id, 10);
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { password, ...safeUser } = user;
    return NextResponse.json(safeUser);
  } catch (error) {
    console.error("GET /user/[id] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const tokenCookie = (await cookies()).get("token");
    if (!tokenCookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const adminId = Number.parseInt(tokenCookie.value, 10);
    const [adminUser] = await db.select().from(users).where(eq(users.id, adminId));
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const userId = Number.parseInt(params.id, 10);
    const data = await request.json();
    const allowedFields = ["role"];
    const updateData = allowedFields.reduce((acc, field) => {
      if (data[field] !== undefined) acc[field] = data[field];
      return acc;
    }, {});

    await db.update(users).set({ ...updateData, updatedAt: new Date() }).where(eq(users.id, userId));

    const [updatedUser] = await db.select().from(users).where(eq(users.id, userId));
    if (!updatedUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { password, ...safeUser } = updatedUser;
    return NextResponse.json(safeUser);
  } catch (error) {
    console.error("PATCH /user/[id] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}