/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, Bell, User, ArrowBigRight } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import TranslatorButton from "@/components/translator-button"

export default function Navbar() {
  const [isLoginMenuOpen, setIsLoginMenuOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<{
    id: string
    name: string
    email: string
  } | null>(null)
  const [error, setError] = useState("")
  const [userRole, setUserRole] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const role = localStorage.getItem("userRole")
    if (role) {
      setUserRole(role)
    }
  }, [])

  const handleDashboardRedirect = () => {
    if (userRole === "seller") {
      router.push("/seller-dashboard")
    } else if (userRole === "user") {
      router.push("/user-dashboard")
    }
  }

  const navItems = [
    { name: "उत्पाद", href: "/navlinks/products" },
    { name: "संपर्क", href: "/navlinks/contact" },
    { name: "कार्यक्रम", href: "/navlinks/events" },
    { name: "गैलरी", href: "/navlinks/gallery" },
    { name: "हमारे बारे में", href: "/navlinks/about" },
  ]

  const pathname = usePathname()

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/profile")
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error)
        }

        setUser(data)
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message)
      }
    }

    fetchUser()
  }, [])

  return (
    <nav className="fixed w-full z-50 bg-orange-50/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Title */}
          <Link href="/" className="flex items-center gap-4 group">
            <div className="relative h-12 w-12 md:h-14 md:w-14">
              <Image
                src="/logo.png"
                alt="संस्थान लोगो"
                fill
                className="rounded-full object-cover shadow-md group-hover:shadow-lg transition-shadow"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg md:text-2xl font-bold text-orange-800 group-hover:text-orange-600 transition-colors">
                नव सृष्टि सृजन
              </h1>
              <span className="text-sm text-orange-600/80 hidden md:block">सेवा संस्थान</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`relative text-orange-800 hover:text-orange-600 transition-colors px-3 py-2 ${
                  pathname === item.href ? "bg-orange-100 rounded-lg font-bold" : ""
                }`}
              >
                <span>{item.name}</span>
              </a>
            ))}

            {/* Login Dropdown */}
            <div className="relative group">
              {user ? (
                <button
                  onClick={handleDashboardRedirect}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  dashboard <ArrowBigRight />
                </button>
              ) : (
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  लॉगिन
                </Link>
              )}
            </div>

            {/* Language Toggle Button */}
            <TranslatorButton />
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            <Button variant="ghost" size="icon" className="text-orange-600 relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-orange-500">
                2
              </Badge>
            </Button>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 p-0">
                  <Menu className="h-6 w-6 text-orange-800" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] p-0">
                <div className="flex h-full flex-col">
                  {/* User Profile Header */}
                  <div className="border-b p-5 bg-gradient-to-r from-orange-50 to-amber-50">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 border-2 border-orange-200">
                        <AvatarImage src="/placeholder.svg" alt="User" />
                        <AvatarFallback className="bg-gradient-to-br from-orange-400 to-amber-500 text-white">
                          <User className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-base font-medium text-orange-900">Guest User</p>
                        <Link
                          href="/auth/login"
                          className="text-sm text-white bg-orange-500 px-3 py-1 rounded-full inline-block mt-1 hover:bg-orange-600"
                          onClick={() => setMobileOpen(false)}
                        >
                          लॉगिन करें
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Menu */}
                  <div className="flex-1 overflow-auto">
                    <nav className="grid gap-1 p-3">
                      {navItems.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className={`relative text-orange-800 hover:text-orange-600 transition-colors px-3 py-2 ${
                            pathname === item.href ? "bg-orange-100 rounded-lg font-bold" : ""
                          }`}
                        >
                          <span>{item.name}</span>
                        </a>
                      ))}

                      {/* Login Options */}
                      <div className="px-2 py-3 border-t border-gray-100 mt-2">
                        <p className="text-sm font-medium text-gray-500 mb-2 px-2">लॉगिन विकल्प</p>
                        <Link
                          href="/auth/login"
                          className="text-sm text-white bg-orange-500 px-3 py-1 rounded-full inline-block mt-1 hover:bg-orange-600"
                          onClick={() => setMobileOpen(false)}
                        >
                          लॉगिन करें
                        </Link>
                      </div>
                    </nav>
                  </div>

                  {/* Language Toggle Footer */}
                  <div className="border-t p-4 bg-orange-50">
                    <TranslatorButton className="w-full" />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}

