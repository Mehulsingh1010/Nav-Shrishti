"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Search, ShoppingCart, Edit, Trash2, Filter, ArrowUpDown } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SellerDashboardShell } from "../_components/seller-dashboard-shell"

// Mock data - would come from API in real implementation
const mockProducts = [
  {
    id: 1,
    name: "Organic Fertilizer",
    sku: "FRT-001",
    price: 1200,
    units: 150,
    category: "Agriculture",
    status: "In Stock",
  },
  {
    id: 2,
    name: "Neem Oil Extract",
    sku: "NOE-002",
    price: 850,
    units: 75,
    category: "Pesticides",
    status: "In Stock",
  },
  { id: 3, name: "Soil Health Kit", sku: "SHK-003", price: 1500, units: 25, category: "Testing", status: "Low Stock" },
  { id: 4, name: "Seed Variety Pack", sku: "SVP-004", price: 650, units: 200, category: "Seeds", status: "In Stock" },
  {
    id: 5,
    name: "Drip Irrigation Set",
    sku: "DIS-005",
    price: 3200,
    units: 15,
    category: "Equipment",
    status: "Low Stock",
  },
  {
    id: 6,
    name: "Organic Compost",
    sku: "OCP-006",
    price: 550,
    units: 0,
    category: "Agriculture",
    status: "Out of Stock",
  },
  {
    id: 7,
    name: "Plant Growth Regulator",
    sku: "PGR-007",
    price: 1800,
    units: 45,
    category: "Chemicals",
    status: "In Stock",
  },
  {
    id: 8,
    name: "Sprinkler System",
    sku: "SPR-008",
    price: 2500,
    units: 8,
    category: "Equipment",
    status: "Low Stock",
  },
]

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProducts, setFilteredProducts] = useState(mockProducts)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)

    if (term) {
      setFilteredProducts(
        mockProducts.filter(
          (product) =>
            product.name.toLowerCase().includes(term.toLowerCase()) ||
            product.sku.toLowerCase().includes(term.toLowerCase()) ||
            product.category.toLowerCase().includes(term.toLowerCase()),
        ),
      )
    } else {
      setFilteredProducts(mockProducts)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
      case "Low Stock":
        return "bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200"
      case "Out of Stock":
        return "bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
      default:
        return "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200"
    }
  }

  return (
    <SellerDashboardShell>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-orange-800">Products</h1>
          <Button className="bg-orange-600 hover:bg-orange-700">
            <Plus className="mr-2 h-4 w-4" />
            Add New Product
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle>Manage Products</CardTitle>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="pl-8 w-full md:w-[250px]"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-orange-200">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>All Products</DropdownMenuItem>
                    <DropdownMenuItem>In Stock</DropdownMenuItem>
                    <DropdownMenuItem>Low Stock</DropdownMenuItem>
                    <DropdownMenuItem>Out of Stock</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Image</TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        Product Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Price (₹)</TableHead>
                    <TableHead className="text-right">Available Units</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="h-12 w-12 rounded-md bg-orange-100 flex items-center justify-center">
                          <img
                            src={`/placeholder.svg?height=48&width=48`}
                            alt={product.name}
                            className="h-10 w-10 object-cover rounded"
                          />
                        </div>
                      </TableCell>
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
                        <span
                          className={
                            product.units === 0
                              ? "text-red-600 font-medium"
                              : product.units < 50
                                ? "text-amber-600 font-medium"
                                : ""
                          }
                        >
                          {product.units}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(product.status)}>
                          {product.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-orange-200 text-orange-700 hover:bg-orange-100"
                          >
                            <Edit className="h-3.5 w-3.5 mr-1" />
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
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-red-200 text-red-700 hover:bg-red-100"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
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
      </div>
    </SellerDashboardShell>
  )
}

