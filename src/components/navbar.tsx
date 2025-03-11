"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Menu, X, ChevronDown } from "lucide-react"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoginMenuOpen, setIsLoginMenuOpen] = useState(false)
  const [language, setLanguage] = useState("en")

  const navItems = [
    { name: "गुरुकुल", href: "#gurukul" },
    { name: "धर्म", href: "#dharm" },
    { name: "योग", href: "#yoga" },
    { name: "संपर्क", href: "#contact" }
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
              <button
                onClick={() => setIsLoginMenuOpen(!isLoginMenuOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                लॉगिन <ChevronDown className="w-4 h-4" />
              </button>
              <AnimatePresence>
                {isLoginMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden"
                  >
                    <Link
                      href="/login/user"
                      className="block px-4 py-2 hover:bg-gray-100 text-orange-800"
                      onClick={() => setIsLoginMenuOpen(false)}
                    >
                      लॉगिन (उपयोगकर्ता)
                    </Link>
                    <Link
                      href="/login/seller"
                      className="block px-4 py-2 hover:bg-gray-100 text-orange-800"
                      onClick={() => setIsLoginMenuOpen(false)}
                    >
                      लॉगिन (विक्रेता)
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Language Toggle Button */}
            <button
              onClick={toggleLanguage}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              {language === "en" ? "हिन्दी" : "English"}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 hover:bg-orange-100 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-orange-800" />
            ) : (
              <Menu className="w-6 h-6 text-orange-800" />
            )}
          </motion.button>
        </div>
      </div>
    </motion.nav>
  )
}