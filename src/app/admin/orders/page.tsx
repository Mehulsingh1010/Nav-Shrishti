/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import AdminLayout from "@/components/admin/admin-layout"
import { DataTable } from "@/components/admin/data-table"

interface Order {
  id: number
  orderId: string
  totalAmount: number
  status: string
  createdAt: string
  customer: {
    id: number
    firstName: string
    surname: string
    email: string
  } | null
  payment: {
    status: string
  } | null
  items: any[]
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1,
  })

  const fetchOrders = async (page = 1) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/orders?page=${page}&limit=${pagination.limit}`)
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders)
        setPagination(data.pagination)
      } else {
        console.error("Failed to fetch orders")
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handlePageChange = (page: number) => {
    fetchOrders(page)
  }

  // Helper function to format price
  function formatPrice(price: number) {
    return `₹${(price / 100).toLocaleString("en-IN")}`
  }

  // Helper function to format date
  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("hi-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const columns = [
    {
      key: "id",
      header: "ऑर्डर आईडी",
      cell: (order: Order) => <span className="font-medium">{order.orderId}</span>,
    },
    {
      key: "date",
      header: "दिनांक",
      cell: (order: Order) => formatDate(order.createdAt),
    },
    {
      key: "customer",
      header: "ग्राहक",
      cell: (order: Order) => (
        <div>
          {order.customer ? (
            <>
              <div>
                {order.customer.firstName} {order.customer.surname}
              </div>
              <div className="text-xs text-gray-500">{order.customer.email}</div>
            </>
          ) : (
            <span className="text-gray-500">अज्ञात</span>
          )}
        </div>
      ),
    },
    {
      key: "items",
      header: "आइटम",
      cell: (order: Order) => (
        <div className="max-w-xs">
          {order.items
            .map((item, idx) => (
              <div key={idx} className="text-sm truncate">
                {item.product?.name} x {item.quantity}
              </div>
            ))
            .slice(0, 2)}
          {order.items.length > 2 && <div className="text-xs text-gray-500">+{order.items.length - 2} अधिक</div>}
        </div>
      ),
    },
    {
      key: "amount",
      header: "राशि",
      cell: (order: Order) => <span className="font-medium">{formatPrice(order.totalAmount)}</span>,
    },
    {
      key: "status",
      header: "ऑर्डर स्थिति",
      cell: (order: Order) => (
        <Badge
          className={
            order.status === "completed"
              ? "bg-green-100 text-green-800 hover:bg-green-100"
              : order.status === "processing"
                ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                : order.status === "cancelled"
                  ? "bg-red-100 text-red-800 hover:bg-red-100"
                  : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
          }
        >
          {order.status}
        </Badge>
      ),
    },
    {
      key: "payment",
      header: "भुगतान",
      cell: (order: Order) => (
        <Badge
          className={
            order.payment?.status === "captured"
              ? "bg-green-100 text-green-800 hover:bg-green-100"
              : order.payment?.status === "authorized"
                ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                : order.payment?.status === "failed"
                  ? "bg-red-100 text-red-800 hover:bg-red-100"
                  : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
          }
        >
          {order.payment?.status || "pending"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      cell: (order: Order) => (
        <Link href={`/admin/orders/${order.id}`}>
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
          <h1 className="text-2xl font-bold text-orange-800">ऑर्डर प्रबंधन</h1>
          <div className="flex space-x-2">
            <Button variant="outline" className="border-orange-200 text-orange-700">
              <Download className="h-4 w-4 mr-2" />
              ऑर्डर निर्यात करें
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <DataTable
            data={orders}
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

