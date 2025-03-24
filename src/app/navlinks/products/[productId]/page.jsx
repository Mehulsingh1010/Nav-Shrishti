/* eslint-disable @typescript-eslint/no-unused-vars */
import Image from "next/image"
import { notFound } from "next/navigation"
import { db } from "../../../../../configs/db"
import { products, users } from "../../../../../configs/schema"
import { eq } from "drizzle-orm"
import { Button } from "@/components/ui/button"
import { ShoppingCart, ArrowLeft } from "lucide-react"
import Link from "next/link"

// Helper function to format price from paise to rupees
function formatPrice(price) {
  return `₹${(price / 100).toLocaleString("en-IN")}`
}

export default async function ProductDetailPage({ params }) {
  // Unwrap params since it's now a Promise in Next.js 15
  const unwrappedParams = await params
  const productId = unwrappedParams.productId

  // Fetch the product by productId
  const product = await db.query.products.findFirst({
    where: eq(products.productId, productId),
  })

  // If product not found, return 404
  if (!product) {
    notFound()
  }

  // Fetch the seller information using the sellerId from the product
  let sellerName = "Unknown Seller"
  let sellerRating = 0
  let sellerSales = 0

  try {
    const seller = await db.query.users.findFirst({
      where: eq(users.id, product.sellerId),
    })

    if (seller) {
      sellerName = seller.firstName || "Unknown"
      // You might want to calculate these from other tables
      sellerRating = 4.5 // Placeholder or could be calculated
      sellerSales = 120 // Placeholder or could be calculated
    }
  } catch (error) {
    console.error("Error fetching seller information:", error)
    // Continue with default values if there's an error
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <Link href="/products" className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        सभी उत्पादों पर वापस जाएं
      </Link>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="bg-white rounded-lg overflow-hidden border border-orange-200 shadow-md">
          <Image
            src={product.photoUrl || "/placeholder.svg?height=600&width=600"}
            alt={product.name}
            width={600}
            height={600}
            className="w-full h-auto object-cover"
            priority
          />
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-orange-800 mb-2">{product.name}</h1>
            <p className="text-2xl font-semibold text-orange-600 mb-4">{formatPrice(product.price)}</p>

            <div className="flex items-center space-x-2 mb-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.status === "available" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {product.status === "available" ? "उपलब्ध" : "स्टॉक में नहीं"}
              </span>

              <span className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                {product.category}
              </span>
            </div>
          </div>

          <div className="border-t border-b border-orange-200 py-6">
            <h2 className="text-xl font-semibold text-orange-800 mb-3">विवरण</h2>
            <p className="text-gray-700 leading-relaxed">
              {product.description || "इस उत्पाद का कोई विवरण उपलब्ध नहीं है।"}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">उपलब्ध मात्रा:</span>
              <span className="font-medium">{product.availableUnits}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700">उत्पाद आईडी:</span>
              <span className="font-medium">{product.productId}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700">विक्रेता:</span>
              <span className="font-medium">{sellerName}</span>
            </div>
          </div>

          <div className="pt-6 space-y-4">
            <Button
              className="w-full bg-orange-600 hover:bg-orange-700 transition-colors h-12 text-lg"
              disabled={product.status !== "available" || product.availableUnits <= 0}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              कार्ट में जोड़ें
            </Button>

            <Link href={`navlinks/checkout/${product.productId}`}>
              <Button
                variant="outline"
                className="w-full border-orange-200 text-orange-700 hover:bg-orange-50 transition-colors h-12 text-lg"
              >
                अभी खरीदें
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Related Products section would go here */}
    </div>
  )
}

