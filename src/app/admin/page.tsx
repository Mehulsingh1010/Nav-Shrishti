/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Users,
  ShoppingBag,
  ShoppingCart,
  Network,
  ArrowRight,
  Menu,
  Bell,
  Settings,
  LogOut,
  BarChart3,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

// Helper function to format price
function formatPrice(price: number) {
  return `₹${(price / 100).toLocaleString("hi-IN")}`
}

// Dashboard Card Component
function DashboardCard({
  title,
  value,
  icon: Icon,
}: {
  title: string
  value: number | string
  icon: React.ElementType
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Sales Chart Component
function SalesChart({ data }: { data: any[] }) {
  // Find the maximum value for scaling
  const maxValue = Math.max(...data.map((item) => item.total))

  return (
    <div className="h-[300px] w-full">
      <div className="flex h-[250px] items-end space-x-2">
        {data.map((item, index) => {
          // Calculate height percentage based on the maximum value
          const heightPercentage = maxValue > 0 ? (item.total / maxValue) * 100 : 0

          // Generate a gradient color based on the value
          const intensity = Math.min(100, Math.max(30, (item.total / maxValue) * 100))

          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="relative w-full group">
                {/* Value tooltip */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-orange-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  {formatPrice(item.total * 100)}
                </div>
                {/* Bar */}
                <div
                  className={`w-full rounded-t transition-all duration-300 ease-in-out group-hover:bg-orange-500`}
                  style={{
                    height: `${heightPercentage}%`,
                    backgroundColor: `rgba(249, 115, 22, ${intensity / 100})`,
                    minHeight: item.total > 0 ? "10px" : "0",
                  }}
                ></div>
              </div>
              <div className="text-xs mt-2 text-center">
                <div className="font-medium">{item.month}</div>
                <div className="text-gray-500">{item.year}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Admin Sidebar Component
function AdminSidebar() {
  const pathname = usePathname()
  const [expandedMenus, setExpandedMenus] = React.useState<string[]>([])

  const toggleMenu = (menuName: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menuName) ? prev.filter((name) => name !== menuName) : [...prev, menuName],
    )
  }

  const navigation = [
    {
      name: "डैशबोर्ड",
      href: "/admin",
      icon: BarChart3,
      current: pathname === "/admin",
    },
    {
      name: "उपयोगकर्ता",
      href: "/admin/users",
      icon: Users,
      current: pathname.startsWith("/admin/users"),
    },
    {
      name: "उत्पाद",
      href: "/admin/products",
      icon: ShoppingBag,
      current: pathname.startsWith("/admin/products"),
    },
    {
      name: "ऑर्डर",
      href: "/admin/orders",
      icon: ShoppingCart,
      current: pathname.startsWith("/admin/orders"),
    },
    {
      name: "रेफरल",
      href: "/admin/referrals",
      icon: Network,
      current: pathname.startsWith("/admin/referrals"),
    },
    {
      name: "सेटिंग्स",
      href: "/admin/settings",
      icon: Settings,
      current: pathname.startsWith("/admin/settings"),
    },
  ]

  return (
    <Sidebar
      className="border-r border-orange-200 bg-gradient-to-b from-white to-orange-50"
      variant="sidebar"
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-orange-200 h-16 flex items-center px-5">
        <Link href="/">
          <div className="flex items-center gap-3 w-full overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-9 w-9 rounded-md flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-lg">प्र</span>
            </div>
            <span className="font-semibold text-lg text-orange-900 truncate">प्रशासन पैनल</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-3 py-5 overflow-y-auto">
        <SidebarMenu>
          {navigation.map((item) => (
            <SidebarMenuItem key={item.name} className="mb-2">
              <SidebarMenuButton
                asChild
                isActive={item.current}
                tooltip={item.name}
                className={cn(
                  "py-3 text-base hover:bg-orange-100 transition-colors",
                  item.current && "bg-gradient-to-r from-orange-100 to-amber-100 text-orange-900 font-medium",
                )}
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-orange-200 p-4">
        <div className="flex items-center gap-3 w-full bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg p-3">
          <Avatar className="h-10 w-10 border-2 border-white">
            <AvatarImage src="/placeholder.svg" alt="Admin" />
            <AvatarFallback className="bg-gradient-to-br from-orange-400 to-amber-500 text-white">PN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-sm font-medium truncate text-orange-900">Pankaj Namdeev</span>
            <span className="text-xs bg-white px-2 py-0.5 rounded-full text-orange-700 inline-block w-fit">प्रशासक</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 h-8 w-8 rounded-full bg-white text-orange-700 hover:text-orange-900"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>मेरा खाता</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin/profile">प्रोफाइल</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/settings">सेटिंग्स</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>लॉग आउट</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

// Admin Layout Component
function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  return (
    <SidebarProvider defaultOpen={true}>
      {/* Mobile header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b bg-white px-4 md:hidden">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-9 w-9 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-lg">प्र</span>
          </div>
          <span className="font-semibold text-lg text-orange-900">प्रशासन पैनल</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-orange-600 relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-orange-500">
              3
            </Badge>
          </Button>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 p-0">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0">
              <AdminSidebar />
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Desktop layout */}
      <div className="flex min-h-screen w-full bg-orange-50">
        <div className="hidden md:block">
          <AdminSidebar />
        </div>
        <div className="flex-1 w-full">
          <header className="sticky top-0 z-30 h-16 items-center gap-4 border-b bg-white px-6 hidden md:flex">
            <SidebarTrigger />
            <h1 className="text-xl font-bold text-orange-800">प्रशासन डैशबोर्ड</h1>
            <div className="flex-1" />
            <Button variant="ghost" size="icon" className="text-orange-600 relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-orange-500">
                3
              </Badge>
            </Button>
          </header>
          <main className="w-full p-4 md:p-6 pt-20 md:pt-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}

// Main Dashboard Component
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

    // For demo purposes, set mock data if fetch fails
    setTimeout(() => {
      if (loading) {
        setDashboardData({
          counts: { users: 5, products: 2, orders: 0, referrals: 0 },
          usersByRole: { admin: 1, seller: 2, user: 2 },
          totalSales: 12500,
          monthlySales: [
            { month: "दिसंबर", year: "2024", total: 1200 },
            { month: "जनवरी", year: "2025", total: 1800 },
            { month: "फरवरी", year: "2025", total: 2200 },
            { month: "मार्च", year: "2025", total: 1500 },
            { month: "अप्रैल", year: "2025", total: 2800 },
            { month: "मई", year: "2025", total: 3200 },
          ],
          recentUsers: [
            {
              id: 1,
              firstName: "राजेश",
              surname: "शर्मा",
              email: "rajesh@example.com",
              role: "admin",
              createdAt: "2023-05-15",
            },
            {
              id: 2,
              firstName: "अनिता",
              surname: "पटेल",
              email: "anita@example.com",
              role: "seller",
              createdAt: "2023-06-20",
            },
            {
              id: 3,
              firstName: "सुनील",
              surname: "वर्मा",
              email: "sunil@example.com",
              role: "user",
              createdAt: "2023-07-10",
            },
          ],
          recentOrders: [
            { id: 1, orderId: "ORD-001", totalAmount: 2500, status: "completed", createdAt: "2023-07-15" },
            { id: 2, orderId: "ORD-002", totalAmount: 3600, status: "processing", createdAt: "2023-07-18" },
            { id: 3, orderId: "ORD-003", totalAmount: 1800, status: "pending", createdAt: "2023-07-20" },
          ],
        })
        setLoading(false)
      }
    }, 2000)
  }, [loading])

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
      <div className="space-y-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard title="कुल उपयोगकर्ता" value={dashboardData?.counts.users || 0} icon={Users} />
          <DashboardCard title="कुल उत्पाद" value={dashboardData?.counts.products || 0} icon={ShoppingBag} />
          <DashboardCard title="कुल ऑर्डर" value={dashboardData?.counts.orders || 0} icon={ShoppingCart} />
          <DashboardCard title="कुल रेफरल" value={dashboardData?.counts.referrals || 0} icon={Network} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">मासिक बिक्री</CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardData?.monthlySales ? (
                <SalesChart data={dashboardData.monthlySales} />
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-400">कोई बिक्री डेटा उपलब्ध नहीं है</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">उपयोगकर्ता भूमिकाएँ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">प्रशासक</span>
                  <span className="font-bold">{dashboardData?.usersByRole.admin || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-600 h-2 rounded-full"
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
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-400 h-2 rounded-full"
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
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-300 h-2 rounded-full"
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

        <Tabs defaultValue="recent-users" className="w-full">
          <TabsList className="w-full md:w-auto grid grid-cols-2 md:flex">
            <TabsTrigger value="recent-users">हाल के उपयोगकर्ता</TabsTrigger>
            <TabsTrigger value="recent-orders">हाल के ऑर्डर</TabsTrigger>
          </TabsList>

          <TabsContent value="recent-users" className="mt-4">
            <Card>
              <CardContent className="p-0 overflow-x-auto">
                <div className="min-w-full">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">नाम</th>
                        <th className="text-left p-4">ईमेल</th>
                        <th className="text-left p-4">भूमिका</th>
                        <th className="hidden md:table-cell text-left p-4">पंजीकरण तिथि</th>
                        <th className="text-left p-4"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData?.recentUsers?.map((user: any) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="p-4">
                            {user.firstName} {user.surname}
                          </td>
                          <td className="p-4 truncate max-w-[120px] md:max-w-none">{user.email}</td>
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
                          <td className="hidden md:table-cell p-4">
                            {new Date(user.createdAt).toLocaleDateString("hi-IN")}
                          </td>
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recent-orders" className="mt-4">
            <Card>
              <CardContent className="p-0 overflow-x-auto">
                <div className="min-w-full">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">ऑर्डर आईडी</th>
                        <th className="hidden md:table-cell text-left p-4">तिथि</th>
                        <th className="text-left p-4">राशि</th>
                        <th className="text-left p-4">स्थिति</th>
                        <th className="text-left p-4"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData?.recentOrders?.map((order: any) => (
                        <tr key={order.id} className="border-b hover:bg-gray-50">
                          <td className="p-4 font-medium">{order.orderId}</td>
                          <td className="hidden md:table-cell p-4">
                            {new Date(order.createdAt).toLocaleDateString("hi-IN")}
                          </td>
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
