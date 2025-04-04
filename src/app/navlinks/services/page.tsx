/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Heart, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100/30 to-orange-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-orange-800 to-orange-600 text-white py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-3xl md:text-5xl font-bold mb-4"
            >
              हमारी सेवाएँ
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg md:text-xl text-orange-100 mb-8"
            >
              आध्यात्मिक मार्गदर्शन और सांस्कृतिक उत्पाद
            </motion.p>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-16 container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-orange-900 text-center mb-12">
          हमारी प्रमुख सेवाएँ
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Ashram Box */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Link href="/navlinks/services/aashram">
              <Card className="overflow-hidden h-full shadow-md hover:shadow-xl transition-all duration-300 bg-white">
                <div className="relative h-64 bg-orange-100 flex items-center justify-center overflow-hidden">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full"
                  >
                    <div className="absolute inset-0 bg-orange-800/20 z-10" />
                    <img 
                      src="/1.jpg" 
                      alt="Ashram Services" 
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <Badge className="absolute top-4 left-4 z-20 bg-orange-600 px-3 py-1">
                    आध्यात्मिक
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Heart className="h-5 w-5 text-orange-600 mr-2" />
                    <h3 className="text-2xl font-bold text-orange-900">आश्रम सेवाएँ</h3>
                  </div>
                  <p className="text-gray-700 mb-4">
                    हमारे आश्रम में आध्यात्मिक मार्गदर्शन, योग, ध्यान, और सत्संग के माध्यम से आंतरिक शांति और सद्भाव का अनुभव करें।
                  </p>
                  <p className="text-gray-600 mb-6">
                    Experience inner peace and harmony through spiritual guidance, yoga, meditation, and satsang at our ashram.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-orange-700 font-medium">रोज़ाना सुबह 5 बजे से</span>
                    <Button className="bg-orange-700 hover:bg-orange-800 flex items-center">
                      विवरण देखें <ArrowRight size={16} className="ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>

          {/* Products Box */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <Link href="/navlinks/services/product-listing">
              <Card className="overflow-hidden h-full shadow-md hover:shadow-xl transition-all duration-300 bg-white">
                <div className="relative h-64 bg-orange-100 flex items-center justify-center overflow-hidden">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full"
                  >
                    <div className="absolute inset-0 bg-orange-800/20 z-10" />
                    <img 
                      src="/10.png" 
                      alt="Cultural Products" 
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <Badge className="absolute top-4 left-4 z-20 bg-orange-600 px-3 py-1">
                    सांस्कृतिक
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <ShoppingBag className="h-5 w-5 text-orange-600 mr-2" />
                    <h3 className="text-2xl font-bold text-orange-900">सांस्कृतिक उत्पाद</h3>
                  </div>
                  <p className="text-gray-700 mb-4">
                    पारंपरिक पूजन सामग्री, आयुर्वेदिक उत्पाद, ताम्र पात्र, और अन्य सांस्कृतिक वस्तुओं का विशाल संग्रह।
                  </p>
                  <p className="text-gray-600 mb-6">
                    Vast collection of traditional worship materials, Ayurvedic products, copper vessels, and other cultural items.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-orange-700 font-medium">18+ श्रेणियां उपलब्ध</span>
                    <Button className="bg-orange-700 hover:bg-orange-800 flex items-center">
                      उत्पाद देखें <ArrowRight size={16} className="ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Additional Benefits */}
      <div className="py-16 bg-orange-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-orange-900 text-center mb-10">विशेष लाभ</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Benefit 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-700">
                  <path d="M12 2v20M2 12h20"></path>
                </svg>
              </div>
              <h3 className="font-bold text-lg text-orange-900 mb-2">स्वास्थ्य लाभ</h3>
              <p className="text-gray-600">आयुर्वेदिक ज्ञान और प्राकृतिक उत्पादों के माध्यम से बेहतर स्वास्थ्य पाएं</p>
            </motion.div>

            {/* Benefit 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-700">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 6v6l4 2"></path>
                </svg>
              </div>
              <h3 className="font-bold text-lg text-orange-900 mb-2">समय की बचत</h3>
              <p className="text-gray-600">सभी धार्मिक और आध्यात्मिक आवश्यकताएँ एक ही स्थान पर</p>
            </motion.div>

            {/* Benefit 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-700">
                  <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
                </svg>
              </div>
              <h3 className="font-bold text-lg text-orange-900 mb-2">आंतरिक शांति</h3>
              <p className="text-gray-600">प्राचीन भारतीय विधियों से मन और आत्मा को शांति प्रदान करें</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      {/* <div className="py-16 container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-orange-900 mb-4">
            आज ही हमारी सेवाओं का लाभ उठाएं
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            आध्यात्मिक मार्गदर्शन और सांस्कृतिक उत्पादों के माध्यम से अपने जीवन को समृद्ध बनाएं
          </p>
          <div className="flex justify-center space-x-4 flex-wrap">
            <Button className="bg-orange-700 hover:bg-orange-800 mb-2 sm:mb-0">
              आश्रम भ्रमण करें
            </Button>
            <Button variant="outline" className="border-orange-700 text-orange-700 hover:bg-orange-50">
              उत्पाद देखें
            </Button>
          </div>
        </div> */}
      {/* </div> */}
    </div>
  )
}