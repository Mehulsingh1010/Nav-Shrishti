/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Network, ArrowRight, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import AdminLayout from "@/components/admin/admin-layout"
import { DataTable } from "@/components/admin/data-table"

interface Referral {
  id: number
  status: string
  earnings: number
  createdAt: string
  referrer: {
    id: number
    referenceId: string
    firstName: string
    surname: string
    email: string
    promotionalRank: number
  } | null
  referred: {
    id: number
    referenceId: string
    firstName: string
    surname: string
    email: string
  } | null
}

export default function AdminReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1,
  })

  const fetchReferrals = async (page = 1) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/referrals?page=${page}&limit=${pagination.limit}`)
      if (response.ok) {
        const data = await response.json()
        setReferrals(data.referrals)
        setPagination(data.pagination)
      } else {
        console.error("Failed to fetch referrals")
      }
    } catch (error) {
      console.error("Error fetching referrals:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReferrals()
  }, [])

  const handlePageChange = (page: number) => {
    fetchReferrals(page)
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
      key: "referrer",
      header: "रेफरर",
      cell: (referral: Referral) => (
        <div>
          {referral.referrer ? (
            <>
              <div className="font-medium">
                {referral.referrer.firstName} {referral.referrer.surname}
              </div>
              <div className="text-xs text-gray-500">{referral.referrer.email}</div>
              <div className="text-xs text-gray-500">ID: {referral.referrer.referenceId}</div>
            </>
          ) : (
            <span className="text-gray-500">अज्ञात</span>
          )}
        </div>
      ),
    },
    {
      key: "referred",
      header: "रेफर्ड",
      cell: (referral: Referral) => (
        <div>
          {referral.referred ? (
            <>
              <div className="font-medium">
                {referral.referred.firstName} {referral.referred.surname}
              </div>
              <div className="text-xs text-gray-500">{referral.referred.email}</div>
              <div className="text-xs text-gray-500">ID: {referral.referred.referenceId}</div>
            </>
          ) : (
            <span className="text-gray-500">अज्ञात</span>
          )}
        </div>
      ),
    },
    {
      key: "rank",
      header: "रैंक",
      cell: (referral: Referral) => (
        <Badge variant="outline" className="bg-purple-50">
          {referral.referrer?.promotionalRank || 1}
        </Badge>
      ),
    },
    {
      key: "earnings",
      header: "कमाई",
      cell: (referral: Referral) => (
        <span className="font-medium text-green-600">{formatPrice(referral.earnings)}</span>
      ),
    },
    {
      key: "status",
      header: "स्थिति",
      cell: (referral: Referral) => (
        <Badge
          className={
            referral.status === "active"
              ? "bg-green-100 text-green-800 hover:bg-green-100"
              : "bg-red-100 text-red-800 hover:bg-red-100"
          }
        >
          {referral.status}
        </Badge>
      ),
    },
    {
      key: "date",
      header: "दिनांक",
      cell: (referral: Referral) => formatDate(referral.createdAt),
    },
    {
      key: "actions",
      header: "",
      cell: (referral: Referral) => (
        <div className="flex space-x-2">
          <Link href={`/admin/users/${referral.referrer?.id}`}>
            <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700">
              <ArrowRight className="h-4 w-4" />
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
          <h1 className="text-2xl font-bold text-orange-800">रेफरल नेटवर्क</h1>
          <div className="flex space-x-2">
            <Button variant="outline" className="border-orange-200 text-orange-700">
              <Network className="h-4 w-4 mr-2" />
              नेटवर्क विज़ुअलाइज़ करें
            </Button>
            <Button variant="outline" className="border-orange-200 text-orange-700">
              <Download className="h-4 w-4 mr-2" />
              रेफरल निर्यात करें
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <DataTable
            data={referrals}
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

