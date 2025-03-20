import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, ShoppingCart } from "lucide-react"
import { db } from "../../../../configs/db"
import { products } from "../../../../configs/schema"
import { eq } from "drizzle-orm"

// Define types for our data structure
type Product = {
  id: number
  productId: string
  name: string
  description: string | null
  category: string
  price: number
  availableUnits: number
  status: string
  photoUrl: string | null
}

type ProductCategory = {
  id: string
  name: string
  description: string
  products: Product[]
}

// Helper function to format price from paise to rupees
function formatPrice(price: number) {
  return `₹${(price / 100).toLocaleString("en-IN")}`
}

// Helper function to map database categories to display names and descriptions in Hindi
function getCategoryInfo(category: string): { id: string; name: string; description: string } {
  const categoryMap: Record<string, { name: string; description: string }> = {
    Agriculture: {
      name: "कृषि उत्पाद",
      description: "प्राकृतिक और जैविक कृषि उत्पाद",
    },
    Pesticides: {
      name: "कीटनाशक",
      description: "प्राकृतिक और जैविक कीटनाशक उत्पाद",
    },
    Testing: {
      name: "परीक्षण किट",
      description: "मिट्टी और पानी के परीक्षण के लिए उपकरण",
    },
    Seeds: {
      name: "बीज",
      description: "उच्च गुणवत्ता वाले जैविक बीज",
    },
    Equipment: {
      name: "उपकरण",
      description: "कृषि और बागवानी के लिए आवश्यक उपकरण",
    },
    Other: {
      name: "अन्य उत्पाद",
      description: "विविध प्राकृतिक और जैविक उत्पाद",
    },
    // Add more categories as needed
  }

  return {
    id: category.toLowerCase(),
    name: categoryMap[category]?.name || category,
    description: categoryMap[category]?.description || "प्राकृतिक और जैविक उत्पाद",
  }
}

export default async function ProductsPage() {
  // Fetch all available products from the database
  const allProducts = await db.query.products.findMany({
    where: eq(products.status, "available"),
  })

  // Group products by category
  const productsByCategory = allProducts.reduce((acc: Record<string, Product[]>, product) => {
    if (!acc[product.category]) {
      acc[product.category] = []
    }
    acc[product.category].push(product)
    return acc
  }, {})

  // Create category objects with products
  const productCategories: ProductCategory[] = Object.keys(productsByCategory).map((category) => {
    const categoryInfo = getCategoryInfo(category)
    return {
      id: categoryInfo.id,
      name: categoryInfo.name,
      description: categoryInfo.description,
      products: productsByCategory[category],
    }
  })

  // Get featured products (for example, taking 3 random products)
  const featuredProducts = allProducts
    .sort(() => 0.5 - Math.random()) // Simple random shuffle
    .slice(0, 3)

  // Default to first category if available
  const defaultCategory = productCategories.length > 0 ? productCategories[0].id : "other"

  return (
    <div className="flex flex-col  min-h-screen">
      {/* Hero section with improved gradient background */}
      <section className="bg-gradient-to-r from-orange-100 to-orange-50 py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-orange-800">हमारे उत्पाद</h1>
            <p className="max-w-[700px] text-gray-700 md:text-xl leading-relaxed">
              पारंपरिक और आयुर्वेदिक उत्पादों की विस्तृत श्रृंखला जो आपके स्वास्थ्य और कल्याण के लिए लाभदायक हैं
            </p>
            <div className="w-24 h-1 bg-orange-500 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Products section with improved tabs and card design */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          {productCategories.length > 0 ? (
            <Tabs defaultValue={defaultCategory} className="w-full">
              <div className="mb-8 flex justify-center">
                <div className="overflow-x-auto pb-4 max-w-full">
                  <TabsList className="inline-flex flex-nowrap p-1 bg-orange-50 border border-orange-200 rounded-lg">
                    {productCategories.map((category) => (
                      <TabsTrigger key={category.id} value={category.id} className="px-4 py-2 whitespace-nowrap">
                        {category.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
              </div>

              {productCategories.map((category) => (
                <TabsContent key={category.id} value={category.id} className="pt-4">
                  <div className="max-w-5xl mx-auto">
                    <div className="bg-orange-50 p-6 rounded-lg border border-orange-200 mb-8 shadow-sm">
                      <h2 className="text-2xl font-bold text-orange-800 mb-2">{category.name}</h2>
                      <p className="text-gray-700">{category.description}</p>
                    </div>

                    {category.products.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {category.products.map((product) => (
                          <Card
                            key={product.id}
                            className="border-orange-200 shadow-md hover:shadow-lg transition-all hover:border-orange-300"
                          >
                            <CardHeader className="p-0">
                              <div className="relative">
                                <Image
                                  src={product.photoUrl || "/placeholder.svg?height=200&width=300"}
                                  alt={product.name}
                                  width={300}
                                  height={200}
                                  className="rounded-t-lg object-cover h-48 w-full"
                                />
                                {product.availableUnits < 10 && (
                                  <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                                    सीमित स्टॉक
                                  </div>
                                )}
                                {product.availableUnits >= 10 && (
                                  <div className="absolute top-2 right-2 bg-orange-600 text-white text-xs px-2 py-1 rounded-full">
                                    उपलब्ध
                                  </div>
                                )}
                              </div>
                            </CardHeader>
                            <CardContent className="p-6">
                              <CardTitle className="text-xl font-bold text-orange-800 mb-2">{product.name}</CardTitle>
                              <CardDescription className="text-gray-700 mb-2">
                                {product.description && product.description.length > 100
                                  ? `${product.description.substring(0, 100)}...`
                                  : product.description || ""}
                              </CardDescription>
                              <p className="text-lg font-semibold text-orange-600">{formatPrice(product.price)}</p>
                            </CardContent>
                            <CardFooter className="p-6 pt-0">
                              <Button
                                className="w-full bg-orange-600 hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
                                asChild
                              >
                                <Link href={`/navlinks/products/${product.productId}`}>
                                  <ShoppingCart className="h-4 w-4" />
                                  अभी खरीदें
                                </Link>
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-orange-50 rounded-lg border border-orange-200">
                        <p className="text-orange-800">इस श्रेणी में कोई उत्पाद उपलब्ध नहीं है</p>
                      </div>
                    )}

                    {category.products.length > 3 && (
                      <div className="mt-8 text-center">
                        <Button asChild className="bg-orange-600 hover:bg-orange-700 transition-colors">
                          <Link href={`/products/category/${category.id}`}>
                            सभी {category.name} देखें <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="text-center py-12 bg-orange-50 rounded-lg border border-orange-200 max-w-3xl mx-auto">
              <p className="text-orange-800 text-lg">अभी कोई उत्पाद उपलब्ध नहीं है। कृपया बाद में पुनः जांचें।</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-gradient-to-r from-orange-50 to-orange-100">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-6 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-orange-800">विशेष उत्पाद</h2>
              <p className="max-w-[700px] text-gray-700 md:text-xl">
                हमारे सबसे लोकप्रिय और अनुशंसित उत्पाद जो आपके स्वास्थ्य और कल्याण के लिए विशेष रूप से चुने गए हैं
              </p>
              <div className="w-24 h-1 bg-orange-500 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {featuredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="border-orange-200 shadow-md hover:shadow-lg transition-all hover:border-orange-300"
                >
                  <CardHeader className="p-0">
                    <div className="relative">
                      <Image
                        src={product.photoUrl || "/placeholder.svg?height=300&width=400"}
                        alt={product.name}
                        width={400}
                        height={300}
                        className="rounded-t-lg object-cover h-56 w-full"
                      />
                      <div className="absolute top-2 right-2 bg-orange-600 text-white text-xs px-2 py-1 rounded-full">
                        बेस्टसेलर
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <CardTitle className="text-xl font-bold text-orange-800 mb-2">{product.name}</CardTitle>
                    <p className="text-orange-600 font-medium text-lg mb-2">{formatPrice(product.price)}</p>
                    <CardDescription className="text-gray-700">
                      {product.description || "प्राकृतिक और जैविक उत्पाद जो आपके स्वास्थ्य के लिए लाभदायक है।"}
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Button
                      className="w-full bg-orange-600 hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
                      asChild
                    >
                      <Link href={`/navlinks/products/${product.productId}`}>
                        <ShoppingCart className="h-4 w-4" />
                        अभी खरीदें
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

