/* eslint-disable react/no-unescaped-entities */
import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

export default function TestimonialsPage() {
  const testimonials = [
    {
      id: 1,
      name: "राजेश शर्मा",
      role: "सदस्य",
      avatar: "/i3.jpeg",
      content:
        "नव सृष्टि सृजन से जुड़कर मेरा जीवन पूरी तरह बदल गया है। यहां की वैदिक शिक्षा और संस्कार ने मुझे एक नई दिशा दी है। मैं अपने परिवार के साथ नियमित रूप से यहां के कार्यक्रमों में भाग लेता हूं।",
      rating: 5,
    },
    {
      id: 2,
      name: "सुनीता पटेल",
      role: "वितरक",
      avatar: "/i3.jpeg",
      content:
        "नव सृष्टि सृजन के उत्पादों की गुणवत्ता अद्वितीय है। मैं पिछले 2 वर्षों से इनके उत्पादों का वितरण कर रही हूं और ग्राहकों से हमेशा सकारात्मक प्रतिक्रिया मिलती है। स्वदेशी उत्पादों को बढ़ावा देने का यह एक उत्कृष्ट माध्यम है।",
      rating: 5,
    },
    {
      id: 3,
      name: "अमित त्रिवेदी",
      role: "योग प्रशिक्षार्थी",
      avatar: "/i3.jpeg",
      content:
        "नव सृष्टि सृजन के योग केंद्र में प्रशिक्षण लेने के बाद मेरे स्वास्थ्य में अद्भुत सुधार हुआ है। यहां के गुरुजी बहुत अनुभवी हैं और व्यक्तिगत ध्यान देते हैं। योग के साथ-साथ आयुर्वेदिक जीवन शैली के बारे में भी सिखाया जाता है।",
      rating: 4,
    },
    {
      id: 4,
      name: "प्रीति सिंह",
      role: "उद्यमी",
      avatar: "/i3.jpeg",
      content:
        "नव सृष्टि सृजन के साथ साझेदारी करके मैंने अपना स्वदेशी उत्पाद व्यवसाय शुरू किया। उनके मार्गदर्शन और सहयोग से मेरा व्यवसाय तेजी से बढ़ रहा है। यह संस्थान वास्तव में स्वदेशी उद्यमिता को बढ़ावा दे रहा है।",
      rating: 5,
    },
    {
      id: 5,
      name: "विवेक मिश्रा",
      role: "गुरुकुल विद्यार्थी के पिता",
      avatar: "/i3.jpeg",
      content:
        "मेरा बेटा नव सृष्टि सृजन के गुरुकुल में पढ़ता है। यहां की शिक्षा पद्धति आधुनिक और पारंपरिक ज्ञान का अद्भुत संगम है। मेरे बेटे में आत्मविश्वास और संस्कार दोनों का विकास हो रहा है।",
      rating: 5,
    },
    {
      id: 6,
      name: "अनुराधा गुप्ता",
      role: "आयुर्वेद चिकित्सा ग्राहक",
      avatar: "/i3.jpeg",
      content:
        "लंबे समय से मुझे त्वचा संबंधी समस्या थी जिसका कोई समाधान नहीं मिल रहा था। नव सृष्टि सृजन के आयुर्वेदिक उत्पादों और परामर्श से मेरी समस्या पूरी तरह ठीक हो गई। प्राकृतिक उपचार का यह तरीका वास्तव में प्रभावी है।",
      rating: 4,
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero section with improved gradient background */}
      <section className="bg-gradient-to-r from-orange-100 to-orange-50 py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-orange-800">प्रशंसापत्र</h1>
            <p className="max-w-[700px] text-gray-700 md:text-xl leading-relaxed">
              हमारे सदस्यों और ग्राहकों के अनुभव और प्रतिक्रियाएँ
            </p>
            <div className="w-24 h-1 bg-orange-500 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Testimonials section with improved card design */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial) => (
              <Card
                key={testimonial.id}
                className="border-orange-200 shadow-md hover:shadow-lg transition-all hover:border-orange-300 overflow-hidden"
              >
                <CardHeader className="pb-2 relative">
                  <div className="absolute top-0 right-0 p-4">
                    <Quote className="h-8 w-8 text-orange-200" />
                  </div>
                  <div className="flex items-center gap-4 pt-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-orange-200">
                      <Image
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-orange-800">{testimonial.name}</h3>
                      <p className="text-gray-600 text-sm">{testimonial.role}</p>
                      <div className="flex items-center mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < testimonial.rating ? "fill-orange-500 text-orange-500" : "fill-gray-200 text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-gray-700 italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-orange-500 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">अपना अनुभव साझा करें</h2>
            <p className="text-orange-50 mb-8 leading-relaxed">
              यदि आप नव सृष्टि सृजन के साथ जुड़े हैं और अपना अनुभव साझा करना चाहते हैं, तो हमें संपर्क करें। आपकी प्रतिक्रिया हमारे लिए
              महत्वपूर्ण है।
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-orange-600 font-medium hover:bg-orange-50 transition-colors"
            >
              संपर्क करें
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

