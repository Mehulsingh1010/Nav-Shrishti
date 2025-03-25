/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers";
import { db } from "../../../../../configs/db";
import {
  orders,
  orderItems,
  products,
  payments,
  users,
} from "../../../../../configs/schema";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
// import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  ShoppingBag,
  Calendar,
  Clock,
  ArrowRight,
} from "lucide-react";
// import { DashboardShell } from "../../_components/dashboard-shell";

function formatPrice(price: number) {
  return `₹${(price / 100).toLocaleString("en-IN")}`;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("hi-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function getStatusBadge(status: string) {
  const statusClasses: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return statusClasses[status] || "bg-gray-100 text-gray-800";
}

function translateStatus(status: string) {
  const translations: Record<string, string> = {
    pending: "लंबित",
    processing: "प्रोसेसिंग",
    completed: "पूर्ण",
    cancelled: "रद्द",
  };
  return translations[status] || status;
}

export default async function PurchaseHistoryPage() {
  // Get the token cookie - This matches your login logic
  const cookieStore = cookies();
  const tokenCookie = (await cookieStore).get("token");

  // Redirect to login if no token exists
  if (!tokenCookie) {
    redirect("/auth/login");
  }

  // Get user ID from token
  const userId = parseInt(tokenCookie.value, 10);

  // Verify the user exists
  const userResult = await db.select().from(users).where(eq(users.id, userId));
  if (userResult.length === 0) {
    // Token exists but user doesn't - clear cookie and redirect
    (
      await // Token exists but user doesn't - clear cookie and redirect
      cookies()
    ).set("token", "", { maxAge: 0 });
    redirect("/auth/login");
  }

  const userOrders = await db.query.orders.findMany({
    where: eq(orders.userId, userId),
    orderBy: desc(orders.createdAt),
  });

  const ordersWithItems = await Promise.all(
    userOrders.map(async (order) => {
      const items = await db.query.orderItems.findMany({
        where: eq(orderItems.orderId, order.id),
      });

      const itemsWithProducts = await Promise.all(
        items.map(async (item) => {
          const product = await db.query.products.findFirst({
            where: eq(products.id, item.productId),
          });
          return { ...item, product };
        })
      );

      const payment = await db.query.payments.findFirst({
        where: eq(payments.orderId, order.id),
      });
      return { ...order, items: itemsWithProducts, payment };
    })
  );

  return (
    
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-orange-800">खरीद इतिहास</h1>
          <Link href="/products">
            <Button
              variant="outline"
              className="border-orange-200 text-orange-700"
            >
              <ShoppingBag className="mr-2 h-4 w-4" /> और खरीदारी करें
            </Button>
          </Link>
        </div>
        {ordersWithItems.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-16 w-16 text-orange-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                कोई खरीद नहीं मिली
              </h3>
              <p className="text-gray-500 mb-6">
                आपने अभी तक कोई उत्पाद नहीं खरीदा है।
              </p>
              <Link href="/products">
                <Button className="bg-orange-600 hover:bg-orange-700">
                  उत्पाद ब्राउज़ करें
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {ordersWithItems.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-orange-50 border-b border-orange-100">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg text-orange-800">
                        ऑर्डर #{order.id}
                      </CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />{" "}
                        {formatDate(order.createdAt)}
                        <Clock className="h-4 w-4 mr-1" />{" "}
                        {new Date(order.createdAt).toLocaleTimeString("hi-IN")}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {translateStatus(order.status)}
                      </span>
                      <span className="font-semibold text-orange-600">
                        {formatPrice(order.totalAmount)}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 border-b border-gray-100 flex items-center"
                    >
                      <img
                        src={item.product?.photoUrl || "/placeholder.svg"}
                        alt={item.product?.name || "Product"}
                        width={64}
                        height={64}
                        className="h-16 w-16 object-cover"
                      />
                      <div className="flex-grow ml-4">
                        <h3 className="font-medium text-gray-900">
                          {item.product?.name || "Product"}
                        </h3>
                        <span className="text-sm text-gray-500">
                          मात्रा: {item.quantity} ×{" "}
                          {formatPrice(item.pricePerUnit)}
                        </span>
                        <span className="font-semibold block">
                          {formatPrice(item.quantity * item.pricePerUnit)}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="p-4 bg-gray-50 flex justify-between">
                    <span className="text-sm text-gray-500">
                      भुगतान स्थिति:{" "}
                      {order.payment?.status === "captured" ? "सफल" : "लंबित"}
                    </span>
                    <Link href={`/user-dashboard/purchase/order/${order.id}`}>
                      <Button
                        variant="ghost"
                        className="text-orange-600 hover:text-orange-700"
                      >
                        विवरण देखें <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
   
  );
}
