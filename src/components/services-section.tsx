"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

const services = [
  {
    title: "गुरुकुल",
    description: "पारंपरिक वैदिक शिक्षा प्रणाली",
    image: "/3.jpg",
  },
  {
    title: "धर्म यज्ञ क्षेत्र",
    description: "पवित्र अनुष्ठान और यज्ञ",
    image: "/5.jpg",
  },
  {
    title: "गौ शाला",
    description: "गौ सेवा और संरक्षण",
    image: "/6.jpg",
  },
  {
    title: "योग व्यायाम केन्द्र",
    description: "योग और ध्यान का केंद्र",
    image: "/7.jpg",
  },
  {
    title: "सनातन धर्म दर्शन क्षेत्र",
    description: "सनातन धर्म का ज्ञान",
    image: "/8.jpg",
  },
  {
    title: "वैदिक स्वदेशी बाजार",
    description: "पारंपरिक उत्पाद",
    image: "/10.png",
  },
]

export default function ServicesSection() {
  return (
    <section className="py-20 bg-orange-50">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center text-orange-800 mb-12"
        >
          हमारे प्रमुख आयाम
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image src={service.image || "/placeholder.svg"} alt={service.title} fill className="object-cover" />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-orange-700 mb-2">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

