/* eslint-disable @typescript-eslint/no-unused-vars */
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
// import Image from "next/image";
import { db } from "../../../../configs/db";
import { 
  users, 
  orders, 
  orderItems, 
  products, 
  payments 
} from "../../../../configs/schema";
import { eq, and, desc, or } from "drizzle-orm";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { SellerDashboardShell } from "../_components/seller-dashboard-shell";
import { 
  Package, 
  ShoppingBag, 
  Calendar, 
  CreditCard, 
  ArrowRight,
  BarChart3
} from "lucide-react";

// Helper functions
function formatPrice(price: number) {
  return `₹${(price / 100).toLocaleString("en-IN")}`;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("hi-IN", { year: "numeric", month: "long", day: "numeric" }).format(date);
}

function getOrderStatusBadge(status: string) {
  const statusClasses: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    refunded: "bg-purple-100 text-purple-800",
  };
  return statusClasses[status] || "bg-gray-100 text-gray-800";
}

function getPaymentStatusBadge(status: string) {
  const statusClasses: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    authorized: "bg-blue-100 text-blue-800",
    captured: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    refunded: "bg-purple-100 text-purple-800",
  };
  return statusClasses[status] || "bg-gray-100 text-gray-800";
}

export default async function SellerOrdersPage() {
  // Get the token cookie - This matches your login logic
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");
  
  // Redirect to login if no token exists
  if (!tokenCookie) {
    redirect("/auth/login");
  }
  
  // Get user ID from token
  const userId = parseInt(tokenCookie.value, 10);
  
  // Verify the user exists and is a seller
  const userResult = await db.select().from(users).where(eq(users.id, userId));
  
  if (userResult.length === 0 || userResult[0].role !== "seller") {
    // Token exists but user doesn't or isn't a seller - clear cookie and redirect
    (await
          // Token exists but user doesn't or isn't a seller - clear cookie and redirect
          cookies()).set("token", "", { maxAge: 0 });
    redirect("/auth/login");
  }

  // Get all products for this seller
  const sellerProducts = await db.query.products.findMany({
    where: eq(products.sellerId, userId),
  });

  // If no products, show empty state
  if (sellerProducts.length === 0) {
    return (
      <>
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-orange-800">विक्रेता ऑर्डर डैशबोर्ड</h1>
            <Link href="/seller-dashboard/products">
              <Button variant="outline" className="border-orange-200 text-orange-700">
                <ShoppingBag className="mr-2 h-4 w-4" /> उत्पाद प्रबंधित करें
              </Button>
            </Link>
          </div>
          
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-16 w-16 text-orange-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">कोई उत्पाद नहीं मिला</h3>
              <p className="text-gray-500 mb-6">आपके पास अभी तक कोई उत्पाद नहीं है। उत्पाद जोड़ें ताकि ग्राहक खरीद सकें।</p>
              <Link href="/seller-dashboard/products/add">
                <Button className="bg-orange-600 hover:bg-orange-700">उत्पाद जोड़ें</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  // Get product IDs for query
  const productIds = sellerProducts.map(product => product.id);

  // Find all order items that contain seller's products
const sellerOrderItems = await db.query.orderItems.findMany({
    where: and(
        productIds.length > 0
            ? or(...productIds.map(productId => eq(orderItems.productId, productId)))
            : eq(orderItems.productId, -1), // Impossible condition if no products
    ),
    orderBy: desc(orderItems.createdAt),
});

  if (sellerOrderItems.length === 0) {
    return (
      <>
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-orange-800">विक्रेता ऑर्डर डैशबोर्ड</h1>
            <Link href="/seller-dashboard/products">
              <Button variant="outline" className="border-orange-200 text-orange-700">
                <ShoppingBag className="mr-2 h-4 w-4" /> उत्पाद प्रबंधित करें
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">कुल उत्पाद</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{sellerProducts.length}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">कुल कमाई</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">₹0</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">लंबित कमाई</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-yellow-600">₹0</p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BarChart3 className="h-16 w-16 text-orange-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">कोई ऑर्डर नहीं मिला</h3>
              <p className="text-gray-500 mb-6">आपके उत्पादों के लिए अभी तक कोई ऑर्डर नहीं है।</p>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  // Get unique order IDs
  const orderIds = [...new Set(sellerOrderItems.map(item => item.orderId))];

  // Fetch complete order information
  const orderInfoPromises = orderIds.map(async (orderId) => {
    const orderData = await db.query.orders.findFirst({
      where: eq(orders.id, orderId)
    });

    if (!orderData) return null;

    // Get order items that belong to this seller
    const items = await db.query.orderItems.findMany({
      where: and(
        eq(orderItems.orderId, orderId),
        productIds.length > 0
          ? or(...productIds.map(productId => eq(orderItems.productId, productId)))
          : eq(orderItems.productId, -1) // Impossible condition if no products
      ),
    });

    // Get product details for each item
    const itemsWithProducts = await Promise.all(
      items.map(async (item) => {
        const product = await db.query.products.findFirst({ 
          where: eq(products.id, item.productId) 
        });
        return { ...item, product };
      })
    );

    // Get payment information
    const payment = await db.query.payments.findFirst({ 
      where: eq(payments.orderId, orderId) 
    });

    // Get customer information
    const customer = await db.query.users.findFirst({
      where: eq(users.id, orderData.userId)
    });

    return {
      ...orderData,
      items: itemsWithProducts,
      payment,
      customer
    };
  });

  const sellerOrders = (await Promise.all(orderInfoPromises)).filter(Boolean);

  // Calculate earnings
  const totalEarnings = sellerOrders
    .filter(order => order?.status === "completed" && order?.payment?.status === "captured")
    .reduce((total, order) => {
      const orderTotal = order?.items.reduce((sum, item) => {
        return sum + (item.quantity * item.pricePerUnit);
      }, 0) || 0;
      return total + orderTotal;
    }, 0);

  const pendingEarnings = sellerOrders
    .filter(order => 
      (order?.status === "pending" || order?.status === "processing") && 
      (order?.payment?.status === "authorized" || order?.payment?.status === "pending")
    )
    .reduce((total, order) => {
      const orderTotal = order?.items.reduce((sum, item) => {
        return sum + (item.quantity * item.pricePerUnit);
      }, 0) || 0;
      return total + orderTotal;
    }, 0);

  // Group orders by product for the product summary view
  interface ProductStats {
    productId: number;
    name: string;
    category: string;
    totalQuantitySold: number;
    totalRevenue: number;
    orderCount: number;
    completedOrders: number;
    orderIds: number[];
  }

  const productStats = sellerOrders.reduce((acc: Record<number, ProductStats>, order) => {
    if (!order) return acc;
    
    order.items.forEach(item => {
      if (!item.product) return;
      
      const productId = item.product.id;
      
      if (!acc[productId]) {
        acc[productId] = {
          productId,
          name: item.product.name,
          category: item.product.category,
          totalQuantitySold: 0,
          totalRevenue: 0,
          orderCount: 0,
          completedOrders: 0,
          orderIds: []
        };
      }
      
      acc[productId].totalQuantitySold += item.quantity;
      acc[productId].totalRevenue += item.quantity * item.pricePerUnit;
      
      // Only count unique orders
      if (!acc[productId].orderIds.includes(order.id)) {
        acc[productId].orderCount += 1;
        if (order.status === "completed") {
          acc[productId].completedOrders += 1;
        }
        
        acc[productId].orderIds.push(order.id);
      }
    });
    
    return acc;
  }, {} as Record<number, ProductStats>);
  
  const productStatsArray = Object.values(productStats);

  return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-orange-800">विक्रेता ऑर्डर डैशबोर्ड</h1>
          <Link href="/seller-dashboard/products">
            <Button variant="outline" className="border-orange-200 text-orange-700">
              <ShoppingBag className="mr-2 h-4 w-4" /> उत्पाद प्रबंधित करें
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">कुल ऑर्डर</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{sellerOrders.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">कुल कमाई</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                {formatPrice(totalEarnings)}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">लंबित कमाई</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-600">
                {formatPrice(pendingEarnings)}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="orders" className="w-full">
          <TabsList>
            <TabsTrigger value="orders">सभी ऑर्डर</TabsTrigger>
            <TabsTrigger value="products">उत्पाद के अनुसार</TabsTrigger>
          </TabsList>
          
          <TabsContent value="orders" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ऑर्डर आईडी</TableHead>
                        <TableHead>दिनांक</TableHead>
                        <TableHead>ग्राहक</TableHead>
                        <TableHead>उत्पाद</TableHead>
                        <TableHead>राशि</TableHead>
                        <TableHead>ऑर्डर स्थिति</TableHead>
                        <TableHead>भुगतान स्थिति</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sellerOrders.map((order) => order && (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.orderId}</TableCell>
                          <TableCell>
                            {formatDate(order.createdAt)}
                          </TableCell>
                          <TableCell>
                            {order.customer?.firstName} {order.customer?.surname}
                            <div className="text-xs text-gray-500">{order.customer?.email}</div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="text-sm">
                                  {item.product?.name} x {item.quantity}
                                </div>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            {formatPrice(order.items.reduce((sum, item) => sum + (item.quantity * item.pricePerUnit), 0))}
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusBadge(order.status)}`}>
                              {order.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusBadge(order.payment?.status || 'pending')}`}>
                              {order.payment?.status || 'pending'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Link href={`/seller-dashboard/orders/${order.id}`}>
                              <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700">
                                <ArrowRight className="h-4 w-4" />
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="products" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>उत्पाद आईडी</TableHead>
                      <TableHead>नाम</TableHead>
                      <TableHead>श्रेणी</TableHead>
                      <TableHead>बिकी इकाइयां</TableHead>
                      <TableHead>आदेश</TableHead>
                      <TableHead>पूर्ण</TableHead>
                      <TableHead>राजस्व</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productStatsArray.map((product) => (
                      <TableRow key={product.productId}>
                        <TableCell className="font-medium">{product.productId}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{product.category}</Badge>
                        </TableCell>
                        <TableCell>{product.totalQuantitySold}</TableCell>
                        <TableCell>{product.orderCount}</TableCell>
                        <TableCell>{product.completedOrders}</TableCell>
                        <TableCell className="font-semibold">
                          {formatPrice(product.totalRevenue)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}