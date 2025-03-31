import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, MapPin, User, Phone, Mail } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function EventsPage() {
  const pastEvents = [
    {
      id: 1,
      title: "वार्षिक गुरुकुल समारोह",
      date: "15 जनवरी 2024",
      location: "गुरुकुल परिसर, नई दिल्ली",
      description: "वार्षिक शैक्षणिक समारोह जहां विद्यार्थियों ने अपनी उपलब्धियां साझा कीं",
      images: ["/g1.png", "/g2.png", "/g3.png"],
      participants: 250
    },
    {
      id: 2,
      title: "अंतर्राष्ट्रीय योग दिवस",
      date: "21 जून 2024",
      location: "सामुदायिक पार्क, बेंगलुरु",
      description: "बड़े पैमाने पर योग शिविर और जागरूकता कार्यक्रम",
      images: ["/g4.png", "/g5.png", "/g6.png"],
      participants: 500
    }
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: "आयुर्वेद स्वास्थ्य मेला",
      date: "10 अगस्त 2024",
      location: "राजघाट सभागार, नई दिल्ली",
      description: "निःशुल्क स्वास्थ्य परामर्श और आयुर्वेदिक उपचार शिविर",
      registrationFee: "₹ 0",
      contactPerson: {
        name: "डॉ. रेखा शर्मा",
        phone: "+91 98765 43210",
        email: "rekha.sharma@example.com"
      }
    },
    {
      id: 2,
      title: "ग्रामीण शिक्षा सशक्तिकरण कार्यक्रम",
      date: "25 सितंबर 2024",
      location: "ग्रामीण विकास केंद्र, पुणे",
      description: "ग्रामीण बच्चों के लिए शैक्षणिक और कौशल विकास कार्यक्रम",
      registrationFee: "₹ 500",
      contactPerson: {
        name: "श्री राहुल पाटिल",
        phone: "+91 97123 45678",
        email: "rahul.patil@example.com"
      }
    }
  ]

  interface Event {
    id: number;
    title: string;
    date: string;
    location: string;
    description: string;
    registrationFee: string;
    contactPerson: {
      name: string;
      phone: string;
      email: string;
    };
  }

  const EventRegistrationDialog = ({ event }: { event: Event }) => {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-orange-600 hover:bg-orange-700">
            इवेंट में पंजीकरण करें
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{event.title} में पंजीकरण</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">नाम</label>
              <Input id="name" placeholder="अपना नाम दर्ज करें" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="phone" className="text-right">फोन</label>
              <Input id="phone" placeholder="अपना फोन नंबर दर्ज करें" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="email" className="text-right">ईमेल</label>
              <Input id="email" placeholder="अपना ईमेल दर्ज करें" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="message" className="text-right">संदेश</label>
              <Textarea 
                id="message" 
                placeholder="अपना संदेश लिखें" 
                className="col-span-3 min-h-[100px]" 
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
              पंजीकरण
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-100 to-orange-50 py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-orange-800">
              हमारे कार्यक्रम
            </h1>
            <p className="max-w-[700px] text-gray-700 md:text-xl leading-relaxed">
              हमारी संस्था द्वारा आयोजित पिछले और आगामी कार्यक्रमों की झलक
            </p>
            <div className="w-24 h-1 bg-orange-500 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Past Events Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-orange-800 mb-8 text-center">
            पिछले कार्यक्रम
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {pastEvents.map((event) => (
              <Card 
                key={event.id} 
                className="overflow-hidden border-orange-200 shadow-md hover:shadow-lg transition-all hover:border-orange-300"
              >
                <div className="grid grid-cols-3 gap-2 p-2">
                  {event.images.map((img, index) => (
                    <div key={index} className="aspect-square relative">
                      <Image 
                        src={img} 
                        alt={`${event.title} image ${index + 1}`} 
                        fill 
                        className="object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-orange-700 mb-2">{event.title}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <Calendar className="h-5 w-5 mr-2 text-orange-500" />
                    {event.date}
                  </div>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="h-5 w-5 mr-2 text-orange-500" />
                    {event.location}
                  </div>
                  <p className="text-gray-700 mb-4">{event.description}</p>
                  <div className="flex items-center text-gray-600">
                    <User className="h-5 w-5 mr-2 text-orange-500" />
                    कुल भागीदार: {event.participants}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 bg-orange-50">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-orange-800 mb-8 text-center">
            आगामी कार्यक्रम
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {upcomingEvents.map((event) => (
              <Card 
                key={event.id} 
                className="overflow-hidden border-orange-200 shadow-md hover:shadow-lg transition-all hover:border-orange-300"
              >
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-orange-700 mb-2">{event.title}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <Calendar className="h-5 w-5 mr-2 text-orange-500" />
                    {event.date}
                  </div>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-5 w-5 mr-2 text-orange-500" />
                    {event.location}
                  </div>
                  <p className="text-gray-700 mb-4">{event.description}</p>
                  <div className="flex items-center text-gray-600 mb-4">
                    <User className="h-5 w-5 mr-2 text-orange-500" />
                    पंजीकरण शुल्क: {event.registrationFee}
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-orange-700 mb-2">संपर्क व्यक्ति</h4>
                    <div className="flex items-center mb-2">
                      <User className="h-5 w-5 mr-2 text-orange-500" />
                      {event.contactPerson.name}
                    </div>
                    <div className="flex items-center mb-2">
                      <Phone className="h-5 w-5 mr-2 text-orange-500" />
                      {event.contactPerson.phone}
                    </div>
                    <div className="flex items-center mb-4">
                      <Mail className="h-5 w-5 mr-2 text-orange-500" />
                      {event.contactPerson.email}
                    </div>
                    <div>
                      <EventRegistrationDialog event={event} />
                    </div>
                  </div>
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
              नव सृष्टि सृजन के साथ जुड़कर आप भी हमारे विभिन्न कार्यक्रमों में योगदान दे सकते हैं। हमारे विभिन्न गतिविधियों और कार्यक्रमों के बारे में जानने के लिए हमसे संपर्क करें।
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