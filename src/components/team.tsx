import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Facebook, Twitter, Linkedin, Mail } from "lucide-react"

export default function TeamPage() {
  const teamMembers = [
    {
      id: 1,
      name: "आचार्य रामानंद जी",
      role: "संस्थापक एवं अध्यक्ष",
      avatar: "/i3.jpeg",
      bio: "आचार्य रामानंद जी 30 वर्षों से वैदिक ज्ञान और संस्कृति के प्रचार-प्रसार में संलग्न हैं। उन्होंने कई पुस्तकें लिखी हैं और देश-विदेश में वैदिक संस्कृति पर व्याख्यान दिए हैं।",
    },
    {
      id: 2,
      name: "डॉ. सुनीता शर्मा",
      role: "आयुर्वेद विशेषज्ञ",
      avatar: "/i3.jpeg",
      bio: "डॉ. सुनीता शर्मा एक अनुभवी आयुर्वेद चिकित्सक हैं। उन्होंने आयुर्वेद में पीएचडी की है और 20 वर्षों से आयुर्वेदिक उपचार और अनुसंधान में कार्यरत हैं।",
    },
    {
      id: 3,
      name: "योगाचार्य विवेक त्रिपाठी",
      role: "योग प्रशिक्षक",
      avatar: "/i3.jpeg",
      bio: "योगाचार्य विवेक त्रिपाठी अंतरराष्ट्रीय स्तर पर मान्यता प्राप्त योग गुरु हैं। उन्होंने हजारों लोगों को योग और ध्यान का प्रशिक्षण दिया है और कई अंतरराष्ट्रीय योग शिविरों का आयोजन किया है।",
    },
    {
      id: 4,
      name: "पंडित हरिप्रसाद शास्त्री",
      role: "वेद और संस्कृत विशेषज्ञ",
      avatar: "/i3.jpeg",
      bio: "पंडित हरिप्रसाद शास्त्री वेद और संस्कृत के विद्वान हैं। उन्होंने कई प्राचीन ग्रंथों का अनुवाद किया है और गुरुकुल में वेद और संस्कृत पढ़ाते हैं।",
    },
    {
      id: 5,
      name: "श्रीमती अनुराधा पटेल",
      role: "गौशाला प्रबंधक",
      avatar: "/i3.jpeg",
      bio: "श्रीमती अनुराधा पटेल पिछले 15 वर्षों से गौ सेवा में समर्पित हैं। उनके नेतृत्व में गौशाला का विकास हुआ है और गौ आधारित उत्पादों का निर्माण शुरू हुआ है।",
    },
    {
      id: 6,
      name: "श्री राजेश अग्रवाल",
      role: "वित्त प्रबंधक",
      avatar: "/i3.jpeg",
      bio: "श्री राजेश अग्रवाल एक अनुभवी वित्त विशेषज्ञ हैं। उन्होंने संस्थान के वित्तीय प्रबंधन को सुदृढ़ किया है और पारदर्शी वित्तीय प्रणाली विकसित की है।",
    },
    {
      id: 7,
      name: "डॉ. प्रमोद मिश्रा",
      role: "शोध निदेशक",
      avatar: "/i3.jpeg",
      bio: "डॉ. प्रमोद मिश्रा प्राचीन भारतीय विज्ञान और प्रौद्योगिकी के विशेषज्ञ हैं। उनके नेतृत्व में संस्थान वैदिक विज्ञान पर शोध कर रहा है।",
    },
    {
      id: 8,
      name: "श्रीमती कविता सिंह",
      role: "प्रचार प्रमुख",
      avatar: "/i3.jpeg",
      bio: "श्रीमती कविता सिंह एक अनुभवी मीडिया और प्रचार विशेषज्ञ हैं। उन्होंने संस्थान की पहुंच को राष्ट्रीय और अंतरराष्ट्रीय स्तर पर बढ़ाया है।",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero section with improved gradient background */}
      <section className="bg-gradient-to-r from-orange-100 to-orange-50 py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-orange-800">हमारी टीम</h1>
            <p className="max-w-[700px] text-gray-700 md:text-xl leading-relaxed">
              नव सृष्टि सृजन के समर्पित सदस्य जो वैदिक संस्कृति के प्रचार-प्रसार में कार्यरत हैं
            </p>
            <div className="w-24 h-1 bg-orange-500 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Team section with improved card design */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {teamMembers.map((member) => (
              <Card
                key={member.id}
                className="border-orange-200 shadow-md hover:shadow-lg transition-all hover:border-orange-300 overflow-hidden group"
              >
                <div className="relative aspect-square">
                  <Image
                    src={member.avatar || "/placeholder.svg"}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 w-full">
                      <div className="flex justify-center space-x-3">
                        <a href="#" className="bg-white/20 hover:bg-white/40 p-2 rounded-full transition-colors">
                          <Facebook className="h-4 w-4 text-white" />
                        </a>
                        <a href="#" className="bg-white/20 hover:bg-white/40 p-2 rounded-full transition-colors">
                          <Twitter className="h-4 w-4 text-white" />
                        </a>
                        <a href="#" className="bg-white/20 hover:bg-white/40 p-2 rounded-full transition-colors">
                          <Linkedin className="h-4 w-4 text-white" />
                        </a>
                        <a href="#" className="bg-white/20 hover:bg-white/40 p-2 rounded-full transition-colors">
                          <Mail className="h-4 w-4 text-white" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6 text-center">
                  <h3 className="font-bold text-lg text-orange-800 mb-1">{member.name}</h3>
                  <p className="text-orange-600 text-sm font-medium mb-3">{member.role}</p>
                  <p className="text-gray-700 text-sm line-clamp-4">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Join Team CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-50 to-orange-100">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-orange-800 mb-6">हमारी टीम से जुड़ें</h2>
            <p className="text-gray-700 mb-8 leading-relaxed">
              यदि आप वैदिक संस्कृति के प्रचार-प्रसार में रुचि रखते हैं और हमारी टीम का हिस्सा बनना चाहते हैं, तो हमें संपर्क करें। हम विभिन्न
              क्षेत्रों में योग्य और समर्पित व्यक्तियों की तलाश में हैं।
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-orange-600 px-6 py-3 text-white font-medium hover:bg-orange-700 transition-colors"
            >
              अभी आवेदन करें
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

