"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, ShoppingBag, ShoppingCart, Network, LogOut, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AdminUser {
  id: number
  firstName: string
  surname: string
  email: string
  role: string
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    async function fetchAdminUser() {
      try {
        const response = await fetch("/api/admin/verify")
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        } else {
          // Handle unauthorized or forbidden
          window.location.href = "/auth/login"
        }
      } catch (error) {
        console.error("Error fetching admin user:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAdminUser()
  }, [])

  const handleLogout = async () => {
    try {
      // Clear the token cookie
      document.cookie = "token=; max-age=0; path=/;"
      // Redirect to login
      window.location.href = "/auth/login"
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  const navItems = [
    { href: "/admin", label: "डैशबोर्ड", icon: LayoutDashboard },
    { href: "/admin/users", label: "उपयोगकर्ता", icon: Users },
    { href: "/admin/products", label: "उत्पाद", icon: ShoppingBag },
    { href: "/admin/orders", label: "ऑर्डर", icon: ShoppingCart },
    { href: "/admin/referrals", label: "रेफरल नेटवर्क", icon: Network },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button variant="outline" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="bg-white">
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
            <div className="p-4 border-b">
            <Link href="/" className="text-orange-800 hover:underline">
              Home
            </Link>
            <h1 className="text-xl font-bold text-orange-800 mt-2">प्रशासन पैनल</h1>
            {user && (
              <p className="text-sm text-gray-600 mt-1">
              {user.firstName} {user.surname}
              </p>
            )}
            </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? "bg-orange-50 text-orange-700" : "text-gray-700 hover:bg-orange-50 hover:text-orange-700"
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:bg-orange-50 hover:text-orange-700"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              लॉग आउट
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className={`flex-1 p-6 md:ml-64 transition-all duration-300 ease-in-out`}>{children}</main>
    </div>
  )
}

