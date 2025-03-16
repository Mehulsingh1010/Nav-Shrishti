/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Menu, X, ChevronDown, Clock, Bell, User } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLoginMenuOpen, setIsLoginMenuOpen] = useState(false)
  const [language, setLanguage] = useState("en")
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = [
    { name: "उत्पाद", href: "/navlinks/products" },
    { name: "संपर्क", href: "/navlinks/contact" },
    { name: "कार्यक्रम", href: "/navlinks/events" },
    { name: "गैलरी", href: "/navlinks/gallery" },
    { name: "हमारे बारे में", href: "/navlinks/about" }
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleLanguage = async () => {
    const targetLang = language === "en" ? "hi" : "en";
    setLanguage(targetLang);
  
    try {
      const res = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=YOUR_API_KEY`,
        {
          method: "POST",
          body: JSON.stringify({
            q: document.body.innerText,
            target: targetLang,
          }),
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await res.json();
      document.body.innerText = data.data.translations[0].translatedText;
    } catch (error) {
      console.error("Translation failed:", error);
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/90 backdrop-blur-md shadow-lg" 
          : "bg-orange-50/80 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Title */}
          <Link href="/" className="flex items-center gap-4 group">
            <motion.div 
              whileHover={{ rotate: 360 }} 
              transition={{ duration: 1 }}
              className="relative h-12 w-12 md:h-14 md:w-14"
            >
              <Image
                src="/logo.png"
                alt="संस्थान लोगो"
                fill
                className="rounded-full object-cover shadow-md group-hover:shadow-lg transition-shadow"
              />
            </motion.div>
            <div className="flex flex-col">
              <h1 className="text-lg md:text-2xl font-bold text-orange-800 group-hover:text-orange-600 transition-colors">
                नव सृष्टि सृजन
              </h1>
              <span className="text-sm text-orange-600/80 hidden md:block">
                सेवा संस्थान
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                whileHover={{ scale: 1.05 }}
                className="relative text-orange-800 hover:text-orange-600 transition-colors px-3 py-2"
              >
                <span>{item.name}</span>
              </motion.a>
            ))}

            {/* Login Dropdown */}
            <div className="relative group">
              
                <Link
                href="/auth/login"
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                लॉगिन
                </Link>
            </div>

            {/* Language Toggle Button */}
            <button
              onClick={toggleLanguage}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              {language === "en" ? "हिन्दी" : "English"}
            </button>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            <Button variant="ghost" size="icon" className="text-orange-600 relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-orange-500">2</Badge>
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
                          href="/login/user"
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
                        <Button
                          key={item.name}
                          variant="ghost"
                          className="w-full justify-start py-3 text-base hover:bg-orange-100"
                          onClick={() => setMobileOpen(false)}
                          asChild
                        >
                          <a href={item.href}>
                            {item.name}
                          </a>
                        </Button>
                      ))}
                      
                      {/* Login Options */}
                      <div className="px-2 py-3 border-t border-gray-100 mt-2">
                        <p className="text-sm font-medium text-gray-500 mb-2 px-2">लॉगिन विकल्प</p>
                        <Link
                          href="/login/user"
                          className="flex w-full px-4 py-2 hover:bg-orange-100 text-orange-800 rounded-lg transition-colors"
                          onClick={() => setMobileOpen(false)}
                        >
                          लॉगिन (उपयोगकर्ता)
                        </Link>
                        <Link
                          href="/login/seller"
                          className="flex w-full px-4 py-2 hover:bg-orange-100 text-orange-800 rounded-lg transition-colors"
                          onClick={() => setMobileOpen(false)}
                        >
                          लॉगिन (विक्रेता)
                        </Link>
                      </div>
                    </nav>
                  </div>
                  
                  {/* Language Toggle Footer */}
                  <div className="border-t p-4 bg-orange-50">
                    <button
                      onClick={() => {
                        toggleLanguage();
                        setMobileOpen(false);
                      }}
                      className="w-full px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors text-center"
                    >
                      {language === "en" ? "हिन्दी" : "English"}
                    </button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}