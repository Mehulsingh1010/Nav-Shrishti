/* eslint-disable react/no-unescaped-entities */
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
// import user

export default function AboutUsPage() {
  const certificates = [
    {
      id: 5,
      name: "PAN पंजीकरण",
      issuer: "आयकर विभाग",
      year: "2017",
      icon: "/placeholder.svg?height=100&width=100",
      description: "स्थायी खाता संख्या (PAN) का पंजीकरण जो आयकर से संबंधित पहचान का प्रमाण है।",
    },
    {
      id: 6,
      name: "TAN प्रमाणन",
      issuer: "आयकर विभाग",
      year: "2017",
      icon: "/placeholder.svg?height=100&width=100",
      description: "कर कटौती खाता संख्या (TAN) की पंजीकरण जो TDS से संबंधित है।",
    },
    {
      id: 7,
      name: "GST पंजीकरण",
      issuer: "जीएसटी विभाग, भारत सरकार",
      year: "2018",
      icon: "/placeholder.svg?height=100&width=100",
      description: "वस्तु एवं सेवा कर (GST) पंजीकरण जो व्यापार में टैक्स अनुपालन को दर्शाता है।",
    },
    {
      id: 8,
      name: "Terms and Conditions प्रमाणन",
      issuer: "आंतरिक नीति दस्तावेज़",
      year: "2022",
      icon: "/placeholder.svg?height=100&width=100",
      description: "सेवा की शर्तों और संचालन की नीतियों को दर्शाने वाला प्रमाणन।",
    },
  ]

  return (
    <div className="flex flex-col  min-h-screen">
      {/* Hero section with improved gradient background */}
      <section className="bg-gradient-to-r from-orange-100 to-orange-50 py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-orange-800">हमारे बारे में</h1>
            <p className="max-w-[700px] text-gray-700 md:text-xl leading-relaxed">
              वैदिक संस्कृति और आयुर्वेद के प्रचार-प्रसार के लिए समर्पित संस्था
            </p>
            <div className="w-24 h-1 bg-orange-500 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* About the Organisation section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg">
              <Image 
                src="/i1.jpeg"
                alt="संस्था परिसर" 
                fill 
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-orange-800 mb-6">संस्था का परिचय</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  नव सृष्टि सृजन की स्थापना 2008 में भारतीय संस्कृति, आयुर्वेद, और वैदिक ज्ञान के संरक्षण और प्रचार के उद्देश्य से की गई थी। हमारी संस्था देश के विभिन्न भागों में शिक्षा, स्वास्थ्य और सामाजिक कल्याण के क्षेत्र में सक्रिय है।
                </p>
                <p>
                  हमारे पास 50 से अधिक प्रशिक्षित आचार्य और विशेषज्ञ हैं जो आयुर्वेद, योग, वास्तुशास्त्र, ज्योतिष और वैदिक परंपराओं में विशेष योग्यता रखते हैं। हमारी संस्था ने अब तक 25,000 से अधिक लोगों को प्रशिक्षित किया है और 100 से अधिक आयुर्वेदिक उत्पादों का विकास किया है।
                </p>
                <p>
                  हमारा मुख्यालय वाराणसी में स्थित है, जिसे वैदिक ज्ञान का केंद्र माना जाता है, और देश के विभिन्न राज्यों में हमारे 15 केंद्र कार्यरत हैं।
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section with Cards */}
      <section className="py-16 bg-orange-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-orange-800 mb-4">हमारा दृष्टिकोण और लक्ष्य</h2>
            <div className="w-24 h-1 bg-orange-500 rounded-full mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-orange-200 shadow-md hover:shadow-lg transition-all hover:border-orange-300">
              <CardContent className="p-8">
                <div className="mb-4 w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-600">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-orange-800 text-center mb-4">हमारा लक्ष्य</h3>
                <p className="text-gray-700 text-center">
                  प्राचीन भारतीय ज्ञान और आयुर्वेद को आधुनिक जीवन में प्रासंगिक बनाते हुए वैदिक संस्कृति का प्रचार करना। हम स्वदेशी और पारंपरिक ज्ञान द्वारा सामाजिक, शारीरिक और आध्यात्मिक कल्याण के विकास के लिए प्रतिबद्ध हैं।
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-orange-200 shadow-md hover:shadow-lg transition-all hover:border-orange-300">
              <CardContent className="p-8">
                <div className="mb-4 w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-600">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-orange-800 text-center mb-4">हमारा दृष्टिकोण</h3>
                <p className="text-gray-700 text-center">
                  2030 तक, हम प्राचीन वैदिक ज्ञान और आधुनिक विज्ञान के बीच एक सेतु बनकर, भारत और विश्व में आयुर्वेद और वैदिक जीवन शैली को बढ़ावा देने वाली अग्रणी संस्था बनने का लक्ष्य रखते हैं, जिससे एक स्वस्थ, सुखी और सतत समाज का निर्माण हो सके।
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Founder Message Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
            <div className="md:col-span-4">
              <div className="relative aspect-square rounded-full overflow-hidden border-4 border-orange-200 shadow-lg mx-auto max-w-[300px]">
                <Image 
                  src="/i2.jpg" 
                  alt="संस्थापक" 
                  fill 
                  className="object-cover"
                />
              </div>
              <div className="text-center mt-4">
                <h3 className="text-xl font-bold text-orange-800">पंकज नामदेव</h3>
                <p className="text-orange-600">संस्थापक एवं अध्यक्ष</p>
              </div>
            </div>
            <div className="md:col-span-8">
              <h2 className="text-3xl font-bold text-orange-800 mb-6">संस्थापक का संदेश</h2>
              <div className="space-y-4 text-gray-700">
                <p className="italic text-lg text-orange-700 border-l-4 border-orange-400 pl-4">
                  "हमारी प्राचीन संस्कृति और ज्ञान परंपरा हमारे राष्ट्र की सबसे बड़ी धरोहर है। इसे संरक्षित करना और आने वाली पीढ़ियों तक पहुंचाना हमारा परम कर्तव्य है।"
                </p>
                <p>
                  प्रिय मित्रों, मैं आप सभी का नव सृष्टि सृजन के परिवार में हार्दिक स्वागत करता हूं। हमारा संगठन वैदिक संस्कृति और आयुर्वेद के प्रचार-प्रसार के लिए पिछले 15 वर्षों से निरंतर कार्यरत है। हमारा प्रयास है कि हमारी प्राचीन ज्ञान परंपरा को आधुनिक संदर्भ में प्रासंगिक बनाकर समाज के हर वर्ग तक पहुंचाया जाए।
                </p>
                <p>
                  हमारे पूर्वजों ने हमें एक समृद्ध विरासत दी है, जिसमें स्वास्थ्य, शिक्षा, विज्ञान, कला और अध्यात्म के क्षेत्र में अनमोल ज्ञान छिपा है। आज के तनावपूर्ण और भौतिकवादी युग में, यह ज्ञान हमारे जीवन में संतुलन लाने और समग्र विकास का मार्ग प्रशस्त करने में अत्यंत महत्वपूर्ण है।
                </p>
                <p>
                  मैं आप सभी से आह्वान करता हूं कि आप इस पवित्र कार्य में हमारा साथ दें और अपने-अपने क्षेत्र में वैदिक मूल्यों और आयुर्वेदिक जीवन शैली को अपनाकर एक स्वस्थ, समृद्ध और सुखी समाज के निर्माण में योगदान दें।
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Certificates Section */}
      <section className="py-16 bg-orange-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-orange-800 mb-4">प्रमाणपत्र और मान्यताएँ</h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              नव सृष्टि सृजन विभिन्न सरकारी और अंतरराष्ट्रीय संस्थाओं द्वारा मान्यता प्राप्त है जो हमारी प्रतिबद्धता और विश्वसनीयता को प्रमाणित करते हैं।
            </p>
            <div className="w-24 h-1 bg-orange-500 rounded-full mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {certificates.map((certificate) => (
              <Card key={certificate.id} className="border-orange-200 shadow-md hover:shadow-lg transition-all hover:border-orange-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 mr-4">
                      <Image 
                        src="/t3.png"
                        alt={certificate.name} 
                        width={48} 
                        height={48} 
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-orange-800">{certificate.name}</h3>
                      <p className="text-orange-600 text-sm">{certificate.issuer}, {certificate.year}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm">{certificate.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-orange-500 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">हमारे साथ जुड़ें</h2>
            <p className="text-orange-50 mb-8 leading-relaxed">
              नव सृष्टि सृजन के साथ जुड़कर आप भी वैदिक संस्कृति और आयुर्वेदिक ज्ञान के प्रचार-प्रसार में अपना योगदान दे सकते हैं। हमारे विभिन्न कार्यक्रमों, प्रशिक्षणों और अभियानों के बारे में जानने के लिए हमसे संपर्क करें।
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              
              <a
                href="/navlinks/contact"
                className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-orange-600 font-medium hover:bg-orange-50 transition-colors"
              >
                संपर्क करें
              </a>
              <a
                href="/navlinks/contact"
                className="inline-flex items-center justify-center rounded-md bg-transparent border border-white px-6 py-3 text-white font-medium hover:bg-orange-700 transition-colors"
              >
                सदस्यता लें
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}