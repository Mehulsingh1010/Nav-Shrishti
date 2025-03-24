import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function HallOfFamePage() {
  const achievers = [
    {
      id: 1,
      name: "श्री रामकृष्ण शर्मा",
      achievement: "वर्ष के सर्वश्रेष्ठ प्रमोटर",
      year: "2023",
      avatar: "/i2.jpg",
      description: "श्री रामकृष्ण शर्मा ने 500 से अधिक नए सदस्यों को संस्थान से जोड़ा और वैदिक संस्कृति का प्रचार किया।",
    },
    {
      id: 2,
      name: "श्रीमती सुनीता पटेल",
      achievement: "सर्वश्रेष्ठ उद्यमी",
      year: "2023",
      avatar: "/i2.jpg",
      description:
        "श्रीमती सुनीता पटेल ने आयुर्वेदिक उत्पादों की एक सफल श्रृंखला विकसित की जिसने हजारों लोगों को स्वस्थ जीवनशैली अपनाने में मदद की।",
    },
    {
      id: 3,
      name: "डॉ. अनिल त्रिवेदी",
      achievement: "आयुर्वेद रत्न पुरस्कार",
      year: "2022",
      avatar: "/i2.jpg",
      description:
        "डॉ. अनिल त्रिवेदी ने आयुर्वेदिक चिकित्सा में अभूतपूर्व योगदान दिया और कई दुर्लभ रोगों के लिए प्रभावी उपचार विकसित किए।",
    },
    {
      id: 4,
      name: "योगाचार्य प्रमोद मिश्रा",
      achievement: "योग भूषण सम्मान",
      year: "2022",
      avatar: "/i2.jpg",
      description: "योगाचार्य प्रमोद मिश्रा ने योग के प्रचार-प्रसार में महत्वपूर्ण योगदान दिया और हजारों लोगों को योग से जोड़ा।",
    },
    {
      id: 5,
      name: "श्री विजय अग्रवाल",
      achievement: "सर्वश्रेष्ठ वितरक",
      year: "2021",
      avatar: "/i2.jpg",
      description: "श्री विजय अग्रवाल ने स्वदेशी उत्पादों के वितरण में उत्कृष्ट कार्य किया और 100 से अधिक नए वितरण केंद्र स्थापित किए।",
    },
    {
      id: 6,
      name: "श्रीमती राधिका शर्मा",
      achievement: "गौ सेवा रत्न",
      year: "2021",
      avatar: "/i2.jpg",
      description: "श्रीमती राधिका शर्मा ने गौ संरक्षण के क्षेत्र में उल्लेखनीय कार्य किया और एक बड़ी गौशाला की स्थापना में मदद की।",
    },
    {
      id: 7,
      name: "पंडित हरिशंकर द्विवेदी",
      achievement: "वेद प्रचारक सम्मान",
      year: "2020",
      avatar: "/i2.jpg",
      description:
        "पंडित हरिशंकर द्विवेदी ने वेदों के प्रचार-प्रसार में महत्वपूर्ण योगदान दिया और कई वेद पाठशालाओं की स्थापना में सहयोग किया।",
    },
    {
      id: 8,
      name: "डॉ. मीना गुप्ता",
      achievement: "स्वदेशी विज्ञान पुरस्कार",
      year: "2020",
      avatar: "/i2.jpg",
      description:
        "डॉ. मीना गुप्ता ने प्राचीन भारतीय विज्ञान पर शोध किया और कई महत्वपूर्ण खोजें कीं जो आधुनिक विज्ञान में भी उपयोगी हैं।",
    },
  ]

  const years = ["2023", "2022", "2021", "2020"]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero section with improved gradient background */}
      <section className="bg-gradient-to-r from-orange-100 to-orange-50 py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-orange-800">हॉल ऑफ फेम</h1>
            <p className="max-w-[700px] text-gray-700 md:text-xl leading-relaxed">
              नव सृष्टि सृजन के उत्कृष्ट योगदानकर्ता और पुरस्कार विजेता
            </p>
            <div className="w-24 h-1 bg-orange-500 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Hall of Fame section with improved tabs and card design */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <Tabs defaultValue="2023" className="w-full">
            <div className="mb-8 flex justify-center">
              <TabsList className="grid grid-cols-4 p-1 bg-orange-50 border border-orange-200 rounded-lg">
                {years.map((year) => (
                  <TabsTrigger
                    key={year}
                    value={year}
                    className="rounded-md data-[state=active]:bg-orange-600 data-[state=active]:text-white"
                  >
                    {year}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {years.map((year) => (
              <TabsContent key={year} value={year}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                  {achievers
                    .filter((achiever) => achiever.year === year)
                    .map((achiever) => (
                      <Card
                        key={achiever.id}
                        className="border-orange-200 shadow-md hover:shadow-lg transition-all hover:border-orange-300 overflow-hidden group"
                      >
                        <div className="relative aspect-square">
                          <Image
                            src={achiever.avatar || "/placeholder.svg"}
                            alt={achiever.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-orange-600 hover:bg-orange-700">{achiever.year}</Badge>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                            <div className="p-4 w-full">
                              <h3 className="font-bold text-lg text-white">{achiever.name}</h3>
                              <p className="text-orange-200 text-sm">{achiever.achievement}</p>
                            </div>
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <h3 className="font-bold text-lg text-orange-800 mb-1">{achiever.name}</h3>
                          <p className="text-orange-600 text-sm font-medium mb-2">{achiever.achievement}</p>
                          <p className="text-gray-700 text-sm">{achiever.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Nomination CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-orange-500 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">किसी को नामांकित करें</h2>
            <p className="text-orange-50 mb-8 leading-relaxed">
              क्या आप किसी ऐसे व्यक्ति को जानते हैं जिसने वैदिक संस्कृति के प्रचार-प्रसार में उल्लेखनीय योगदान दिया है? उन्हें हमारे हॉल ऑफ फेम के
              लिए नामांकित करें।
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-orange-600 font-medium hover:bg-orange-50 transition-colors"
            >
              नामांकन फॉर्म
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

