/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
"use client"

import { useEffect, useState } from "react"
import { BarChart3, Plus, ShoppingCart, Wallet, ArrowUp, TrendingUp, Search, Download } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { SellerDashboardShell } from "./_components/seller-dashboard-shell"

// Mock data - would come from API in real implementation
const mockProducts = [
  { id: 1, name: "Organic Fertilizer", sku: "FRT-001", price: 1200, units: 150, category: "Agriculture" },
  { id: 2, name: "Neem Oil Extract", sku: "NOE-002", price: 850, units: 75, category: "Pesticides" },
  { id: 3, name: "Soil Health Kit", sku: "SHK-003", price: 1500, units: 25, category: "Testing" },
  { id: 4, name: "Seed Variety Pack", sku: "SVP-004", price: 650, units: 200, category: "Seeds" },
  { id: 5, name: "Drip Irrigation Set", sku: "DIS-005", price: 3200, units: 15, category: "Equipment" },
]

const salesData = {
  daily: 12500,
  weekly: 78500,
  monthly: 345000,
  availableBalance: 278000,
  totalIncome: 1245000,
  productsSold: 87,
  newOrders: 12,
  pendingOrders: 5,
}

export default function SellerDashboardPage() {
  const [greeting, setGreeting] = useState("Good day")
  const [user, setUser] = useState({ name: "Rahul Sharma" })
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProducts, setFilteredProducts] = useState(mockProducts)

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good morning")
    else if (hour < 17) setGreeting("Good afternoon")
    else setGreeting("Good evening")

    // In a real app, we would fetch user data here
    // fetchUserData().then(data => setUser(data))
  }, [])

  useEffect(() => {
    if (searchTerm) {
      setFilteredProducts(
        mockProducts.filter(
          (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      )
    } else {
      setFilteredProducts(mockProducts)
    }
  }, [searchTerm])

  return (
    <SellerDashboardShell>
      <div className="flex flex-col space-y-6">
        {/* Top Section with User Welcome */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-xl border border-amber-100">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-orange-800">
              {greeting}, {user.name}
            </h1>
            <p className="text-orange-600 mt-1">
              Welcome to your seller dashboard. Manage your products and track your sales.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button className="bg-orange-600 hover:bg-orange-700 shadow-md transition-all">
              <Plus className="mr-2 h-4 w-4" />
              Add New Product
            </Button>
          </div>
        </div>

        {/* Key Metrics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-sm hover:shadow transition-all">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold text-orange-800">Available Balance</CardTitle>
                <div className="p-2 bg-white rounded-full">
                  <Wallet className="h-5 w-5 text-orange-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-900">₹{salesData.availableBalance.toLocaleString()}</div>
              <div className="flex items-center mt-1 text-sm text-orange-700">
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 text-xs border-orange-200 text-orange-700 hover:bg-orange-100"
                >
                  Withdraw Funds
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 shadow-sm hover:shadow transition-all">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold text-amber-800">Total Income</CardTitle>
                <div className="p-2 bg-white rounded-full">
                  <BarChart3 className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-900">₹{salesData.totalIncome.toLocaleString()}</div>
              <div className="flex items-center mt-1 text-sm text-amber-700">
                <TrendingUp className="h-4 w-4 mr-1 text-green-600" />
                <span>₹45,000 from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 shadow-sm hover:shadow transition-all">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold text-yellow-800">Orders Overview</CardTitle>
                <div className="p-2 bg-white rounded-full">
                  <ShoppingCart className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center">
                  <div className="text-xs font-medium text-yellow-700">New</div>
                  <div className="text-xl font-bold text-yellow-900">{salesData.newOrders}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-medium text-yellow-700">Pending</div>
                  <div className="text-xl font-bold text-yellow-900">{salesData.pendingOrders}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-medium text-yellow-700">Products Sold</div>
                  <div className="text-xl font-bold text-yellow-900">{salesData.productsSold}</div>
                </div>
              </div>
              <div className="flex items-center mt-3 text-sm text-yellow-700">
                <ArrowUp className="h-4 w-4 mr-1 text-green-600" />
                <span>15% increase in sales this week</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Section */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle>Your Products</CardTitle>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="pl-8 w-full md:w-[250px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button className="bg-orange-600 hover:bg-orange-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Price (₹)</TableHead>
                    <TableHead className="text-right">Available Units</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.sku}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-orange-50 text-orange-700 hover:bg-orange-100 border-orange-200"
                        >
                          {product.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">₹{product.price.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <span className={product.units < 50 ? "text-red-600 font-medium" : ""}>{product.units}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-orange-200 text-orange-700 hover:bg-orange-100"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-green-200 text-green-700 hover:bg-green-100"
                          >
                            <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                            Sell
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Sales Reports */}
        <Tabs defaultValue="daily" className="w-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <CardTitle>Sales Reports</CardTitle>
            <div className="flex items-center gap-3">
              <TabsList className="bg-orange-50 text-orange-800">
                <TabsTrigger value="daily" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
                  Daily
                </TabsTrigger>
                <TabsTrigger
                  value="weekly"
                  className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
                >
                  Weekly
                </TabsTrigger>
                <TabsTrigger
                  value="monthly"
                  className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
                >
                  Monthly
                </TabsTrigger>
              </TabsList>
              <Button variant="outline" size="sm" className="border-orange-200 text-orange-700 hover:bg-orange-100">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="pt-6">
              <TabsContent value="daily" className="mt-0">
                <div className="flex flex-col">
                  <div className="text-2xl font-bold text-orange-900">₹{salesData.daily.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Today's Sales</div>
                  <div className="mt-4">
                    <Progress value={65} className="h-2" />
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                      <span>Target: ₹20,000</span>
                      <span>65% Achieved</span>
                    </div>
                  </div>
                  <div className="mt-6 h-[200px] bg-muted/20 rounded-lg flex items-center justify-center text-muted-foreground">
                    Daily sales chart will appear here
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="weekly" className="mt-0">
                <div className="flex flex-col">
                  <div className="text-2xl font-bold text-orange-900">₹{salesData.weekly.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">This Week's Sales</div>
                  <div className="mt-4">
                    <Progress value={78} className="h-2" />
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                      <span>Target: ₹100,000</span>
                      <span>78% Achieved</span>
                    </div>
                  </div>
                  <div className="mt-6 h-[200px] bg-muted/20 rounded-lg flex items-center justify-center text-muted-foreground">
                    Weekly sales chart will appear here
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="monthly" className="mt-0">
                <div className="flex flex-col">
                  <div className="text-2xl font-bold text-orange-900">₹{salesData.monthly.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">This Month's Sales</div>
                  <div className="mt-4">
                    <Progress value={85} className="h-2" />
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                      <span>Target: ₹400,000</span>
                      <span>85% Achieved</span>
                    </div>
                  </div>
                  <div className="mt-6 h-[200px] bg-muted/20 rounded-lg flex items-center justify-center text-muted-foreground">
                    Monthly sales chart will appear here
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </SellerDashboardShell>
  )
}

