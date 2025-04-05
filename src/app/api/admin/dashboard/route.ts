import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "../../../../../configs/db";
import { users, products, orders, payments, referrals } from "../../../../../configs/schema";
import { eq, and, gte, lte, sql } from "drizzle-orm";

export async function GET() {
  try {
    const cookieStore = cookies();
    const tokenCookie = (await cookieStore).get("token");

    if (!tokenCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = Number.parseInt(tokenCookie.value, 10);

    const adminUser = await db.select().from(users).where(eq(users.id, userId));

    if (adminUser.length === 0 || adminUser[0].role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [userCount] = await db.select({ count: sql<number>`COUNT(*)` }).from(users);
    const [productCount] = await db.select({ count: sql<number>`COUNT(*)` }).from(products);
    const [orderCount] = await db.select({ count: sql<number>`COUNT(*)` }).from(orders);
    const [referralCount] = await db.select({ count: sql<number>`COUNT(*)` }).from(referrals);

    const [adminCount] = await db.select({ count: sql<number>`COUNT(*)` }).from(users).where(eq(users.role, "admin"));
    const [sellerCount] = await db.select({ count: sql<number>`COUNT(*)` }).from(users).where(eq(users.role, "seller"));
    const [regularUserCount] = await db.select({ count: sql<number>`COUNT(*)` }).from(users).where(eq(users.role, "user"));

    const completedPayments = await db.select().from(payments).where(eq(payments.status, "captured"));
    const totalSales = completedPayments.reduce((sum, payment) => sum + payment.amount, 0);

    const recentOrders = await db
      .select()
      .from(orders)
      .orderBy(sql`${orders.createdAt} DESC`)
      .limit(5);

    const recentUsers = await db
      .select({
        id: users.id,
        referenceId: users.referenceId,
        firstName: users.firstName,
        surname: users.surname,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(sql`${users.createdAt} DESC`)
      .limit(5);

    const now = new Date();
    const monthlySales = [];

    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
      const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0, 23, 59, 59);

      const monthlyPayments = await db
        .select()
        .from(payments)
        .where(
          and(
            eq(payments.status, "captured"),
            gte(payments.createdAt, startOfMonth),
            lte(payments.createdAt, endOfMonth)
          )
        );

      const monthlyTotal = monthlyPayments.reduce((sum, payment) => sum + payment.amount, 0);

      monthlySales.push({
        month: startOfMonth.toLocaleString("default", { month: "short" }),
        year: startOfMonth.getFullYear(),
        total: monthlyTotal,
      });
    }

    return NextResponse.json({
      counts: {
        users: userCount.count,
        products: productCount.count,
        orders: orderCount.count,
        referrals: referralCount.count,
      },
      usersByRole: {
        admin: adminCount.count,
        seller: sellerCount.count,
        user: regularUserCount.count,
      },
      totalSales,
      recentOrders,
      recentUsers,
      monthlySales,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
