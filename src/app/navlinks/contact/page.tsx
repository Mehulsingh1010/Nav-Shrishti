import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Phone, MapPin, User, Users, Building, Briefcase, Handshake } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero section with improved spacing and background gradient */}
      <section className="bg-gradient-to-r from-orange-100 to-orange-50 py-16">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-orange-800">
              संपर्क करें
            </h1>
            <p className="max-w-[700px] text-gray-700 md:text-xl leading-relaxed">
              नव सृष्टि सृजन से जुड़ें और हमारे साथ वैदिक भारत के निर्माण में सहयोग करें
            </p>
          </div>
        </div>
      </section>

      {/* Tabs section with improved spacing and responsive design */}
      <section className="py-16">
        <div className="container px-4 md:px-6 mx-auto">
          <Tabs defaultValue="member" className="w-full">
            <div className="mb-8 flex justify-center">
              <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                <TabsTrigger value="member" className="flex flex-col items-center gap-2 py-4 px-3">
                  <User className="h-5 w-5" />
                  <span>सदस्य</span>
                </TabsTrigger>
                <TabsTrigger value="promoter" className="flex flex-col items-center gap-2 py-4 px-3">
                  <Users className="h-5 w-5" />
                  <span>प्रमोटर</span>
                </TabsTrigger>
                <TabsTrigger value="distributor" className="flex flex-col items-center gap-2 py-4 px-3">
                  <Briefcase className="h-5 w-5" />
                  <span>वितरक</span>
                </TabsTrigger>
                <TabsTrigger value="udyami" className="flex flex-col items-center gap-2 py-4 px-3">
                  <Building className="h-5 w-5" />
                  <span>उद्यमी</span>
                </TabsTrigger>
                <TabsTrigger value="partner" className="flex flex-col items-center gap-2 py-4 px-3">
                  <Handshake className="h-5 w-5" />
                  <span>पार्टनर</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="max-w-3xl mx-auto">
              <TabsContent value="member">
                <Card className="border-orange-200 shadow-md">
                  <CardHeader className="bg-orange-50 border-b border-orange-100">
                    <CardTitle className="text-2xl font-bold text-orange-800">सदस्य बनें</CardTitle>
                    <CardDescription className="text-gray-600">नव सृष्टि सृजन के सदस्य बनकर वैदिक संस्कृति के प्रचार में सहयोग करें</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <form className="grid gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label
                            htmlFor="first-name"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            पहला नाम
                          </label>
                          <Input id="first-name" placeholder="पहला नाम दर्ज करें" className="border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200" />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="last-name"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            अंतिम नाम
                          </label>
                          <Input id="last-name" placeholder="अंतिम नाम दर्ज करें" className="border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="email"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          ईमेल
                        </label>
                        <Input id="email" type="email" placeholder="आपका ईमेल पता" className="border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200" />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="phone"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          फोन नंबर
                        </label>
                        <Input id="phone" placeholder="आपका फोन नंबर" className="border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200" />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="message"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          संदेश
                        </label>
                        <Textarea 
                          id="message" 
                          placeholder="आप हमसे क्यों जुड़ना चाहते हैं?" 
                          rows={4} 
                          className="border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200" 
                        />
                      </div>
                      <Button className="w-full bg-orange-600 hover:bg-orange-700 transition-colors mt-2">
                        फॉर्म जमा करें
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="promoter">
                <Card className="border-orange-200 shadow-md">
                  <CardHeader className="bg-orange-50 border-b border-orange-100">
                    <CardTitle className="text-2xl font-bold text-orange-800">प्रमोटर बनें</CardTitle>
                    <CardDescription className="text-gray-600">नव सृष्टि सृजन के प्रमोटर बनकर वैदिक संस्कृति का प्रचार करें</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <form className="grid gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label
                            htmlFor="promoter-name"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            नाम
                          </label>
                          <Input id="promoter-name" placeholder="आपका नाम" className="border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200" />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="promoter-organization"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            संगठन
                          </label>
                          <Input id="promoter-organization" placeholder="आपके संगठन का नाम" className="border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="promoter-email"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          ईमेल
                        </label>
                        <Input id="promoter-email" type="email" placeholder="आपका ईमेल पता" className="border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200" />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="promoter-phone"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          फोन नंबर
                        </label>
                        <Input id="promoter-phone" placeholder="आपका फोन नंबर" className="border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200" />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="promoter-message"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          संदेश
                        </label>
                        <Textarea 
                          id="promoter-message" 
                          placeholder="आप किस प्रकार से प्रमोट करना चाहते हैं?" 
                          rows={4} 
                          className="border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200" 
                        />
                      </div>
                      <Button className="w-full bg-orange-600 hover:bg-orange-700 transition-colors mt-2">
                        फॉर्म जमा करें
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="distributor">
                <Card className="border-orange-200 shadow-md">
                  <CardHeader className="bg-orange-50 border-b border-orange-100">
                    <CardTitle className="text-2xl font-bold text-orange-800">वितरक बनें</CardTitle>
                    <CardDescription className="text-gray-600">नव सृष्टि सृजन के उत्पादों के वितरक बनें</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <form className="grid gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label
                            htmlFor="distributor-name"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            नाम
                          </label>
                          <Input id="distributor-name" placeholder="आपका नाम" className="border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200" />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="distributor-business"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            व्यवसाय का नाम
                          </label>
                          <Input id="distributor-business" placeholder="आपके व्यवसाय का नाम" className="border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="distributor-email"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          ईमेल
                        </label>
                        <Input id="distributor-email" type="email" placeholder="आपका ईमेल पता" className="border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200" />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="distributor-phone"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          फोन नंबर
                        </label>
                        <Input id="distributor-phone" placeholder="आपका फोन नंबर" className="border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200" />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="distributor-area"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          वितरण क्षेत्र
                        </label>
                        <Input id="distributor-area" placeholder="आपका वितरण क्षेत्र" className="border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200" />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="distributor-message"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          संदेश
                        </label>
                        <Textarea 
                          id="distributor-message" 
                          placeholder="आप किन उत्पादों का वितरण करना चाहते हैं?" 
                          rows={4} 
                          className="border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200" 
                        />
                      </div>
                      <Button className="w-full bg-orange-600 hover:bg-orange-700 transition-colors mt-2">
                        फॉर्म जमा करें
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="udyami">
                <Card className="border-orange-200 shadow-md">
                  <CardHeader className="bg-orange-50 border-b border-orange-100">
                    <CardTitle className="text-2xl font-bold text-orange-800">उद्यमी बनें</CardTitle>
                    <CardDescription className="text-gray-600">नव सृष्टि सृजन के साथ मिलकर स्वदेशी उत्पाद बनाएं</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <form className="grid gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label
                            htmlFor="udyami-name"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            नाम
                          </label>
                          <Input id="udyami-name" placeholder="आपका नाम" className="border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200" />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="udyami-business"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            व्यवसाय का नाम
                          </label>
                          <Input id="udyami-business" placeholder="आपके व्यवसाय का नाम" className="border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="udyami-email"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          ईमेल
                        </label>
                        <Input id="udyami-email" type="email" placeholder="आपका ईमेल पता" className="border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200" />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="udyami-phone"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          फोन नंबर
                        </label>
                        <Input id="udyami-phone" placeholder="आपका फोन नंबर" className="border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200" />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="udyami-product"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          उत्पाद श्रेणी
                        </label>
                        <Input id="udyami-product" placeholder="आप किस प्रकार के उत्पाद बनाते हैं?" className="border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200" />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="udyami-message"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          संदेश
                        </label>
                        <Textarea 
                          id="udyami-message" 
                          placeholder="आप हमारे साथ कैसे जुड़ना चाहते हैं?" 
                          rows={4} 
                          className="border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200" 
                        />
                      </div>
                      <Button className="w-full bg-orange-600 hover:bg-orange-700 transition-colors mt-2">
                        फॉर्म जमा करें
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="partner">
                <Card className="border-orange-200 shadow-md">
                  <CardHeader className="bg-orange-50 border-b border-orange-100">
                    <CardTitle className="text-2xl font-bold text-orange-800">पार्टनर बनें</CardTitle>
                    <CardDescription className="text-gray-600">नव सृष्टि सृजन के साथ रणनीतिक साझेदारी करें</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <form className="grid gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label
                            htmlFor="partner-name"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            नाम
                          </label>
                          <Input id="partner-name" placeholder="आपका नाम" className="border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200" />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="partner-organization"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            संगठन
                          </label>
                          <Input id="partner-organization" placeholder="आपके संगठन का नाम" className="border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="partner-email"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          ईमेल
                        </label>
                        <Input id="partner-email" type="email" placeholder="आपका ईमेल पता" className="border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200" />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="partner-phone"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          फोन नंबर
                        </label>
                        <Input id="partner-phone" placeholder="आपका फोन नंबर" className="border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200" />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="partner-type"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          साझेदारी का प्रकार
                        </label>
                        <Input id="partner-type" placeholder="आप किस प्रकार की साझेदारी करना चाहते हैं?" className="border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200" />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="partner-message"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          संदेश
                        </label>
                        <Textarea 
                          id="partner-message" 
                          placeholder="आप हमारे साथ कैसे सहयोग करना चाहते हैं?" 
                          rows={4} 
                          className="border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200" 
                        />
                      </div>
                      <Button className="w-full bg-orange-600 hover:bg-orange-700 transition-colors mt-2">
                        फॉर्म जमा करें
                      </Button>
                    </form>
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
                  <Link href="https://www.navsrishti.org" className="text-orange-600 hover:underline hover:text-orange-700 transition-colors">
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
