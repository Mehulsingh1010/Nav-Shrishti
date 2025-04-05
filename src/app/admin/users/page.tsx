/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Users, UserCog } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import AdminLayout from "@/components/admin/admin-layout"
import { DataTable } from "@/components/admin/data-table"

interface User {
  id: number
  referenceId: string
  firstName: string
  surname: string
  email: string
  mobile: string
  role: string
  createdAt: string
  bankDetails: any[]
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1,
  })

  const fetchUsers = async (page = 1) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/users?page=${page}&limit=${pagination.limit}`)
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
        setPagination(data.pagination)
      } else {
        console.error("Failed to fetch users")
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handlePageChange = (page: number) => {
    fetchUsers(page)
  }

  const columns = [
    {
      key: "id",
      header: "आईडी",
      cell: (user: User) => <span className="font-medium">{user.referenceId}</span>,
    },
    {
      key: "name",
      header: "नाम",
      cell: (user: User) => (
        <div>
          <div>
            {user.firstName} {user.surname}
          </div>
          <div className="text-xs text-gray-500">{user.email}</div>
        </div>
      ),
    },
    {
      key: "mobile",
      header: "मोबाइल",
      cell: (user: User) => user.mobile,
    },
    {
      key: "role",
      header: "भूमिका",
      cell: (user: User) => (
        <Badge
          className={
            user.role === "admin"
              ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
              : user.role === "seller"
                ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                : "bg-green-100 text-green-800 hover:bg-green-100"
          }
        >
          {user.role}
        </Badge>
      ),
    },
    {
      key: "bankDetails",
      header: "बैंक विवरण",
      cell: (user: User) => (
        <div>
          {user.bankDetails && user.bankDetails.length > 0 ? (
            <Badge variant="outline" className="bg-gray-100">
              {user.bankDetails.length} उपलब्ध
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-gray-100 text-gray-500">
              कोई नहीं
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "createdAt",
      header: "पंजीकरण तिथि",
      cell: (user: User) => new Date(user.createdAt).toLocaleDateString("hi-IN"),
    },
    {
      key: "actions",
      header: "",
      cell: (user: User) => (
        <div className="flex space-x-2">
          <Link href={`/admin/users/${user.id}`}>
            <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700">
              <UserCog className="h-4 w-4 mr-1" />
              प्रबंधित करें
            </Button>
          </Link>
        </div>
      ),
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-orange-800">उपयोगकर्ता प्रबंधन</h1>
          <div className="flex space-x-2">
            <Button variant="outline" className="border-orange-200 text-orange-700">
              <Users className="h-4 w-4 mr-2" />
              उपयोगकर्ता निर्यात करें
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <DataTable
            data={users}
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

