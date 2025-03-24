import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function GalleryPage() {
  const photos = [
    {
      id: 1,
      title: "Standing with humanity in need",
      src: "/g1.png",
      description: "Helping the needful in the time of crisis"
    },
    {
      id: 2,
      title: "Contributing to building future of the nation",
      src: "/g4.png",
      description: "Contributing to the education of the underprivileged"
    },
    {
      id: 3,
      title: "Ensuring health and welness for all",
      src: "/g3.png",
      description: "Fullfilling the basic needs of the society"
    },
    {
      id: 4,
      title: "Building their world of self reliance",
      src: "/g2.png",
      description: "Empowering the youth to build their future"
    }
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero section with improved gradient background */}
      <section className="bg-gradient-to-r from-orange-100 to-orange-50 py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-orange-800">
              गैलरी
            </h1>
            <p className="max-w-[700px] text-gray-700 md:text-xl leading-relaxed">
              हमारी गतिविधियों और कार्यक्रमों की झलकियाँ
            </p>
            <div className="w-24 h-1 bg-orange-500 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Gallery section with horizontal photo layout */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {photos.map((photo) => (
              <Card 
                key={photo.id} 
                className="overflow-hidden border-orange-200 shadow-md hover:shadow-lg transition-all hover:border-orange-300 col-span-1 md:col-span-2 lg:col-span-2"
              >
                <div className="relative w-full h-[400px] group cursor-pointer">
                  <Image
                    src={photo.src || "/placeholder.svg"}
                    alt={photo.title}
                    fill
                    
                    className=" transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 w-full">
                      <h3 className="font-bold text-lg text-white">{photo.title}</h3>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg text-orange-800 mb-1">{photo.title}</h3>
                  <p className="text-gray-700 text-sm">{photo.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-10 text-center">
            <Button className="bg-orange-600 hover:bg-orange-700 transition-colors">
              और फोटो देखें <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}