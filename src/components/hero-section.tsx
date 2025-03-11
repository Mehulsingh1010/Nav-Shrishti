"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: { clientX: number; clientY: number }) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const images = [
    { 
      src: "/1.jpg", 
      title: "गुरुकुल शिक्षा",
      description: "पारंपरिक शिक्षा का आधुनिक दृष्टिकोण"
    },
    { 
      src: "/2.jpg", 
      title: "योग साधना",
      description: "शारीरिक और मानसिक स्वास्थ्य का मार्ग"
    },
    { 
      src: "/3.jpg", 
      title: "मंदिर संस्कृति",
      description: "आध्यात्मिक विरासत का संरक्षण"
    }
  ]

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-orange-100/30 to-orange-50 pt-20 overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-[url('/mandala-pattern.svg')] opacity-5"
          style={{
            transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
            transition: 'transform 0.3s ease-out'
          }}
        />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Content */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-block px-4 py-2 bg-orange-100 rounded-lg text-orange-800 font-medium">वैदिक संस्कृति का पुनरुत्थान</span>
            <h1 className="text-5xl lg:text-7xl font-bold text-orange-900 leading-tight mt-4">
              वैदिक भारत के
              <span className="block text-orange-700">निर्माण के लिये</span>
            </h1>
            <p className="text-lg text-orange-800 mt-6 max-w-lg">हम आपका स्वागत करते हैं</p>
          </motion.div>

          {/* Right Column - Image Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4 relative">
              {images.map((image, index) => (
                <motion.div
                  key={image.src}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.2 }}
                  className={`group relative ${index === 2 ? "col-span-2" : ""}`}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className="relative h-64 rounded-2xl overflow-hidden">
                    <Image
                      src={image.src}
                      alt={image.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-xl font-bold text-white mb-2">{image.title}</h3>
                        <p className="text-white/90 text-sm">{image.description}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Decorative Elements */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full bg-orange-200 blur-3xl opacity-60"
            />
          </motion.div>
        </div>
      </div>

      {/* Floating Decorative Elements */}
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute top-40 right-20 w-16 h-16 rounded-full border-4 border-orange-200 opacity-30"
      />
      <motion.div
        animate={{
          y: [0, 10, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute bottom-40 left-20 w-20 h-20 rounded-full border-4 border-orange-300 opacity-30"
      />
    </div>
  )
}