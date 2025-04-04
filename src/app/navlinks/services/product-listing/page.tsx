/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ProductSvgIllustration } from "@/components/product-svg-illustration"

// Cultural product categories with descriptions
const productCategories = [
  {
    id: "copper-vessels",
    name: "ताम्र पात्र",
    description: "शुद्ध तांबे के बर्तन",
    englishName: "Copper Vessels",
    englishDescription: "Pure copper utensils for wellness",
    featured: true,
    svgType: "copper-vessel",
  },
  {
    id: "books",
    name: "पुस्तकें",
    description: "प्राचीन ज्ञान और साहित्य",
    englishName: "Sacred Books",
    englishDescription: "Ancient knowledge and literature",
    featured: false,
    svgType: "sacred-book",
  },
  {
    id: "pooja-items",
    name: "पूजन सामग्री",
    description: "दैनिक पूजा की आवश्यक वस्तुएँ",
    englishName: "Pooja Items",
    englishDescription: "Essential items for daily worship",
    featured: true,
    svgType: "pooja-items",
  },
  {
    id: "havan-items",
    name: "हवन सामग्री",
    description: "शुद्ध यज्ञ सामग्री",
    englishName: "Havan Materials",
    englishDescription: "Pure materials for sacred fire rituals",
    featured: false,
    svgType: "havan-items",
  },
  {
    id: "clothing",
    name: "पोशाक",
    description: "पारंपरिक भारतीय परिधान",
    englishName: "Traditional Clothing",
    englishDescription: "Traditional Indian attire",
    featured: false,
    svgType: "traditional-clothing",
  },
  {
    id: "malas",
    name: "मालाएं",
    description: "जप के लिए पवित्र मालाएं",
    englishName: "Sacred Malas",
    englishDescription: "Prayer beads for meditation",
    featured: false,
    svgType: "sacred-mala",
  },
  {
    id: "murtis",
    name: "मूर्तियां",
    description: "देवी-देवताओं की पवित्र मूर्तियां",
    englishName: "Sacred Idols",
    englishDescription: "Divine statues and idols",
    featured: true,
    svgType: "sacred-idol",
  },
  {
    id: "prasad",
    name: "प्रसाद",
    description: "शुद्ध और पौष्टिक प्रसाद",
    englishName: "Prasad",
    englishDescription: "Pure and nutritious offerings",
    featured: false,
    svgType: "prasad",
  },
  {
    id: "sacred-water",
    name: "पवित्र सरिता नीर",
    description: "गंगा, यमुना और अन्य पवित्र जल",
    englishName: "Sacred River Water",
    englishDescription: "Ganga, Yamuna and other holy water",
    featured: false,
    svgType: "sacred-water",
  },
  {
    id: "flags",
    name: "ध्वजा",
    description: "मंदिर और पूजा के लिए ध्वजा",
    englishName: "Sacred Flags",
    englishDescription: "Flags for temples and worship",
    featured: false,
    svgType: "sacred-flag",
  },
  {
    id: "fragrances",
    name: "सुगंधित इत्र",
    description: "प्राकृतिक सुगंध और इत्र",
    englishName: "Natural Fragrances",
    englishDescription: "Natural scents and perfumes",
    featured: false,
    svgType: "fragrance",
  },
  {
    id: "havan-kund",
    name: "हवन कुंड",
    description: "विभिन्न प्रकार के हवन कुंड",
    englishName: "Havan Kunds",
    englishDescription: "Various types of sacred fire vessels",
    featured: true,
    svgType: "havan-kund",
  },
  {
    id: "samidha",
    name: "समिधा",
    description: "हवन के लिए पवित्र लकड़ी",
    englishName: "Sacred Wood",
    englishDescription: "Sacred wood for fire rituals",
    featured: false,
    svgType: "sacred-wood",
  },
  {
    id: "ghee",
    name: "शुद्ध गाय का घी",
    description: "हवन और सेवन के लिए",
    englishName: "Pure Cow Ghee",
    englishDescription: "For rituals and consumption",
    featured: true,
    svgType: "cow-ghee",
  },
  {
    id: "cowdung",
    name: "कंडे",
    description: "हवन के लिए उपकरण",
    englishName: "Cow Dung Cakes",
    englishDescription: "For sacred fire rituals",
    featured: false,
    svgType: "cowdung-cake",
  },
  {
    id: "gaumutra",
    name: "गौ मूत्र",
    description: "आयुर्वेदिक औषधि",
    englishName: "Cow Urine",
    englishDescription: "Ayurvedic medicine",
    featured: false,
    svgType: "gaumutra",
  },
  {
    id: "dhoop",
    name: "धूप बत्ती",
    description: "प्राकृतिक सुगंधित धूप",
    englishName: "Incense Sticks",
    englishDescription: "Natural aromatic incense",
    featured: false,
    svgType: "dhoop",
  },
  {
    id: "agarbatti",
    name: "अगरबत्ती",
    description: "विभिन्न प्रकार की अगरबत्ती",
    englishName: "Agarbatti",
    englishDescription: "Various types of incense sticks",
    featured: false,
    svgType: "agarbatti",
  },
]

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState("grid") // "grid" or "list"

  // Filter products based on search term
  const filteredProducts = productCategories.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.englishDescription.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Get featured products
  const featuredProducts = productCategories.filter((product) => product.featured)

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
              हमारे सांस्कृतिक उत्पाद
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg md:text-xl text-orange-100 mb-8"
            >
              भारतीय परंपरा और संस्कृति के अनमोल खज़ाने
            </motion.p>

            <div className="relative max-w-2xl mx-auto">
              <Input
                type="text"
                placeholder="उत्पाद खोजें... (Search Products)"
                className="pl-10 py-6 bg-white/90 text-orange-900 ring-offset-orange-600 focus-visible:ring-orange-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-600" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products Slider - Only show if not searching */}
      {!searchTerm && (
        <div className="py-12 bg-orange-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-orange-900">प्रमुख श्रेणियां</h2>
              <Link href="#all-products" className="text-orange-700 hover:text-orange-800 flex items-center">
                सभी देखें <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {featuredProducts.map((product) => (
                <motion.div key={product.id} whileHover={{ y: -5, scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <Link href={`/products/${product.id}`}>
                    <Card className="overflow-hidden h-full shadow-md hover:shadow-lg transition-shadow bg-white">
                      <div className="relative h-48 bg-orange-50 flex items-center justify-center">
                        <ProductSvgIllustration svgType={product.svgType} className="w-full h-full p-2" />
                        <Badge className="absolute top-2 right-2 bg-orange-600">प्रमुख</Badge>
                      </div>
                      <CardContent className="pt-4">
                        <h3 className="text-xl font-bold text-orange-900">{product.name}</h3>
                        <p className="text-sm text-gray-600">{product.englishName}</p>
                        <p className="mt-2 text-orange-700 text-sm">{product.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* All Products */}
      <div id="all-products" className="py-12 container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-orange-900">
            {searchTerm ? `खोज परिणाम: "${searchTerm}" (${filteredProducts.length})` : "सभी उत्पाद श्रेणियां"}
          </h2>

          <div className="flex space-x-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              className={viewMode === "grid" ? "bg-orange-700 hover:bg-orange-800" : "text-orange-700"}
              onClick={() => setViewMode("grid")}
              size="sm"
            >
              Grid
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              className={viewMode === "list" ? "bg-orange-700 hover:bg-orange-800" : "text-orange-700"}
              onClick={() => setViewMode("list")}
              size="sm"
            >
              List
            </Button>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-600">कोई परिणाम नहीं मिला</h3>
            <p className="text-gray-500 mt-2">कृपया अपनी खोज बदलें या सभी श्रेणियां देखें</p>
            <Button className="mt-4 bg-orange-700 hover:bg-orange-800" onClick={() => setSearchTerm("")}>
              सभी श्रेणियां दिखाएं
            </Button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="h-full"
              >
                <Link href={`/products/${product.id}`}>
                  <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow bg-white">
                    <div className="h-48 relative bg-orange-50 flex items-center justify-center">
                      <ProductSvgIllustration svgType={product.svgType} className="w-full h-full p-2" />
                      {product.featured && <Badge className="absolute top-2 right-2 bg-orange-600">प्रमुख</Badge>}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg text-orange-900">{product.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{product.englishName}</p>
                      <p className="text-orange-700 text-sm">{product.description}</p>
                      <p className="text-gray-500 text-xs">{product.englishDescription}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link href={`/products/${product.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-white">
                    <div className="flex flex-col md:flex-row h-full">
                      <div className="w-full md:w-1/4 h-48 md:h-auto relative bg-orange-50 flex items-center justify-center">
                        <ProductSvgIllustration svgType={product.svgType} className="w-full h-full p-4" />
                        {product.featured && <Badge className="absolute top-2 right-2 bg-orange-600">प्रमुख</Badge>}
                      </div>
                      <CardContent className="p-4 md:p-6 w-full md:w-3/4 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-xl text-orange-900">{product.name}</h3>
                              <p className="text-sm text-gray-600">{product.englishName}</p>
                            </div>
                            {product.featured && <Badge className="bg-orange-600 ml-2 md:hidden">प्रमुख</Badge>}
                          </div>
                          <p className="mt-2 text-orange-700">{product.description}</p>
                          <p className="text-gray-500 text-sm">{product.englishDescription}</p>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <Button className="bg-orange-700 hover:bg-orange-800">विवरण देखें</Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

