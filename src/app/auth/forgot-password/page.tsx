/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { z } from "zod"
import ReCAPTCHA from "react-google-recaptcha"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
  captchaVerified: z.boolean().refine(val => val === true, {
    message: "Please verify you are not a robot",
  }),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState<Partial<ForgotPasswordFormData>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleCaptchaChange = (value: string | null) => {
    setFormData((prev) => ({
      ...prev,
      captchaVerified: Boolean(value),
    }))
    if (errors.captchaVerified && value) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.captchaVerified
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate form data
      const validatedData = forgotPasswordSchema.parse(formData)

      // Submit to API (Commented out backend request)
      /*
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: validatedData.email }),
      })
      */

      setIsSubmitted(true)

      toast({
        title: "Reset Link Sent",
        description: "If an account exists with this email, you will receive a password reset link.",
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message
          }
        })
        setErrors(newErrors)
      } else {
        setIsSubmitted(true)
        toast({
          title: "Reset Link Sent",
          description: "If an account exists with this email, you will receive a password reset link.",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f9f3e9] py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-[#c14d14] p-6 text-center">
            <h1 className="text-2xl font-bold text-white">पासवर्ड रीसेट</h1>
            <p className="text-[#f9f3e9] mt-2">Forgot Password</p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  className="w-full"
                  placeholder="Enter your registered email"
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="flex justify-center">
                <ReCAPTCHA
                  sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // This is a test key
                  onChange={handleCaptchaChange}
                />
              </div>
              {errors.captchaVerified && <p className="text-sm text-red-500 text-center">{errors.captchaVerified}</p>}

              <div className="flex justify-center pt-4">
                <Button
                  type="submit"
                  className="bg-[#c14d14] hover:bg-[#a03d0e] text-white px-8 py-2 rounded-md w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="p-6 space-y-6 text-center">
              <h2 className="text-xl font-semibold mb-2">Check Your Email</h2>
              <p className="text-gray-600 mb-6">
                We&apos;ve sent a password reset link to your email address. Please check your inbox and follow the
                instructions.
              </p>
              <Link href="/auth/login">
                <Button className="bg-[#c14d14] hover:bg-[#a03d0e] text-white">Return to Login</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}