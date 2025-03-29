/* eslint-disable @typescript-eslint/no-unused-vars */
import { cookies } from "next/headers";
import { db } from "../../../../../../configs/db";
import { orders, orderItems, products, payments, users } from "../../../../../../configs/schema";
import { eq } from "drizzle-orm";
import { redirect, notFound } from "next/navigation";
// import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { DashboardShell } from "@/app/user-dashboard/profile/view-profile/dashboard-shell";

function formatPrice(price) {
  return `₹${(price / 100).toLocaleString("en-IN")}`;
}

function formatDate(date) {
  return new Intl.DateTimeFormat("hi-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

function getStatusBadge(status) {
  const statusClasses = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return statusClasses[status] || "bg-gray-100 text-gray-800";
}

function translateStatus(status) {
  const translations = {
    pending: "लंबित",
    processing: "प्रोसेसिंग",
    completed: "पूर्ण",
    cancelled: "रद्द",
  };
  return translations[status] || status;
}

export default async function OrderDetailPage({ params }) {
  const cookieStore = cookies();
  const tokenCookie = (await cookieStore).get("token");

  if (!tokenCookie) {
    redirect("/auth/login");
  }

  const userId = parseInt(tokenCookie.value, 10);

  const userResult = await db.select().from(users).where(eq(users.id, userId));
  if (userResult.length === 0) {
    (await cookies()).set("token", "", { maxAge: 0 });
    redirect("/auth/login");
  }

  const order = await db.query.orders.findFirst({
    where: eq(orders.id, parseInt(params.orderId, 10)),
  });

  if (!order || order.userId !== userId) {
    notFound();
  }

  const items = await db.query.orderItems.findMany({
    where: eq(orderItems.orderId, order.id),
  });

  const itemsWithProducts = await Promise.all(
    items.map(async (item) => {
      const product = await db.query.products.findFirst({
        where: eq(products.id, item.productId),
      });

      let seller = null;
      if (product?.sellerId) {
        seller = await db.query.users.findFirst({
          where: eq(users.id, product.sellerId),
        });
      }

      return { ...item, product, seller };
    })
  );

  const payment = await db.query.payments.findFirst({
    where: eq(payments.orderId, order.id),
  });

  return (
  
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/user-dashboard/purchase/history" className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" /> खरीद इतिहास पर वापस जाएं
        </Link>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-orange-800">ऑर्डर #{order.orderId}</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(order.status)}`}>{translateStatus(order.status)}</span>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>ऑर्डर किए गए उत्पाद</CardTitle>
          </CardHeader>
          <CardContent>
            {itemsWithProducts.map((item) => (
              <div key={item.id} className="p-4 border-b border-gray-100">
                <div className="flex items-start">
                <img
  src={item.product?.photoUrl || "/placeholder.svg"} 
  alt={item.product?.name || "Product"} 
  width="64" 
  height="64" 
  className="h-16 w-16 object-cover" 
/>

                <div className="ml-4">
                    <h3 className="font-medium text-gray-900">{item.product?.name || "Product"}</h3>
                    <p className="text-sm text-gray-500">विक्रेता: {item.seller?.firstName || "अज्ञात विक्रेता"}</p>
                    <div className="flex justify-between mt-2">
                      <span className="text-sm text-gray-500">मात्रा: {item.quantity} × {formatPrice(item.pricePerUnit)}</span>
                      <span className="font-semibold">{formatPrice(item.quantity * item.pricePerUnit)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    
  );
}
