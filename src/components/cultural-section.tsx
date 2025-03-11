"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export default function CulturalSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/om-pattern.svg')] opacity-5" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-orange-800 mb-6">सनातन संस्कृति और परंपरा</h2>
          <p className="text-lg text-gray-700">भारतीय संस्कृति की समृद्ध विरासत का संरक्षण और प्रसार</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
              <Image src="/11.jpg" alt="सांस्कृतिक गतिविधियां" fill className="object-cover" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {["वैदिक शिक्षा और संस्कार", "योग और आध्यात्मिक साधना", "पारंपरिक कला और संगीत", "आयुर्वेदिक ज्ञान"].map(
              (item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-orange-50 rounded-lg"
                >
                  <span className="text-orange-600 text-lg">॥</span>
                  <p className="text-lg text-gray-800">{item}</p>
                </motion.div>
              ),
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

