/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function TranslatorButton({ className = "" }: { className?: string }) {
  const [language, setLanguage] = useState("en")

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
    script.async = true
    script.onload = () => {
      if (window.googleTranslateElementInit) {
        window.googleTranslateElementInit()
      }
    }
    document.body.appendChild(script)

    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,hi",
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          "google_translate_element"
        )
      } else {
        console.error("Google Translate failed to initialize")
      }
    }

    return () => {
      document.body.removeChild(script)
      delete (window as any).googleTranslateElementInit
    }
  }, [])

  const toggleLanguage = () => {
    const newLang = language === "en" ? "hi" : "en"
    setLanguage(newLang)

    setTimeout(() => {
      const selectElement = document.querySelector(".goog-te-combo") as HTMLSelectElement
      if (selectElement) {
        selectElement.value = newLang
        selectElement.dispatchEvent(new Event("change"))
      } else {
        console.error("Google Translate element not found")
      }
    }, 500)
  }

  return (
    <>
      <Button onClick={toggleLanguage}>
        {language === "en" ? "हिन्दी" : "English"}
      </Button>
      <div id="google_translate_element" style={{ display: "none" }}></div>
    </>
  )
}
