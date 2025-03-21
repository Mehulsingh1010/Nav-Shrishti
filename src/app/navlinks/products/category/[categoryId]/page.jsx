import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "../../../../../../configs/db";
import { products } from "../../../../../../configs/schema";
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, ArrowLeft } from "lucide-react";

// Helper function to format price from paise to rupees
function formatPrice(price) {
  return `₹${(price / 100).toLocaleString("en-IN")}`;
}

// Helper function to map database categories to display names and descriptions in Hindi
function getCategoryInfo(categoryId) {
  const categoryMap = {
    agriculture: {
      name: "कृषि उत्पाद",
      description: "प्राकृतिक और जैविक कृषि उत्पाद",
    },
    pesticides: {
      name: "कीटनाशक",
      description: "प्राकृतिक और जैविक कीटनाशक उत्पाद",
    },
    testing: {
      name: "परीक्षण किट",
      description: "मिट्टी और पानी के परीक्षण के लिए उपकरण",
    },
    seeds: {
      name: "बीज",
      description: "उच्च गुणवत्ता वाले जैविक बीज",
    },
    equipment: {
      name: "उपकरण",
      description: "कृषि और बागवानी के लिए आवश्यक उपकरण",
    },
    other: {
      name: "अन्य उत्पाद",
      description: "विविध प्राकृतिक और जैविक उत्पाद",
    },
    // Add more categories as needed
  };

  return categoryMap[categoryId] || null;
}

export default async function CategoryPage({ params }) {
  // Get category info
  const categoryInfo = getCategoryInfo(params.categoryId);

  if (!categoryInfo) {
    notFound();
  }

  // Convert categoryId back to database category format (first letter uppercase)
  const dbCategory = params.categoryId.charAt(0).toUpperCase() + params.categoryId.slice(1);

  // Fetch products for this category
  const categoryProducts = await db.query.products.findMany({
    where: eq(products.category, dbCategory),
  });

  return (
    <div className="container  mx-auto px-4 py-12 max-w-6xl">
      <Link href="/products" className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        सभी श्रेणियों पर वापस जाएं
      </Link>

      <div className="bg-orange-50 p-6 rounded-lg border border-orange-200 mb-12 shadow-sm">
        <h1 className="text-3xl font-bold text-orange-800 mb-2">{categoryInfo.name}</h1>
        <p className="text-gray-700 max-w-3xl">{categoryInfo.description}</p>
      </div>

      {categoryProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categoryProducts.map((product) => (
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
                  <Link href={`/products/${product.productId}`}>
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
          <p className="text-orange-800 text-lg">इस श्रेणी में कोई उत्पाद उपलब्ध नहीं है। कृपया बाद में पुनः जांचें।</p>
        </div>
      )}
    </div>
  );
}
