"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Phone, MapPin, User, Users, Building, Briefcase, Handshake } from "lucide-react"
import { ContactForm } from "@/components/contact-form"

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero section with improved spacing and background gradient */}
      <section className="bg-gradient-to-r from-orange-100 to-orange-50 py-16">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-orange-800">संपर्क करें</h1>
            <p className="max-w-[700px] text-gray-700 md:text-xl leading-relaxed">
              नव सृष्टि सृजन से जुड़ें और हमारे साथ वैदिक भारत के निर्माण में सहयोग करें
            </p>
          </div>
        </div>
      </section>

      {/* Tabs section with improved spacing and responsive design */}

      <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-orange-50 to-white">
        <div className="container px-4 sm:px-6 mx-auto max-w-7xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-orange-800 mb-4">हमसे जुड़ें</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">नव सृष्टि सृजन के माध्यम से वैदिक संस्कृति के प्रचार में अपना योगदान दें</p>
          </div>

          <Tabs defaultValue="member" className="w-full">
            <div className="mb-8">
              <TabsList className="flex flex-wrap justify-center gap-1 bg-transparent">
                <TabsTrigger
                  value="member"
                  className="flex flex-col items-center gap-2 py-3 px-4 rounded-lg data-[state=active]:bg-orange-100 data-[state=active]:text-orange-800 data-[state=active]:shadow-md transition-all duration-200 hover:bg-orange-50"
                >
                  <User className="h-5 w-5" />
                  <span>सदस्य</span>
                </TabsTrigger>
                <TabsTrigger
                  value="promoter"
                  className="flex flex-col items-center gap-2 py-3 px-4 rounded-lg data-[state=active]:bg-orange-100 data-[state=active]:text-orange-800 data-[state=active]:shadow-md transition-all duration-200 hover:bg-orange-50"
                >
                  <Users className="h-5 w-5" />
                  <span>प्रमोटर</span>
                </TabsTrigger>
                <TabsTrigger
                  value="distributor"
                  className="flex flex-col items-center gap-2 py-3 px-4 rounded-lg data-[state=active]:bg-orange-100 data-[state=active]:text-orange-800 data-[state=active]:shadow-md transition-all duration-200 hover:bg-orange-50"
                >
                  <Briefcase className="h-5 w-5" />
                  <span>वितरक</span>
                </TabsTrigger>
                <TabsTrigger
                  value="udyami"
                  className="flex flex-col items-center gap-2 py-3 px-4 rounded-lg data-[state=active]:bg-orange-100 data-[state=active]:text-orange-800 data-[state=active]:shadow-md transition-all duration-200 hover:bg-orange-50"
                >
                  <Building className="h-5 w-5" />
                  <span>उद्यमी</span>
                </TabsTrigger>
                <TabsTrigger
                  value="partner"
                  className="flex flex-col items-center gap-2 py-3 px-4 rounded-lg data-[state=active]:bg-orange-100 data-[state=active]:text-orange-800 data-[state=active]:shadow-md transition-all duration-200 hover:bg-orange-50"
                >
                  <Handshake className="h-5 w-5" />
                  <span>पार्टनर</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="max-w-3xl mx-auto">
              <TabsContent value="member">
                <Card className="border-orange-200 shadow-lg rounded-xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-orange-100 to-orange-50 border-b border-orange-100">
                    <CardTitle className="text-2xl font-bold text-orange-800">सदस्य बनें</CardTitle>
                    <CardDescription className="text-gray-600">
                      नव सृष्टि सृजन के सदस्य बनकर वैदिक संस्कृति के प्रचार में सहयोग करें
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ContactForm
                      formType="member"
                      formTitle="सदस्य बनें"
                      formDescription="नव सृष्टि सृजन के सदस्य बनकर वैदिक संस्कृति के प्रचार में सहयोग करें"
                      fields={{ firstName: true, lastName: true }}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Promoter Tab */}
              <TabsContent value="promoter">
                <Card className="border-orange-200 shadow-lg rounded-xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-orange-100 to-orange-50 border-b border-orange-100">
                    <CardTitle className="text-2xl font-bold text-orange-800">प्रमोटर बनें</CardTitle>
                    <CardDescription className="text-gray-600">
                      नव सृष्टि सृजन के प्रमोटर बनकर वैदिक संस्कृति का प्रचार करें
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ContactForm
                      formType="promoter"
                      formTitle="प्रमोटर बनें"
                      formDescription="नव सृष्टि सृजन के प्रमोटर बनकर वैदिक संस्कृति का प्रचार करें"
                      fields={{ organization: true }}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Distributor Tab */}
              <TabsContent value="distributor">
                <Card className="border-orange-200 shadow-lg rounded-xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-orange-100 to-orange-50 border-b border-orange-100">
                    <CardTitle className="text-2xl font-bold text-orange-800">वितरक बनें</CardTitle>
                    <CardDescription className="text-gray-600">नव सृष्टि सृजन के उत्पादों के वितरक बनें</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ContactForm
                      formType="distributor"
                      formTitle="वितरक बनें"
                      formDescription="नव सृष्टि सृजन के उत्पादों के वितरक बनें"
                      fields={{ business: true, area: true }}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Udyami Tab */}
              <TabsContent value="udyami">
                <Card className="border-orange-200 shadow-lg rounded-xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-orange-100 to-orange-50 border-b border-orange-100">
                    <CardTitle className="text-2xl font-bold text-orange-800">उद्यमी बनें</CardTitle>
                    <CardDescription className="text-gray-600">
                      नव सृष्टि सृजन के साथ मिलकर स्वदेशी उत्पाद बनाएं
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ContactForm
                      formType="udyami"
                      formTitle="उद्यमी बनें"
                      formDescription="नव सृष्टि सृजन के साथ मिलकर स्वदेशी उत्पाद बनाएं"
                      fields={{ business: true, product: true }}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Partner Tab */}
              <TabsContent value="partner">
                <Card className="border-orange-200 shadow-lg rounded-xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-orange-100 to-orange-50 border-b border-orange-100">
                    <CardTitle className="text-2xl font-bold text-orange-800">पार्टनर बनें</CardTitle>
                    <CardDescription className="text-gray-600">नव सृष्टि सृजन के साथ रणनीतिक साझेदारी करें</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ContactForm
                      formType="partner"
                      formTitle="पार्टनर बनें"
                      formDescription="नव सृष्टि सृजन के साथ रणनीतिक साझेदारी करें"
                      fields={{ organization: true, partnerType: true }}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </section>

      {/* Contact information section with improved card design */}
      <section className="py-16 bg-gradient-to-r from-orange-50 to-orange-100">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-orange-200 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-full">
                    <MapPin className="h-5 w-5 text-orange-600" />
                  </div>
                  <CardTitle className="text-xl font-bold text-orange-800">हमारा पता</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  नव सृष्टि सृजन सेवा संस्थान
                  <br />
                  123, वैदिक मार्ग
                  <br />
                  नई दिल्ली - 110001
                  <br />
                  भारत
                </p>
              </CardContent>
            </Card>
            <Card className="border-orange-200 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-full">
                    <Mail className="h-5 w-5 text-orange-600" />
                  </div>
                  <CardTitle className="text-xl font-bold text-orange-800">ईमेल</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  info@navsrishti.org
                  <br />
                  support@navsrishti.org
                  <br />
                  <Link
                    href="https://www.navsrishti.org"
                    className="text-orange-600 hover:underline hover:text-orange-700 transition-colors"
                  >
                    www.navsrishti.org
                  </Link>
                </p>
              </CardContent>
            </Card>
            <Card className="border-orange-200 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-full">
                    <Phone className="h-5 w-5 text-orange-600" />
                  </div>
                  <CardTitle className="text-xl font-bold text-orange-800">फोन</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  +91 XXXXXXXXXX
                  <br />
                  +91 XXXXXXXXXX
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="mt-10">
            <Card className="border-orange-200 shadow-md overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold text-orange-800">हमारा स्थान</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="aspect-video w-full">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.2536900776364!2d77.20659841508096!3d28.56325198244407!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce26f903969d7%3A0x8f66310952faaa!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1647834159777!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

