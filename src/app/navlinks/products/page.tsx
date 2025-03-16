import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, ShoppingCart } from 'lucide-react'

export default function ProductsPage() {
  const productCategories = [
    {
      id: "worship",
      name: "पूजा सामग्री",
      description: "पारंपरिक पूजा और अनुष्ठान के लिए सामग्री",
      products: [
        {
          name: "पूजा थाली सेट",
          price: "₹1,200",
          image: "/placeholder.svg?height=200&width=300"
        },
        {
          name: "धूप और अगरबत्ती",
          price: "₹150",
          image: "/placeholder.svg?height=200&width=300"
        },
        {
          name: "पूजा घंटी",
          price: "₹450",
          image: "/placeholder.svg?height=200&width=300"
        }
      ]
    },
    {
      id: "books",
      name: "पुस्तकें",
      description: "वेद, उपनिषद और अन्य पारंपरिक ज्ञान की पुस्तकें",
      products: [
        {
          name: "संपूर्ण वेद संग्रह",
          price: "₹2,500",
          image: "/placeholder.svg?height=200&width=300"
        },
        {
          name: "भगवद गीता",
          price: "₹350",
          image: "/placeholder.svg?height=200&width=300"
        },
        {
          name: "योग शास्त्र",
          price: "₹650",
          image: "/placeholder.svg?height=200&width=300"
        }
      ]
    },
    {
      id: "home-care",
      name: "घरेलू देखभाल",
      description: "प्राकृतिक और आयुर्वेदिक घरेलू उत्पाद",
      products: [
        {
          name: "हर्बल फ्लोर क्लीनर",
          price: "₹220",
          image: "/placeholder.svg?height=200&width=300"
        },
        {
          name: "अरोमा डिफ्यूज़र",
          price: "₹850",
          image: "/placeholder.svg?height=200&width=300"
        },
        {
          name: "कपूर दीप",
          price: "₹180",
          image: "/placeholder.svg?height=200&width=300"
        }
      ]
    },
    {
      id: "health-care",
      name: "स्वास्थ्य देखभाल",
      description: "आयुर्वेदिक स्वास्थ्य उत्पाद",
      products: [
        {
          name: "चवनप्राश",
          price: "₹450",
          image: "/placeholder.svg?height=200&width=300"
        },
        {
          name: "त्रिफला चूर्ण",
          price: "₹180",
          image: "/placeholder.svg?height=200&width=300"
        },
        {
          name: "अश्वगंधा कैप्सूल",
          price: "₹320",
          image: "/placeholder.svg?height=200&width=300"
        }
      ]
    },
    {
      id: "personal-care",
      name: "व्यक्तिगत देखभाल",
      description: "प्राकृतिक व्यक्तिगत देखभाल उत्पाद",
      products: [
        {
          name: "हर्बल शैम्पू",
          price: "₹280",
          image: "/placeholder.svg?height=200&width=300"
        },
        {
          name: "आयुर्वेदिक साबुन",
          price: "₹120",
          image: "/placeholder.svg?height=200&width=300"
        },
        {
          name: "नीम फेस वॉश",
          price: "₹180",
          image: "/placeholder.svg?height=200&width=300"
        }
      ]
    },
    {
      id: "beauty-care",
      name: "सौंदर्य देखभाल",
      description: "प्राकृतिक सौंदर्य उत्पाद",
      products: [
        {
          name: "केसर क्रीम",
          price: "₹350",
          image: "/placeholder.svg?height=200&width=300"
        },
        {
          name: "मुलतानी मिट्टी",
          price: "₹120",
          image: "/placeholder.svg?height=200&width=300"
        },
        {
          name: "रोज़ वाटर",
          price: "₹150",
          image: "/placeholder.svg?height=200&width=300"
        }
      ]
    },
    {
      id: "garments",
      name: "वस्त्र",
      description: "पारंपरिक भारतीय वस्त्र",
      products: [
        {
          name: "खादी कुर्ता",
          price: "₹850",
          image: "/placeholder.svg?height=200&width=300"
        },
        {
          name: "हस्तनिर्मित साड़ी",
          price: "₹1,800",
          image: "/placeholder.svg?height=200&width=300"
        },
        {
          name: "धोती",
          price: "₹450",
          image: "/placeholder.svg?height=200&width=300"
        }
      ]
    },
    {
      id: "food-products",
      name: "खाद्य उत्पाद",
      description: "जैविक और पारंपरिक खाद्य उत्पाद",
      products: [
        {
          name: "गौ घी",
          price: "₹750",
          image: "/placeholder.svg?height=200&width=300"
        },
        {
          name: "जैविक शहद",
          price: "₹380",
          image: "/placeholder.svg?height=200&width=300"
        },
        {
          name: "पंचामृत",
          price: "₹220",
          image: "/placeholder.svg?height=200&width=300"
        }
      ]
    }
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero section with improved gradient background */}
      <section className="bg-gradient-to-r from-orange-100 to-orange-50 py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-orange-800">
              हमारे उत्पाद
            </h1>
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
          <Tabs defaultValue="worship" className="w-full">
            <div className="mb-8 flex justify-center">
              <div className="overflow-x-auto pb-4 max-w-full">
                <TabsList className="inline-flex flex-nowrap p-1 bg-orange-50 border border-orange-200 rounded-lg">
                  {productCategories.map((category) => (
                    <TabsTrigger 
                      key={category.id} 
                      value={category.id} 
                      className="px-4 py-2 whitespace-nowrap"
                    >
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.products.map((product, index) => (
                      <Card key={index} className="border-orange-200 shadow-md hover:shadow-lg transition-all hover:border-orange-300">
                        <CardHeader className="p-0">
                          <div className="relative">
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              width={300}
                              height={200}
                              className="rounded-t-lg object-cover h-48 w-full"
                            />
                            <div className="absolute top-2 right-2 bg-orange-600 text-white text-xs px-2 py-1 rounded-full">
                              नया
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-6">
                          <CardTitle className="text-xl font-bold text-orange-800 mb-2">{product.name}</CardTitle>
                          <CardDescription className="text-gray-700">
                            <span className="text-lg font-semibold text-orange-600">{product.price}</span>
                          </CardDescription>
                        </CardContent>
                        <CardFooter className="p-6 pt-0">
                          <Button className="w-full bg-orange-600 hover:bg-orange-700 transition-colors flex items-center justify-center gap-2">
                            <ShoppingCart className="h-4 w-4" />
                            अभी खरीदें
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="mt-8 text-center">
                    <Button asChild className="bg-orange-600 hover:bg-orange-700 transition-colors">
                      <Link href={`/products/${category.id}`}>
                        सभी {category.name} देखें <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gradient-to-r from-orange-50 to-orange-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-6 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-orange-800">
              विशेष उत्पाद
            </h2>
            <p className="max-w-[700px] text-gray-700 md:text-xl">
              हमारे सबसे लोकप्रिय और अनुशंसित उत्पाद जो आपके स्वास्थ्य और कल्याण के लिए विशेष रूप से चुने गए हैं
            </p>
            <div className="w-24 h-1 bg-orange-500 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "पंचगव्य उत्पाद सेट",
                price: "₹1,500",
                image: "/placeholder.svg?height=300&width=400",
                description: "गौ आधारित पांच प्राकृतिक उत्पादों का संग्रह जो आयुर्वेदिक स्वास्थ्य के लिए लाभदायक है।"
              },
              {
                name: "रुद्राक्ष माला विशेष",
                price: "₹2,100",
                image: "/placeholder.svg?height=300&width=400",
                description: "प्रमाणित और शुद्ध रुद्राक्ष से निर्मित माला जो आध्यात्मिक साधना में सहायक है।"
              },
              {
                name: "आयुर्वेदिक जड़ी बूटी संग्रह",
                price: "₹1,800",
                image: "/placeholder.svg?height=300&width=400",
                description: "विभिन्न रोगों के उपचार के लिए चयनित जड़ी बूटियों का विशेष संग्रह।"
              }
            ].map((product, index) => (
              <Card key={index} className="border-orange-200 shadow-md hover:shadow-lg transition-all hover:border-orange-300">
                <CardHeader className="p-0">
                  <div className="relative">
                    <Image
                      src={product.image || "/placeholder.svg"}
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
                  <p className="text-orange-600 font-medium text-lg mb-2">{product.price}</p>
                  <CardDescription className="text-gray-700">{product.description}</CardDescription>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 transition-colors flex items-center justify-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    अभी खरीदें
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
