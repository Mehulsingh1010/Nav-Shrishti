/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import Preloader from "./preloader";

export default function HeroSection() {
  return (
    <div className="relative min-h-screen mt-[-50px] bg-gradient-to-br from-orange-50 via-orange-100/30 to-orange-50 pt-20 overflow-hidden flex items-center justify-center">
      <Preloader/>
      {/* Circular Rotating Mantra Around Main Heading */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute w-full h-full flex items-center justify-center"
        >
          <svg viewBox="0 0 200 200" className="absolute w-full h-full">
            <path
              id="circlePath"
              fill="transparent"
              d="M 100, 100
                 m -90, 0
                 a 90,90 0 1,1 180,0
                 a 90,90 0 1,1 -180,0"
            />
            <text fill="#b45309" fontSize="14" fontWeight="bold">
              <textPath xlinkHref="#circlePath" startOffset="50%">
                ॐ नमः शिवाय • हरे कृष्ण हरे राम • श्री राम जय राम जय जय राम •
                ॐ गं गणपतये नमः • ॐ ह्रीं क्लीं महालक्ष्म्यै नमः •
              </textPath>
            </text>
          </svg>
        </motion.div>
      </div>

      {/* Hero Content */}
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          
          {/* Left Content */}
          <div className="relative flex flex-col items-center lg:items-start">
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="inline-block px-5 py-2 bg-orange-200 rounded-full text-orange-900 font-semibold text-sm tracking-wide shadow-md"
            >
              वैदिक संस्कृति का पुनरुत्थान
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="text-5xl lg:text-7xl font-extrabold text-orange-900 leading-tight mt-4 text-center lg:text-left relative"
            >
              वैदिक भारत के{" "}
              <span className="block text-orange-700">निर्माण के लिये</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-lg text-orange-800 mt-6 max-w-lg text-center lg:text-left"
            >
              हम आपका स्वागत करते हैं
            </motion.p>
          </div>

          {/* Right Column - Image Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4 relative">
              {[
                { src: "/1.jpg", title: "गुरुकुल शिक्षा", description: "पारंपरिक शिक्षा का आधुनिक दृष्टिकोण" },
                { src: "/2.jpg", title: "योग साधना", description: "शारीरिक और मानसिक स्वास्थ्य का मार्ग" },
                { src: "/3.jpg", title: "मंदिर संस्कृति", description: "आध्यात्मिक विरासत का संरक्षण" },
              ].map((image, index) => (
                <motion.div
                  key={image.src}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.2 }}
                  className={`group relative ${index === 2 ? "col-span-2" : ""}`}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src={image.src}
                      alt={image.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-xl font-bold text-white mb-2">
                          {image.title}
                        </h3>
                        <p className="text-white/90 text-sm">{image.description}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
