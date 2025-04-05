/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ShoppingBag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import AdminLayout from "@/components/admin/admin-layout"
import { DataTable } from "@/components/admin/data-table"

interface Product {
  id: number
  productId: string
  name: string
  category: string
  price: number
  availableUnits: number
  status: string
  createdAt: string
  seller: {
    id: number
    firstName: string
    surname: string
    email: string
  } | null
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1,
  })

  const fetchProducts = async (page = 1) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/products?page=${page}&limit=${pagination.limit}`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products)
        setPagination(data.pagination)
      } else {
        console.error("Failed to fetch products")
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handlePageChange = (page: number) => {
    fetchProducts(page)
  }

  // Helper function to format price
  function formatPrice(price: number) {
    return `₹${(price / 100).toLocaleString("en-IN")}`
  }

  const columns = [
    {
      key: "id",
      header: "आईडी",
      cell: (product: Product) => <span className="font-medium">{product.productId}</span>,
    },
    {
      key: "name",
      header: "नाम",
      cell: (product: Product) => <div className="max-w-xs truncate">{product.name}</div>,
    },
    {
      key: "category",
      header: "श्रेणी",
      cell: (product: Product) => <Badge variant="outline">{product.category}</Badge>,
    },
    {
      key: "price",
      header: "मूल्य",
      cell: (product: Product) => <span className="font-medium">{formatPrice(product.price)}</span>,
    },
    {
      key: "inventory",
      header: "इन्वेंटरी",
      cell: (product: Product) => product.availableUnits,
    },
    {
      key: "status",
      header: "स्थिति",
      cell: (product: Product) => (
        <Badge
          className={
            product.status === "available"
              ? "bg-green-100 text-green-800 hover:bg-green-100"
              : "bg-red-100 text-red-800 hover:bg-red-100"
          }
        >
          {product.status}
        </Badge>
      ),
    },
    {
      key: "seller",
      header: "विक्रेता",
      cell: (product: Product) => (
        <div>
          {product.seller ? (
            <>
              <div>
                {product.seller.firstName} {product.seller.surname}
              </div>
              <div className="text-xs text-gray-500">{product.seller.email}</div>
            </>
          ) : (
            <span className="text-gray-500">अज्ञात</span>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      header: "",
      cell: (product: Product) => (
        <Link href={`/admin/products/${product.id}`}>
          <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700">
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      ),
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-orange-800">उत्पाद प्रबंधन</h1>
          <div className="flex space-x-2">
            <Button variant="outline" className="border-orange-200 text-orange-700">
              <ShoppingBag className="h-4 w-4 mr-2" />
              उत्पाद निर्यात करें
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <DataTable
            data={products}
            columns={columns}
            pagination={{
              ...pagination,
              onPageChange: handlePageChange,
            }}
            searchable
            onSearch={(query) => console.log("Search:", query)}
          />
        </div>
      </div>
    </AdminLayout>
  )
}

