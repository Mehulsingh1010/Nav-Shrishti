import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Play, ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function GalleryPage() {
  const photos = [
    {
      id: 1,
      title: "गुरुकुल समारोह",
      src: "/placeholder.svg?height=300&width=400",
      description: "वार्षिक गुरुकुल समारोह का एक दृश्य"
    },
    {
      id: 2,
      title: "योग शिविर",
      src: "/placeholder.svg?height=300&width=400",
      description: "अंतर्राष्ट्रीय योग दिवस पर आयोजित योग शिविर"
    },
    {
      id: 3,
      title: "गौ पूजा",
      src: "/placeholder.svg?height=300&width=400",
      description: "गौ माता की पूजा का पावन अवसर"
    },
    {
      id: 4,
      title: "वेद पाठशाला",
      src: "/placeholder.svg?height=300&width=400",
      description: "बच्चों द्वारा वेद मंत्रों का उच्चारण"
    },
    {
      id: 5,
      title: "यज्ञ अनुष्ठान",
      src: "/placeholder.svg?height=300&width=400",
      description: "पारंपरिक यज्ञ अनुष्ठान का आयोजन"
    },
    {
      id: 6,
      title: "आयुर्वेद शिविर",
      src: "/placeholder.svg?height=300&width=400",
      description: "निःशुल्क आयुर्वेदिक चिकित्सा शिविर"
    },
    {
      id: 7,
      title: "संस्कृत कक्षा",
      src: "/placeholder.svg?height=300&width=400",
      description: "संस्कृत भाषा सीखते हुए विद्यार्थी"
    },
    {
      id: 8,
      title: "गौशाला",
      src: "/placeholder.svg?height=300&width=400",
      description: "हमारी गौशाला का एक दृश्य"
    },
    {
      id: 9,
      title: "स्वदेशी मेला",
      src: "/placeholder.svg?height=300&width=400",
      description: "स्वदेशी उत्पादों का प्रदर्शन मेला"
    }
  ]

  const videos = [
    {
      id: 1,
      title: "वेद पाठ",
      thumbnail: "/placeholder.svg?height=300&width=400",
      description: "वेद मंत्रों का सामूहिक पाठ",
      duration: "10:25"
    },
    {
      id: 2,
      title: "योग प्रशिक्षण",
      thumbnail: "/placeholder.svg?height=300&width=400",
      description: "योग गुरु द्वारा योग प्रशिक्षण",
      duration: "25:40"
    },
    {
      id: 3,
      title: "गौ सेवा",
      thumbnail: "/placeholder.svg?height=300&width=400",
      description: "गौ सेवा और संरक्षण पर वृत्तचित्र",
      duration: "15:30"
    },
    {
      id: 4,
      title: "आयुर्वेद ज्ञान",
      thumbnail: "/placeholder.svg?height=300&width=400",
      description: "आयुर्वेद के बुनियादी सिद्धांतों पर व्याख्यान",
      duration: "18:15"
    },
    {
      id: 5,
      title: "संस्कृत शिक्षण",
      thumbnail: "/placeholder.svg?height=300&width=400",
      description: "संस्कृत भाषा सीखने की सरल विधि",
      duration: "30:10"
    },
    {
      id: 6,
      title: "यज्ञ विधि",
      thumbnail: "/placeholder.svg?height=300&width=400",
      description: "पारंपरिक यज्ञ विधि का प्रदर्शन",
      duration: "22:45"
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

      {/* Gallery section with improved tabs and card design */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <Tabs defaultValue="photos" className="w-full">
            <div className="mb-8 flex justify-center">
              <TabsList className="grid w-full max-w-md grid-cols-2 p-1 bg-orange-50 border border-orange-200 rounded-lg">
                <TabsTrigger value="photos" className="rounded-md data-[state=active]:bg-orange-600 data-[state=active]:text-white">
                  फोटो
                </TabsTrigger>
                <TabsTrigger value="videos" className="rounded-md data-[state=active]:bg-orange-600 data-[state=active]:text-white">
                  वीडियो
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="photos">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {photos.map((photo) => (
                  <Card key={photo.id} className="overflow-hidden border-orange-200 shadow-md hover:shadow-lg transition-all hover:border-orange-300">
                    <div className="relative aspect-video group cursor-pointer">
                      <Image
                        src={photo.src || "/placeholder.svg"}
                        alt={photo.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
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
            </TabsContent>
            
            <TabsContent value="videos">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {videos.map((video) => (
                  <Card key={video.id} className="overflow-hidden border-orange-200 shadow-md hover:shadow-lg transition-all hover:border-orange-300">
                    <div className="relative aspect-video group cursor-pointer">
                      <Image
                        src={video.thumbnail || "/placeholder.svg"}
                        alt={video.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="h-16 w-16 rounded-full bg-white/80 flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110">
                          <Play className="h-8 w-8 text-orange-600 ml-1" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg text-orange-800 mb-1">{video.title}</h3>
                      <p className="text-gray-700 text-sm">{video.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-10 text-center">
                <Button className="bg-orange-600 hover:bg-orange-700 transition-colors">
                  और वीडियो देखें <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
