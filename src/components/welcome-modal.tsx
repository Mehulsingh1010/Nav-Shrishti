/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from 'lucide-react'



import { Button } from "@/components/ui/button"
import Link from "next/link"



interface WelcomeModalProps {
  isOpen: boolean
  onCloseAction: () => void
}



export default function WelcomeModal({ isOpen, onCloseAction }: WelcomeModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-orange-50 to-white rounded-lg shadow-xl max-w-lg w-full overflow-hidden"
          >
            <div className="relative">
              {/* Decorative top banner */}
              <div className="bg-gradient-to-r from-orange-800 to-orange-600 h-16 flex items-center justify-center">
                <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center">
                  <span className="text-orange-800 text-xl font-bold">ॐ</span>
                </div>
              </div>
              
              <button 
                onClick={onCloseAction}
                className="absolute top-3 right-3 text-white hover:text-orange-200 focus:outline-none"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 text-center">
              <h2 className="text-2xl font-bold text-orange-900 mb-2">नव श्रृष्टि में आपका स्वागत है</h2>
              <h3 className="text-lg text-orange-700 mb-4">Welcome to Nav Shristi</h3>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-6"
              >
                <p className="text-gray-700 mb-4">
                  Thank you for joining our community dedicated to the revival and promotion of Vedic culture and traditions.
                </p>
                <p className="text-gray-700">
                  Your journey with us begins now. Together, we will work towards preserving and spreading the ancient wisdom of Bharat.
                </p>
              </motion.div>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { title: "संस्कृति", description: "Explore our cultural heritage" },
                  { title: "शिक्षा", description: "Learn ancient wisdom" },
                  { title: "समुदाय", description: "Join our growing community" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + (index * 0.1), duration: 0.5 }}
                    className="bg-orange-50 p-3 rounded-lg"
                  >
                    <h4 className="font-semibold text-orange-800">{item.title}</h4>
                    <p className="text-xs text-gray-600">{item.description}</p>
                  </motion.div>
                ))}
              </div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Link href="/user-dashboard">
                <Button 
                  onClick={onCloseAction}
                  className="bg-orange-700 hover:bg-orange-800 text-white px-8 py-2"
                >
                  Begin Your Journey
                </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
