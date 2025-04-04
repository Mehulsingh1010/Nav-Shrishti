"use client"

import { useState } from "react"
import Image from "next/image"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Aashram facilities data
const aashramFacilities = [
  { id: 1, name: "अध्यन कक्षाएं", category: "education", description: "वैदिक और आधुनिक शिक्षा के लिए समर्पित कक्षाएं" },
  { id: 2, name: "अभ्यास शाला", category: "education", description: "व्यावहारिक ज्ञान और कौशल विकास के लिए अभ्यास केंद्र" },
  { id: 3, name: "पुस्तकालय", category: "education", description: "प्राचीन ग्रंथों और आधुनिक पुस्तकों का संग्रह" },
  { id: 4, name: "कुलपति कक्ष", category: "administration", description: "आश्रम के कुलपति का कार्यालय" },
  { id: 5, name: "सभागार", category: "community", description: "सामूहिक गतिविधियों और समारोहों के लिए विशाल हॉल" },
  { id: 6, name: "अतिथी कक्ष", category: "accommodation", description: "आगंतुकों और अतिथियों के लिए आवास" },
  { id: 7, name: "आचार्य कक्ष", category: "education", description: "गुरुओं और शिक्षकों के लिए निवास और कार्यालय" },
  { id: 8, name: "छात्रावास", category: "accommodation", description: "विद्यार्थियों के लिए आवासीय सुविधा" },
  { id: 9, name: "भोजनालय", category: "food", description: "सात्विक और पौष्टिक भोजन प्रदान करने वाला केंद्र" },
  { id: 10, name: "क्रीड़ागन", category: "recreation", description: "खेल और शारीरिक गतिविधियों के लिए मैदान" },
  { id: 11, name: "जलाशय", category: "nature", description: "प्राकृतिक जल स्रोत और सरोवर" },
  { id: 12, name: "मंदिर", category: "spiritual", description: "आध्यात्मिक साधना और पूजा के लिए पवित्र स्थान" },
  { id: 13, name: "खेत", category: "agriculture", description: "जैविक खेती और कृषि अनुसंधान के लिए भूमि" },
  { id: 14, name: "खलिहान", category: "agriculture", description: "फसल संग्रहण और प्रसंस्करण केंद्र" },
  { id: 15, name: "बाग(फालों)", category: "agriculture", description: "विभिन्न प्रकार के फलों के पेड़ों का उद्यान" },
  { id: 16, name: "बगीचा(फूलों)", category: "nature", description: "सुंदर और सुगंधित फूलों का बगीचा" },
  { id: 17, name: "पार्क", category: "nature", description: "हरियाली, जलाशय, और मनोरम दृश्य वाला उद्यान" },
  { id: 18, name: "औषधीय वन", category: "health", description: "औषधीय पौधों और जड़ी-बूटियों का संग्रह" },
  { id: 19, name: "पशु शाला", category: "agriculture", description: "गौशाला और अन्य पशुओं के लिए आश्रय" },
  { id: 20, name: "चिकित्सालय", category: "health", description: "आयुर्वेदिक और आधुनिक चिकित्सा सुविधा" },
  { id: 21, name: "वस्त्रालय", category: "production", description: "पारंपरिक और आधुनिक वस्त्र निर्माण केंद्र" },
  { id: 22, name: "पौधशाला", category: "agriculture", description: "पौधों के प्रजनन और विकास केंद्र" },
  { id: 23, name: "सूचना एवं संचार विभाग", category: "administration", description: "आश्रम की गतिविधियों का प्रचार-प्रसार" },
  { id: 24, name: "नाट्य शाला", category: "arts", description: "नाटक और रंगमंच कला के लिए स्थान" },
  { id: 25, name: "नृत्य शाला", category: "arts", description: "शास्त्रीय और लोक नृत्य के लिए केंद्र" },
  { id: 26, name: "संगीत भवन", category: "arts", description: "संगीत शिक्षा और प्रदर्शन के लिए स्थान" },
  { id: 27, name: "शस्त्रागार", category: "defense", description: "पारंपरिक शस्त्रों का संग्रहालय और प्रशिक्षण केंद्र" },
  { id: 28, name: "युद्ध अभ्यास क्षेत्र", category: "defense", description: "मार्शल आर्ट और आत्मरक्षा प्रशिक्षण के लिए क्षेत्र" },
  { id: 30, name: "कृषि विभाग", category: "agriculture", description: "कृषि अनुसंधान और विकास केंद्र" },
  { id: 31, name: "बर्तन विभाग", category: "production", description: "मिट्टी और धातु के बर्तन निर्माण" },
  { id: 32, name: "भवन निर्माण विभाग", category: "production", description: "पारंपरिक और आधुनिक निर्माण तकनीकें" },
  { id: 33, name: "सड़क निर्माण विभाग", category: "production", description: "आश्रम के भीतर और बाहर संपर्क मार्ग" },
  { id: 34, name: "पुल निर्माण विभाग", category: "production", description: "जल स्रोतों पर पुल निर्माण" },
  { id: 35, name: "काष्ठीय वस्तु निर्माण विभाग", category: "production", description: "लकड़ी से निर्मित वस्तुओं का उत्पादन" },
  { id: 36, name: "मृदा वस्तु निर्माण विभाग", category: "production", description: "मिट्टी से बने उत्पादों का निर्माण" },
  { id: 37, name: "शीशा वस्तु निर्माण विभाग", category: "production", description: "कांच और क्रिस्टल उत्पादों का निर्माण" },
  { id: 38, name: "लौह वस्तु निर्माण विभाग", category: "production", description: "लोहे और इस्पात से बने उत्पादों का निर्माण" },
  {
    id: 39,
    name: "स्वर्ण एवं रजत वस्तु निर्माण विभाग",
    category: "production",
    description: "सोने और चांदी के आभूषण और कलाकृतियां",
  },
  { id: 40, name: "चर्म वस्तु निर्माण विभाग", category: "production", description: "चमड़े से बने उत्पादों का निर्माण" },
  { id: 41, name: "वस्त्र निर्माण विभाग", category: "production", description: "हथकरघा और आधुनिक वस्त्र उत्पादन" },
  { id: 42, name: "शस्त्र निर्माण विभाग", category: "defense", description: "पारंपरिक शस्त्रों का निर्माण" },
  { id: 43, name: "वाहन निर्माण विभाग", category: "production", description: "पारंपरिक और आधुनिक वाहनों का निर्माण" },
  { id: 44, name: "औषधि निर्माण विभाग", category: "health", description: "आयुर्वेदिक और हर्बल दवाओं का उत्पादन" },
  { id: 45, name: "विद्युत निर्माण विभाग", category: "production", description: "सौर और अन्य नवीकरणीय ऊर्जा उत्पादन" },
  { id: 46, name: "जल विभाग", category: "administration", description: "जल संरक्षण और वितरण प्रबंधन" },
  { id: 47, name: "भोजन विभाग", category: "food", description: "आहार योजना और भोजन तैयारी" },
  { id: 48, name: "सुरक्षा विभाग", category: "administration", description: "आश्रम की सुरक्षा व्यवस्था" },
  { id: 49, name: "गुप्तचर विभाग", category: "administration", description: "आंतरिक और बाहरी खुफिया जानकारी" },
  { id: 50, name: "वित्त विभाग", category: "administration", description: "आश्रम के वित्तीय मामलों का प्रबंधन" },
  { id: 51, name: "न्याय विभाग", category: "administration", description: "विवादों का समाधान और न्याय प्रणाली" },
  { id: 52, name: "वेद शाला", category: "education", description: "वेदों का अध्ययन और अध्यापन" },
  { id: 53, name: "शास्त्र शाला", category: "education", description: "विभिन्न शास्त्रों का अध्ययन" },
  { id: 54, name: "उपनिषद् शाला", category: "education", description: "उपनिषदों का गहन अध्ययन" },
  { id: 55, name: "पुराण शाला", category: "education", description: "पुराणों और इतिहास का अध्ययन" },
  { id: 56, name: "जीव विज्ञान", category: "science", description: "जीवन और जीवों का वैज्ञानिक अध्ययन" },
  { id: 57, name: "वनस्पति विज्ञान", category: "science", description: "पौधों और वनस्पतियों का अध्ययन" },
  { id: 58, name: "रसायन विज्ञान", category: "science", description: "पदार्थों की संरचना और प्रतिक्रियाओं का अध्ययन" },
  { id: 59, name: "भौतिक विज्ञान", category: "science", description: "प्रकृति के नियमों और भौतिक घटनाओं का अध्ययन" },
  { id: 60, name: "भूगोल विज्ञान", category: "science", description: "पृथ्वी और उसके वातावरण का अध्ययन" },
  { id: 61, name: "इतिहास", category: "education", description: "अतीत की घटनाओं और सभ्यताओं का अध्ययन" },
  { id: 62, name: "राजनीति विज्ञान", category: "education", description: "शासन प्रणालियों और राजनीतिक सिद्धांतों का अध्ययन" },
  { id: 63, name: "कूटनीति विज्ञान", category: "education", description: "अंतरराष्ट्रीय संबंधों और कूटनीति का अध्ययन" },
  { id: 64, name: "गणित", category: "science", description: "संख्याओं, आकृतियों और पैटर्न का अध्ययन" },
  { id: 65, name: "भाषा विज्ञान", category: "education", description: "भाषाओं की संरचना और विकास का अध्ययन" },
  { id: 66, name: "गृह विज्ञान", category: "education", description: "घरेलू प्रबंधन और जीवन कौशल का अध्ययन" },
  { id: 67, name: "अभियांत्रिकी", category: "science", description: "विज्ञान के व्यावहारिक अनुप्रयोग का अध्ययन" },
  { id: 68, name: "खगोल विज्ञान", category: "science", description: "ब्रह्मांड और आकाशीय पिंडों का अध्ययन" },
  { id: 69, name: "वास्तु विज्ञान", category: "science", description: "पारंपरिक भारतीय वास्तुकला का अध्ययन" },
  { id: 70, name: "संविधान", category: "administration", description: "आश्रम के नियम और कानून" },
]

// Categories for filtering
const categories = [
  { id: "all", name: "सभी" },
  { id: "education", name: "शिक्षा" },
  { id: "spiritual", name: "आध्यात्मिक" },
  { id: "agriculture", name: "कृषि" },
  { id: "production", name: "उत्पादन" },
  { id: "health", name: "स्वास्थ्य" },
  { id: "arts", name: "कला" },
  { id: "science", name: "विज्ञान" },
  { id: "administration", name: "प्रशासन" },
  { id: "defense", name: "रक्षा" },
  { id: "accommodation", name: "आवास" },
  { id: "food", name: "भोजन" },
  { id: "nature", name: "प्रकृति" },
  { id: "community", name: "सामुदायिक" },
  { id: "recreation", name: "मनोरंजन" },
]

export default function AashramPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [viewMode, setViewMode] = useState("grid")

  // Filter facilities based on search query and active category
  const filteredFacilities = aashramFacilities.filter((facility) => {
    const matchesSearch =
      facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      facility.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "all" || facility.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-orange-800 mb-4">आश्रम सुविधाएं</h1>
        <p className="text-lg text-orange-600 max-w-2xl mx-auto">
          हमारा आश्रम वैदिक परंपराओं और आधुनिक सुविधाओं का संगम है, जहां आध्यात्मिक विकास और ज्ञान प्राप्ति के लिए सभी आवश्यक व्यवस्थाएं
          उपलब्ध हैं।
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400" />
          <Input
            placeholder="सुविधा खोजें..."
            className="pl-10 border-orange-200 focus:border-orange-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            className={viewMode === "grid" ? "bg-orange-600 hover:bg-orange-700" : "text-orange-600 border-orange-200"}
            onClick={() => setViewMode("grid")}
          >
            ग्रिड
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            className={viewMode === "list" ? "bg-orange-600 hover:bg-orange-700" : "text-orange-600 border-orange-200"}
            onClick={() => setViewMode("list")}
          >
            सूची
          </Button>
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
        <TabsList className="bg-orange-100 p-1 overflow-x-auto flex flex-nowrap max-w-full justify-start">
          {categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="whitespace-nowrap data-[state=active]:bg-orange-600 data-[state=active]:text-white"
            >
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Facilities Grid/List */}
      {filteredFacilities.length > 0 ? (
        <div
          className={
            viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"
          }
        >
          {filteredFacilities.map((facility) => (
            <Card
              key={facility.id}
              className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${
                viewMode === "grid" ? "h-full" : "flex flex-row"
              }`}
            >
              <div className={viewMode === "list" ? "w-1/4 min-w-[120px]" : ""}>
                <div className="relative aspect-video bg-orange-100">
                  <Image
                    src="/i2.jpg"
                    alt={facility.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <CardContent className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 mb-2">
                  {categories.find((c) => c.id === facility.category)?.name || facility.category}
                </Badge>
                <h3 className="text-xl font-bold text-orange-800 mb-2">{facility.name}</h3>
                <p className="text-orange-600">{facility.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-orange-600">कोई सुविधा नहीं मिली। कृपया अपनी खोज बदलें।</p>
        </div>
      )}
    </div>
  )
}

