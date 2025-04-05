/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { Users, ShoppingBag, ShoppingCart, Network, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import AdminLayout from "@/components/admin/admin-layout"
import { DashboardCard } from "@/components/admin/dashboard-card"

// Helper function to format price
function formatPrice(price: number) {
  return `₹${(price / 100).toLocaleString("en-IN")}`
}

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await fetch("/api/admin/dashboard")
        if (response.ok) {
          const data = await response.json()
          setDashboardData(data)
        } else {
          console.error("Failed to fetch dashboard data")
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-orange-800">प्रशासन डैशबोर्ड</h1>
          <div className="flex space-x-2">
            <Link href="/admin/users">
              <Button variant="outline" className="border-orange-200 text-orange-700">
                उपयोगकर्ता प्रबंधित करें
              </Button>
            </Link>
            <Link href="/admin/products">
              <Button variant="outline" className="border-orange-200 text-orange-700">
                उत्पाद प्रबंधित करें
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard title="कुल उपयोगकर्ता" value={dashboardData?.counts.users || 0} icon={Users} />
          <DashboardCard title="कुल उत्पाद" value={dashboardData?.counts.products || 0} icon={ShoppingBag} />
          <DashboardCard title="कुल ऑर्डर" value={dashboardData?.counts.orders || 0} icon={ShoppingCart} />
          <DashboardCard title="कुल रेफरल" value={dashboardData?.counts.referrals || 0} icon={Network} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">मासिक बिक्री</CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardData?.monthlySales ? (
                <div className="h-80">
                  <div className="flex h-64 items-end space-x-2">
                    {dashboardData.monthlySales.map((item: any, index: number) => {
                      const maxValue = Math.max(...dashboardData.monthlySales.map((s: any) => s.total))
                      const height = maxValue > 0 ? (item.total / maxValue) * 100 : 0

                      return (
                        <div key={index} className="flex flex-col items-center flex-1">
                          <div className="w-full bg-orange-200 rounded-t" style={{ height: `${height}%` }}></div>
                          <div className="text-xs mt-2 text-center">
                            <div>{item.month}</div>
                            <div>{item.year}</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-400">कोई बिक्री डेटा उपलब्ध नहीं है</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">उपयोगकर्ता भूमिकाएँ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">प्रशासक</span>
                  <span className="font-bold">{dashboardData?.usersByRole.admin || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-orange-600 h-2.5 rounded-full"
                    style={{
                      width: `${
                        dashboardData?.counts.users
                          ? (dashboardData.usersByRole.admin / dashboardData.counts.users) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">विक्रेता</span>
                  <span className="font-bold">{dashboardData?.usersByRole.seller || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-orange-400 h-2.5 rounded-full"
                    style={{
                      width: `${
                        dashboardData?.counts.users
                          ? (dashboardData.usersByRole.seller / dashboardData.counts.users) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">उपयोगकर्ता</span>
                  <span className="font-bold">{dashboardData?.usersByRole.user || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-orange-300 h-2.5 rounded-full"
                    style={{
                      width: `${
                        dashboardData?.counts.users
                          ? (dashboardData.usersByRole.user / dashboardData.counts.users) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>

                <div className="pt-4 mt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">कुल बिक्री</span>
                    <span className="font-bold">{formatPrice(dashboardData?.totalSales || 0)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="recent-users">
          <TabsList>
            <TabsTrigger value="recent-users">हाल के उपयोगकर्ता</TabsTrigger>
            <TabsTrigger value="recent-orders">हाल के ऑर्डर</TabsTrigger>
          </TabsList>

          <TabsContent value="recent-users" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">नाम</th>
                      <th className="text-left p-4">ईमेल</th>
                      <th className="text-left p-4">भूमिका</th>
                      <th className="text-left p-4">पंजीकरण तिथि</th>
                      <th className="text-left p-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData?.recentUsers?.map((user: any) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          {user.firstName} {user.surname}
                        </td>
                        <td className="p-4">{user.email}</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.role === "admin"
                                ? "bg-purple-100 text-purple-800"
                                : user.role === "seller"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="p-4">{new Date(user.createdAt).toLocaleDateString("hi-IN")}</td>
                        <td className="p-4">
                          <Link href={`/admin/users/${user.id}`}>
                            <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700">
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recent-orders" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">ऑर्डर आईडी</th>
                      <th className="text-left p-4">तिथि</th>
                      <th className="text-left p-4">राशि</th>
                      <th className="text-left p-4">स्थिति</th>
                      <th className="text-left p-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData?.recentOrders?.map((order: any) => (
                      <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td className="p-4 font-medium">{order.orderId}</td>
                        <td className="p-4">{new Date(order.createdAt).toLocaleDateString("hi-IN")}</td>
                        <td className="p-4">{formatPrice(order.totalAmount)}</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              order.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : order.status === "processing"
                                  ? "bg-blue-100 text-blue-800"
                                  : order.status === "cancelled"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <Link href={`/admin/orders/${order.id}`}>
                            <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700">
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}

