/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { z } from "zod"
import ReCAPTCHA from "react-google-recaptcha"
import { Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent } from "@/components/ui/card"

const registerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  firstName: z.string().min(1, "First name is required"),
  surname: z.string().min(1, "Surname is required"),
  mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  addressLine1: z.string().min(1, "Address line 1 is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().min(6, "Pincode must be 6 digits"),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
  captchaVerified: z.boolean().refine((val) => val === true, {
    message: "Please verify you are not a robot",
  }),
  referralCode: z.string().optional(), // Added referralCode as an optional field
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState<Partial<RegisterFormData>>(() => {
    if (typeof window !== "undefined") {
      return {
        referralCode: new URLSearchParams(window.location.search).get("ref") || "", // Get referral code from URL if present
      }
    }
    return {}
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, termsAccepted: checked }))
    if (errors.termsAccepted && checked) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.termsAccepted
        return newErrors
      })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
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
      const validatedData = registerSchema.parse(formData)

      // Prepare data for API (remove captchaVerified as it's not needed in the API)
      const { captchaVerified, ...apiData } = validatedData

      // Submit to API
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Registration failed")
      }

      const data = await response.json()

      // Show success message with reference ID
      toast({
        title: "Registration Successful",
        description: `Your reference ID is ${data.referenceId}. Please keep it safe for future reference.`,
      })

      // Redirect to login page after successful registration
      setTimeout(() => {
        router.push("/auth/login")
      }, 2000)
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
        toast({
          title: "Registration Failed",
          description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row overflow-hidden">
      {/* Left Side - Design Elements (Fixed position, Hidden on mobile, shown on lg screens) */}
      <div className="hidden lg:block lg:w-5/12 xl:w-1/2 relative bg-gradient-to-br from-orange-800 to-orange-600 p-6 lg:p-12">
        <div className="h-full flex flex-col justify-between overflow-hidden">
          {/* Logo at the top */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative z-10"
          >
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 lg:h-12 lg:w-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-orange-800 text-xl lg:text-2xl font-bold">ॐ</span>
              </div>
              <h2 className="text-white text-xl lg:text-2xl font-bold">वैदिक भारत</h2>
            </div>
          </motion.div>

          {/* Circular Rotating Mantra */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] lg:w-[350px] lg:h-[350px] opacity-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
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
                <text fill="#fff" fontSize="14" fontWeight="bold">
                  <textPath xlinkHref="#circlePath" startOffset="50%">
                    ॐ नमः शिवाय • हरे कृष्ण हरे राम • श्री राम जय राम जय जय राम • ॐ गं गणपतये नमः • ॐ ह्रीं क्लीं महालक्ष्म्यै नमः •
                  </textPath>
                </text>
              </svg>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="relative z-10 text-center my-auto">
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-block px-4 py-1.5 lg:px-5 lg:py-2 bg-white/20 rounded-full text-white font-semibold text-xs lg:text-sm tracking-wide mb-4 lg:mb-6"
            >
              वैदिक संस्कृति का पुनरुत्थान
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-3xl lg:text-5xl font-extrabold text-white leading-tight mb-4 lg:mb-6"
            >
              वैदिक भारत के <span className="block text-orange-200">निर्माण के लिये</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-lg lg:text-xl text-orange-100 mb-6 lg:mb-10 max-w-md mx-auto"
            >
              हमारे समुदाय से जुड़ें और एक साथ भारतीय संस्कृति का संवर्धन करें
            </motion.p>

            {/* Grid images */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-2 gap-4 lg:gap-6 max-w-lg mx-auto"
            >
              {[
                { title: "गुरुकुल शिक्षा", description: "पारंपरिक शिक्षा का आधुनिक दृष्टिकोण" },
                { title: "योग साधना", description: "शारीरिक और मानसिक स्वास्थ्य का मार्ग" },
                { title: "मंदिर संस्कृति", description: "आध्यात्मिक विरासत का संरक्षण" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5, scale: 1.05 }}
                  className={`p-4 lg:p-5 bg-white/10 backdrop-blur-sm rounded-lg text-left ${
                    index === 2 ? "col-span-2" : ""
                  }`}
                >
                  <h3 className="text-base lg:text-lg font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-orange-100 text-xs lg:text-sm">{item.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Footer */}
          <div className="relative z-10 mt-auto">
            <p className="text-orange-200 text-xs lg:text-sm text-center">© 2025 वैदिक भारत. सर्वाधिकार सुरक्षित.</p>
          </div>
        </div>
      </div>

      {/* Mobile Header - Only visible on small screens */}
      <div className="lg:hidden bg-gradient-to-r from-orange-800 to-orange-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-orange-800 text-lg font-bold">ॐ</span>
            </div>
            <h2 className="text-white text-lg font-bold">वैदिक भारत</h2>
          </div>
          <span className="text-sm bg-white/20 px-3 py-1 rounded-full">संस्कृति का पुनरुत्थान</span>
        </div>
      </div>

      {/* Right Side - Scrollable Registration Form */}
      <div className="w-full lg:w-7/12 xl:w-1/2 overflow-y-auto h-[calc(100vh-64px)] lg:h-screen bg-gradient-to-br from-orange-50 via-orange-100/30 to-orange-50">
        <div className="px-4 py-6 md:px-8 lg:py-10 lg:px-12">
          <Card className="w-full max-w-2xl mx-auto shadow-md bg-white/80 backdrop-blur mb-8">
            <CardContent className="pt-6 px-4 md:px-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-orange-900">नया सदस्य पंजीकरण</h2>
                <p className="text-orange-700 mt-2">Register as a new member</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Personal Information Section */}
                <div className="bg-orange-50 p-4 rounded-lg mb-2">
                  <h3 className="text-lg font-medium text-orange-800 mb-3">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-sm font-medium">
                        Title
                      </Label>
                      <Select name="title" onValueChange={(value) => handleSelectChange("title", value)}>
                        <SelectTrigger id="title" className="w-full bg-white">
                          <SelectValue placeholder="Select title" />
                        </SelectTrigger>
                        <SelectContent className="">
                          <SelectItem value="Mr">Mr</SelectItem>
                          <SelectItem value="Mrs">Mrs</SelectItem>
                          <SelectItem value="Ms">Ms</SelectItem>
                          <SelectItem value="Dr">Dr</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName || ""}
                        onChange={handleChange}
                        className="w-full bg-white"
                      />
                      {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="surname" className="text-sm font-medium">
                        Surname
                      </Label>
                      <Input
                        id="surname"
                        name="surname"
                        value={formData.surname || ""}
                        onChange={handleChange}
                        className="w-full bg-white"
                      />
                      {errors.surname && <p className="text-xs text-red-500">{errors.surname}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mobile" className="text-sm font-medium">
                        Mobile Number
                      </Label>
                      <Input
                        id="mobile"
                        name="mobile"
                        type="tel"
                        value={formData.mobile || ""}
                        onChange={handleChange}
                        className="w-full bg-white"
                      />
                      {errors.mobile && <p className="text-xs text-red-500">{errors.mobile}</p>}
                    </div>
                  </div>
                </div>

                {/* Account Details Section */}
                <div className="bg-orange-50 p-4 rounded-lg mb-2">
                  <h3 className="text-lg font-medium text-orange-800 mb-3">Account Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email || ""}
                        onChange={handleChange}
                        className="w-full bg-white"
                      />
                      {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                    </div>

                    <div className="space-y-2 relative">
                      <Label htmlFor="password" className="text-sm font-medium">
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password || ""}
                          onChange={handleChange}
                          className="w-full pr-10 bg-white"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div className="bg-orange-50 p-4 rounded-lg mb-2">
                  <h3 className="text-lg font-medium text-orange-800 mb-3">Address</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="addressLine1" className="text-sm font-medium">
                        Address Line 1
                      </Label>
                      <Input
                        id="addressLine1"
                        name="addressLine1"
                        value={formData.addressLine1 || ""}
                        onChange={handleChange}
                        className="w-full bg-white"
                      />
                      {errors.addressLine1 && <p className="text-xs text-red-500">{errors.addressLine1}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="addressLine2" className="text-sm font-medium">
                        Address Line 2 (Optional)
                      </Label>
                      <Input
                        id="addressLine2"
                        name="addressLine2"
                        value={formData.addressLine2 || ""}
                        onChange={handleChange}
                        className="w-full bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-sm font-medium">
                          City
                        </Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city || ""}
                          onChange={handleChange}
                          className="w-full bg-white"
                        />
                        {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state" className="text-sm font-medium">
                          State
                        </Label>
                        <Input
                          id="state"
                          name="state"
                          value={formData.state || ""}
                          onChange={handleChange}
                          className="w-full bg-white"
                        />
                        {errors.state && <p className="text-xs text-red-500">{errors.state}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="pincode" className="text-sm font-medium">
                          Pincode
                        </Label>
                        <Input
                          id="pincode"
                          name="pincode"
                          value={formData.pincode || ""}
                          onChange={handleChange}
                          className="w-full bg-white"
                        />
                        {errors.pincode && <p className="text-xs text-red-500">{errors.pincode}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Referral Code Section */}
                <div className="bg-orange-50 p-4 rounded-lg mb-2">
                  <h3 className="text-lg font-medium text-orange-800 mb-3">Referral</h3>
                  <div className="space-y-2">
                    <Label htmlFor="referralCode" className="text-sm font-medium">
                      Referral Code (Optional)
                    </Label>
                    <Input
                      id="referralCode"
                      name="referralCode"
                      value={formData.referralCode || ""}
                      onChange={handleChange}
                      placeholder="Enter 6-digit referral code"
                      className="w-full bg-white"
                    />
                    <p className="text-xs text-muted-foreground">
                      If someone referred you, enter their 6-digit code here
                    </p>
                  </div>
                </div>

                {/* Terms and CAPTCHA Section */}
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-2 mb-4">
                    <Checkbox
                      id="termsAccepted"
                      checked={formData.termsAccepted || false}
                      onCheckedChange={handleCheckboxChange}
                      className="mt-1"
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="termsAccepted"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I have read and agree to the
                        <Link href="/terms" className="text-orange-700 hover:underline">
                          Terms and Conditions
                        </Link>
                      </label>
                    </div>
                  </div>
                  {errors.termsAccepted && <p className="text-xs text-red-500 mb-4">{errors.termsAccepted}</p>}

                  <div className="flex justify-center">
                    <div className="transform scale-75 md:scale-100 origin-top">
                      <ReCAPTCHA
                        sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // This is a test key
                        onChange={handleCaptchaChange}
                      />
                    </div>
                  </div>
                  {errors.captchaVerified && (
                    <p className="text-xs text-red-500 text-center mt-2">{errors.captchaVerified}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-4">
                  <Button
                    type="submit"
                    className="bg-orange-700 hover:bg-orange-800 text-white px-8 py-5 h-auto text-base md:text-lg rounded-md w-full md:w-auto md:min-w-40"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Registering..." : "Register"}
                  </Button>
                </div>

                <div className="text-center mt-4">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link href="/auth/login" className="text-orange-700 hover:underline">
                      Login here
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

