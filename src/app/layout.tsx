/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { usePathname } from "next/navigation" // Import usePathname for client-side
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

// export const metadata: Metadata = {
//   title: "नव सृष्टि सृजन सेवा संस्थान",
//   description: "वैदिक भारत के निर्माण के लिये हम आपका स्वागत करते हैं",
//   generator: "v0.dev",
// }

// This is the RootLayout which runs on the server-side.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // On the server side, we cannot directly access the path. So, we'll conditionally check it in the client
  // by using a different logic
  return (
    <html lang="hi" className={devanagari.className}>
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}

// This will render on the client-side only to decide whether to show the Navbar based on the path
function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Conditionally render the Navbar only on the home page (`/`)
  return (
    <>
      {pathname === "/" && <Navbar />}
      {children}
    </>
  )
}
