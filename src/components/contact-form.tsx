/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

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
      // Prepare the data for submission
      const name = fields.firstName ? `${formData.firstName} ${formData.lastName}` : formData.name

      const submissionData = {
        formType,
        name,
        email: formData.email,
        phone: formData.phone,
        organization: formData.organization,
        business: formData.business,
        area: formData.area,
        product: formData.product,
        partnerType: formData.partnerType,
        message: formData.message,
      }

      // Send the data to the API
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      })

      if (!response.ok) {
        throw new Error("Failed to submit form")
      }

      // Show success message
      toast({
        title: "फॉर्म सफलतापूर्वक जमा किया गया",
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
      console.error("Error submitting form:", error)
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
      {fields.firstName ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label
              htmlFor={`${formType}-firstName`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              पहला नाम
            </label>
            <Input
              id={`${formType}-firstName`}
              value={formData.firstName}
              onChange={handleChange}
              placeholder="पहला नाम दर्ज करें"
              className="border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200 rounded-md"
              required
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor={`${formType}-lastName`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              अंतिम नाम
            </label>
            <Input
              id={`${formType}-lastName`}
              value={formData.lastName}
              onChange={handleChange}
              placeholder="अंतिम नाम दर्ज करें"
              className="border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200 rounded-md"
              required
            />
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <label
            htmlFor={`${formType}-name`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            नाम
          </label>
          <Input
            id={`${formType}-name`}
            value={formData.name}
            onChange={handleChange}
            placeholder="आपका नाम"
            className="border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200 rounded-md"
            required
          />
        </div>
      )}

      {fields.organization && (
        <div className="space-y-2">
          <label
            htmlFor={`${formType}-organization`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            संगठन
          </label>
          <Input
            id={`${formType}-organization`}
            value={formData.organization}
            onChange={handleChange}
            placeholder="आपके संगठन का नाम"
            className="border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200 rounded-md"
            required
          />
        </div>
      )}

      {fields.business && (
        <div className="space-y-2">
          <label
            htmlFor={`${formType}-business`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            व्यवसाय का नाम
          </label>
          <Input
            id={`${formType}-business`}
            value={formData.business}
            onChange={handleChange}
            placeholder="आपके व्यवसाय का नाम"
            className="border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200 rounded-md"
            required
          />
        </div>
      )}

      <div className="space-y-2">
        <label
          htmlFor={`${formType}-email`}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          ईमेल
        </label>
        <Input
          id={`${formType}-email`}
          value={formData.email}
          onChange={handleChange}
          type="email"
          placeholder="आपका ईमेल पता"
          className="border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200 rounded-md"
          required
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor={`${formType}-phone`}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          फोन नंबर
        </label>
        <Input
          id={`${formType}-phone`}
          value={formData.phone}
          onChange={handleChange}
          placeholder="आपका फोन नंबर"
          className="border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200 rounded-md"
          required
        />
      </div>

      {fields.area && (
        <div className="space-y-2">
          <label
            htmlFor={`${formType}-area`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            वितरण क्षेत्र
          </label>
          <Input
            id={`${formType}-area`}
            value={formData.area}
            onChange={handleChange}
            placeholder="आपका वितरण क्षेत्र"
            className="border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200 rounded-md"
            required
          />
        </div>
      )}

      {fields.product && (
        <div className="space-y-2">
          <label
            htmlFor={`${formType}-product`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            उत्पाद श्रेणी
          </label>
          <Input
            id={`${formType}-product`}
            value={formData.product}
            onChange={handleChange}
            placeholder="आप किस प्रकार के उत्पाद बनाते हैं?"
            className="border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200 rounded-md"
            required
          />
        </div>
      )}

      {fields.partnerType && (
        <div className="space-y-2">
          <label
            htmlFor={`${formType}-partnerType`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            साझेदारी का प्रकार
          </label>
          <Input
            id={`${formType}-partnerType`}
            value={formData.partnerType}
            onChange={handleChange}
            placeholder="आप किस प्रकार की साझेदारी करना चाहते हैं?"
            className="border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200 rounded-md"
            required
          />
        </div>
      )}

      <div className="space-y-2">
        <label
          htmlFor={`${formType}-message`}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          संदेश
        </label>
        <Textarea
          id={`${formType}-message`}
          value={formData.message}
          onChange={handleChange}
          placeholder="आपका संदेश"
          rows={4}
          className="border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200 rounded-md"
          required
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 rounded-md transition-colors mt-4 shadow-md hover:shadow-lg"
      >
        {isSubmitting ? "प्रस्तुत कर रहा है..." : "फॉर्म जमा करें"}
      </Button>
    </form>
  )
}

