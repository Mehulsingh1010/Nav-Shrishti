import type { Metadata } from "next"
import { Tiro_Devanagari_Hindi } from "next/font/google"
import "./globals.css"
import type React from "react"
import Navbar from "@/components/navbar"

const devanagari = Tiro_Devanagari_Hindi({
  weight: "400",
  subsets: ["devanagari"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "नव सृष्टि सृजन सेवा संस्थान",
  description: "वैदिक भारत के निर्माण के लिये हम आपका स्वागत करते हैं",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="hi" className={devanagari.className}>
      <body>
        {/* <Navbar /> */}
        {children}
      </body>
    </html>
  )
}



import './globals.css'