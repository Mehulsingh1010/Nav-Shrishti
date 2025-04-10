/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
// import { motion } from "framer-motion";
import Link from "next/link"
import { Menu, Bell, User, ArrowBigRight, Globe } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"

// Add this after the imports
declare global {
  interface Window {
    googleTranslateElementInit: () => void
    google: {
      translate: {
        TranslateElement: {
          InlineLayout: {
            SIMPLE: string
            HORIZONTAL: string
            VERTICAL: string
          }
          new (options: any, element: string): any
        }
      }
    }
  }
}

export default function Navbar() {
  const [isLoginMenuOpen, setIsLoginMenuOpen] = useState(false)
  const [language, setLanguage] = useState("en")
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<{
    id: string
    name: string
    email: string
  } | null>(null)
  const [error, setError] = useState("")
  const [userRole, setUserRole] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

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
    } else if (userRole === "admin") {
      router.push("/admin")
    }
  }

  const navItems = [
    { name: "हमारे बारे में", href: "/navlinks/about" },
    { name: "उत्पाद", href: "/navlinks/products" },
    { name: "सेवाएं", href: "/navlinks/services" },
    { name: "कार्यक्रम", href: "/navlinks/events" },
    { name: "गैलरी", href: "/navlinks/gallery" },
    { name: "संपर्क", href: "/navlinks/contact" },

    // Added services as a direct nav item
  ]

  // Check if the current path matches or is a child of the given href
  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname === href || pathname.startsWith(`${href}/`)
  }

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

  // Remove the existing toggleLanguage function and replace with this:
  useEffect(() => {
    // Check if Google Translate script is already added
    if (document.querySelector('script[src*="translate.google.com/translate_a"]')) {
      return
    }

    // Create and add the Google Translate script
    const addScript = () => {
      const script = document.createElement("script")
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      script.async = true
      document.body.appendChild(script)

      // Define the global callback function
      window.googleTranslateElementInit = () => {
        if (window.google && window.google.translate) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "hi",
              includedLanguages: "en,hi",
              layout: window.google.translate.TranslateElement.InlineLayout.HORIZONTAL,
              autoDisplay: false,
            },
            "google_translate_element",
          )

          // Initialize mobile version separately
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "hi",
              includedLanguages: "en,hi",
              layout: window.google.translate.TranslateElement.InlineLayout.HORIZONTAL,
              autoDisplay: false,
            },
            "google_translate_element_mobile",
          )
        }
      }
    }

    addScript()

    return () => {
      // Cleanup - remove script when component unmounts
      if (typeof window !== "undefined" && "googleTranslateElementInit" in window) {
        delete (window as any).googleTranslateElementInit
      }
    }
  }, [])

  return (
    <nav className="fixed w-full z-50 bg-orange-50/80 border border-bottom-[2px] border-orange-500  backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Title */}
          <Link href="/" className="flex items-center gap-4 group">
            <div className="relative h-12 w-12 md:h-14 md:w-14">
              <Image
                src="/logo1.png"
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
              <Link
                key={item.name}
                href={item.href}
                className={`relative text-orange-800 hover:text-orange-600 transition-colors px-3 py-2 rounded-lg ${
                  isActiveLink(item.href) ? "bg-orange-100 font-bold text-orange-700" : ""
                }`}
              >
                <span>{item.name}</span>
                {isActiveLink(item.href) && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 rounded-full"></span>
                )}
              </Link>
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
                  className={`flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors ${
                    pathname.startsWith("/auth/login") ? "bg-orange-600 ring-2 ring-orange-300" : ""
                  }`}
                >
                  लॉगिन
                </Link>
              )}
            </div>

            {/* Language Toggle Button - Desktop */}
            <div className="ml-3 flex items-center">
              <div className="flex items-center px-1 py-1 bg-orange-100 rounded-lg border border-orange-200 hover:bg-orange-200 transition-colors">
                <Globe className="h-5 w-5 text-orange-600 mr-2" />
                <div id="google_translate_element" className="translate-button"></div>
              </div>
            </div>
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
                        {user ? (
                          <div>
                            <p className="text-base font-medium text-orange-900">{user.name}</p>
                            <button
                              onClick={() => {
                                handleDashboardRedirect()
                                setMobileOpen(false)
                              }}
                              className="text-sm text-white bg-green-500 px-3 py-1 rounded-full inline-block mt-1 hover:bg-green-600"
                            >
                              dashboard <ArrowBigRight className="inline h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div>
                            <p className="text-base font-medium text-orange-900">Guest User</p>
                            <Link
                              href="/auth/login"
                              className={`text-sm text-white bg-orange-500 px-3 py-1 rounded-full inline-block mt-1 hover:bg-orange-600 ${
                                pathname.startsWith("/auth/login") ? "bg-orange-600 ring-2 ring-orange-300" : ""
                              }`}
                              onClick={() => setMobileOpen(false)}
                            >
                              लॉगिन करें
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Navigation Menu */}
                  <div className="flex-1 overflow-auto">
                    <nav className="grid gap-1 p-3">
                      {navItems.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`relative text-orange-800 hover:text-orange-600 transition-colors px-3 py-2 rounded-lg ${
                            isActiveLink(item.href) ? "bg-orange-100 font-bold text-orange-700" : ""
                          }`}
                          onClick={() => setMobileOpen(false)}
                        >
                          <span>{item.name}</span>
                          {isActiveLink(item.href) && (
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-orange-500 rounded-full"></span>
                          )}
                        </Link>
                      ))}

                      {/* Login Options */}
                      {!user && (
                        <div className="px-2 py-3 border-t border-gray-100 mt-2">
                          <p className="text-sm font-medium text-gray-500 mb-2 px-2">लॉगिन विकल्प</p>
                          <Link
                            href="/auth/login"
                            className={`text-sm text-white bg-orange-500 px-3 py-1 rounded-full inline-block mt-1 hover:bg-orange-600 ${
                              pathname.startsWith("/auth/login") ? "bg-orange-600 ring-2 ring-orange-300" : ""
                            }`}
                            onClick={() => setMobileOpen(false)}
                          >
                            लॉगिन करें
                          </Link>
                        </div>
                      )}

                      {/* Mobile Language Selection */}
                      <div className="px-2 py-3 border-t border-gray-100 mt-2">
                        <p className="text-sm font-medium text-gray-500 mb-2 px-2">भाषा चुनें</p>
                        <div className="flex items-center px-3 py-2 bg-orange-100 rounded-lg border border-orange-200">
                          <Globe className="h-5 w-5 text-orange-600 mr-2" />
                          <div id="google_translate_element_mobile" className="translate-button-mobile w-full"></div>
                        </div>
                      </div>
                    </nav>
                  </div>

                  {/* Language Toggle Footer */}
                  <div className="border-t p-4 bg-orange-50">
                    {/* Mobile Translate Button */}
                    <div className="flex items-center px-3 py-2 bg-orange-100 rounded-lg border border-orange-200">
                      <Globe className="h-5 w-5 text-orange-600 mr-2" />
                      <div id="google_translate_element_mobile" className="translate-button-mobile"></div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Add custom styling to fix Google Translate appearance */}
      <style jsx global>{`
        /* Hide Google Translate attribution and clean up appearance */
        .goog-te-gadget {
          font-family: inherit !important;
          font-size: 0 !important; /* Hide all text */
        }
        
        .goog-te-gadget .goog-te-combo {
          margin: 0 !important;
          padding: 8px 12px !important;
          border-radius: 6px !important;
          border: 1px solid #fdba74 !important;
          background-color: white !important;
          color: #9a3412 !important;
          font-size: 16px !important;
          font-family: inherit !important;
          cursor: pointer !important;
          min-width: 140px !important;
          height: 40px !important;
          appearance: menulist !important;
          -webkit-appearance: menulist !important;
        }
        
        /* Mobile specific styling */
        .translate-button-mobile .goog-te-combo {
          width: 100% !important;
        }
        
        /* Hide all other elements except the dropdown */
        .goog-te-gadget img,
        .goog-te-gadget span {
          display: none !important;
        }
        
        /* Make sure dropdown is visible */
        .goog-te-gadget .goog-te-combo {
          display: inline-block !important;
        }
        
        /* Improve dropdown appearance */
        .goog-te-gadget .goog-te-combo:hover {
          border-color: #fb923c !important;
          box-shadow: 0 0 0 2px rgba(251, 146, 60, 0.2) !important;
        }
        
        .goog-te-gadget .goog-te-combo:focus {
          outline: none !important;
          border-color: #f97316 !important;
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.3) !important;
        }
        
        /* Improve dropdown options */
        .goog-te-menu2 {
          max-width: none !important;
          overflow: visible !important;
        }
        
        /* Fix for mobile dropdown */
        @media (max-width: 768px) {
          .goog-te-gadget .goog-te-combo {
            font-size: 16px !important;
            padding: 10px 12px !important;
            height: 44px !important;
          }
        }
      `}</style>
    </nav>
  )
}















