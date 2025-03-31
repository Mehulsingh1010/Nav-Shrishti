/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import emailjs from '@emailjs/browser'

interface ContactFormProps {
  formType: string
  formTitle: string
  formDescription: string
  fields: {
    firstName?: boolean
    lastName?: boolean
    organization?: boolean
    business?: boolean
    area?: boolean
    product?: boolean
    partnerType?: boolean
  }
}

export function ContactForm({ formType, formTitle, formDescription, fields }: ContactFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    name: "",
    email: "",
    phone: "",
    organization: "",
    business: "",
    area: "",
    product: "",
    partnerType: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id.replace(`${formType}-`, "")]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Prepare the data for EmailJS
      const templateParams: Record<string, string> = {
        form_type: formType,
        name: fields.firstName ? `${formData.firstName} ${formData.lastName}` : formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        organization: formData.organization,
        business: formData.business,
        area: formData.area,
        product: formData.product,
        partner_type: formData.partnerType,
      }

      // Send email using EmailJS
      const result = await emailjs.send(
        "service_hf117ct",
        "template_wglajrb",
        templateParams,
        "yxwlblu3oSqcK4wp6"
      )

      console.log("Email sent successfully:", result.text)
      toast({
        title: "फॉर्म सफलतापूर्वक भेजा गया",
        description: "हम जल्द ही आपसे संपर्क करेंगे",
        variant: "default",
      })

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        name: "",
        email: "",
        phone: "",
        organization: "",
        business: "",
        area: "",
        product: "",
        partnerType: "",
        message: "",
      })
    } catch (error) {
      console.error("Error sending email:", error)
      toast({
        title: "फॉर्म जमा करने में त्रुटि",
        description: "कृपया बाद में पुनः प्रयास करें",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      {fields.firstName && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input id="firstName" value={formData.firstName} onChange={handleChange} placeholder="पहला नाम" required />
          <Input id="lastName" value={formData.lastName} onChange={handleChange} placeholder="अंतिम नाम" required />
        </div>
      )}

      {fields.organization && <Input id="organization" value={formData.organization} onChange={handleChange} placeholder="संगठन" />}
      {fields.business && <Input id="business" value={formData.business} onChange={handleChange} placeholder="व्यवसाय" />}
      {fields.area && <Input id="area" value={formData.area} onChange={handleChange} placeholder="वितरण क्षेत्र" />}
      {fields.product && <Input id="product" value={formData.product} onChange={handleChange} placeholder="उत्पाद" />}
      {fields.partnerType && <Input id="partnerType" value={formData.partnerType} onChange={handleChange} placeholder="साझेदारी" />}

      <Input id="email" value={formData.email} onChange={handleChange} type="email" placeholder="ईमेल" required />
      <Input id="phone" value={formData.phone} onChange={handleChange} placeholder="फोन नंबर" required />
      <Textarea id="message" value={formData.message} onChange={handleChange} placeholder="संदेश" required />

      <Button type="submit" disabled={isSubmitting} className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3">
        {isSubmitting ? "प्रस्तुत कर रहा है..." : "जमा करें"}
      </Button>
    </form>
  )
}
