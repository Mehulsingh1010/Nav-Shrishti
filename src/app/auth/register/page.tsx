"use client"

import type React from "react"

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
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions" }),
  }),
  captchaVerified: z.literal(true, {
    errorMap: () => ({ message: "Please verify you are not a robot" }),
  }),
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState<Partial<RegisterFormData>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

      // Submit to API
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Registration failed")
      }

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
    <div className="min-h-screen bg-[#f9f3e9] py-12">
      <div className="container mt-10 mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-[#c14d14] p-6 text-center">
            <h1 className="text-2xl font-bold text-white">नया सदस्य पंजीकरण</h1>
            <p className="text-[#f9f3e9] mt-2">Register as a new member</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Select name="title" onValueChange={(value) => handleSelectChange("title", value)}>
                  <SelectTrigger id="title" className="w-full">
                    <SelectValue placeholder="Select title" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mr">Mr</SelectItem>
                    <SelectItem value="Mrs">Mrs</SelectItem>
                    <SelectItem value="Ms">Ms</SelectItem>
                    <SelectItem value="Dr">Dr</SelectItem>
                  </SelectContent>
                </Select>
                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName || ""}
                  onChange={handleChange}
                  className="w-full"
                />
                {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="surname">Surname</Label>
                <Input
                  id="surname"
                  name="surname"
                  value={formData.surname || ""}
                  onChange={handleChange}
                  className="w-full"
                />
                {errors.surname && <p className="text-sm text-red-500">{errors.surname}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  value={formData.mobile || ""}
                  onChange={handleChange}
                  className="w-full"
                />
                {errors.mobile && <p className="text-sm text-red-500">{errors.mobile}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  className="w-full"
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-2 relative">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password || ""}
                    onChange={handleChange}
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="addressLine1">Address Line 1</Label>
              <Input
                id="addressLine1"
                name="addressLine1"
                value={formData.addressLine1 || ""}
                onChange={handleChange}
                className="w-full"
              />
              {errors.addressLine1 && <p className="text-sm text-red-500">{errors.addressLine1}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
              <Input
                id="addressLine2"
                name="addressLine2"
                value={formData.addressLine2 || ""}
                onChange={handleChange}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" value={formData.city || ""} onChange={handleChange} className="w-full" />
                {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state || ""}
                  onChange={handleChange}
                  className="w-full"
                />
                {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  name="pincode"
                  value={formData.pincode || ""}
                  onChange={handleChange}
                  className="w-full"
                />
                {errors.pincode && <p className="text-sm text-red-500">{errors.pincode}</p>}
              </div>
            </div>

            <div className="pt-4">
              <div className="flex items-start space-x-2 mb-6">
                <Checkbox
                  id="termsAccepted"
                  checked={formData.termsAccepted || false}
                  onCheckedChange={handleCheckboxChange}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="termsAccepted"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I have read and agree to the{" "}
                    <Link href="/terms" className="text-[#c14d14] hover:underline">
                      Terms and Conditions
                    </Link>
                  </label>
                </div>
              </div>
              {errors.termsAccepted && <p className="text-sm text-red-500 mt-1">{errors.termsAccepted}</p>}
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
                className="bg-[#c14d14] hover:bg-[#a03d0e] text-white px-8 py-2 rounded-md"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Registering..." : "Register"}
              </Button>
            </div>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-[#c14d14] hover:underline">
                  Login here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

