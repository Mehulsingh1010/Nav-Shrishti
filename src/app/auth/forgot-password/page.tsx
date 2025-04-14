/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState<"email" | "otp" | "newPassword">("email")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      // Check if response is OK before trying to parse JSON
      if (!res.ok) {
        const contentType = res.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json()
          throw new Error(data.error || `Server error: ${res.status}`)
        } else {
          // Handle non-JSON responses
          const text = await res.text()
          console.error("Non-JSON response:", text)
          throw new Error(`Server error: ${res.status}`)
        }
      }

      const data = await res.json()

      toast({
        title: "OTP Sent",
        description: "Please check your email for the OTP",
      })

      setStep("otp")
    } catch (err) {
      console.error("Send OTP error:", err)
      if (err instanceof Error) {
        setError(err.message || "Failed to send OTP. Please try again.")
      } else {
        setError("Failed to send OTP. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      })

      // Check if response is OK before trying to parse JSON
      if (!res.ok) {
        const contentType = res.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json()
          throw new Error(data.error || `Server error: ${res.status}`)
        } else {
          // Handle non-JSON responses
          const text = await res.text()
          console.error("Non-JSON response:", text)
          throw new Error(`Server error: ${res.status}`)
        }
      }

      const data = await res.json()

      toast({
        title: "OTP Verified",
        description: "Please set your new password",
      })

      setStep("newPassword")
    } catch (err) {
      console.error("Verify OTP error:", err)
      if (err instanceof Error) {
        setError(err.message || "Invalid OTP. Please try again.")
      } else {
        setError("Invalid OTP. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    setIsSubmitting(true)

    try {
      // Log the request payload for debugging
      console.log("Sending reset password request:", { email, otp, newPassword })

      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      })

      // Check if response is OK before trying to parse JSON
      if (!res.ok) {
        const contentType = res.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json()
          throw new Error(data.error || `Server error: ${res.status}`)
        } else {
          // Handle non-JSON responses
          const text = await res.text()
          console.error("Non-JSON response:", text)
          throw new Error(`Server error: ${res.status}`)
        }
      }

      const data = await res.json()

      toast({
        title: "Password Reset Successful",
        description: "You can now login with your new password",
      })

      router.push("/auth/login")
    } catch (err) {
      console.error("Reset password error:", err)
      if (err instanceof Error) {
        setError(err.message || "Failed to reset password. Please try again.")
      } else {
        setError("Failed to reset password. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f9f3e9] flex flex-col lg:flex-row">
      {/* Decorative Sidebar - Hidden on mobile, visible on lg screens and up */}
      <div className="hidden lg:block lg:w-1/2 relative bg-gradient-to-br from-orange-800 to-orange-600 p-6 lg:p-12">
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
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-3xl lg:text-5xl font-extrabold text-white leading-tight mb-4 lg:mb-6"
            >
              पासवर्ड रीसेट <span className="block text-orange-200">सुरक्षित पहुंच</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-lg lg:text-xl text-orange-100 mb-6 lg:mb-10 max-w-md mx-auto"
            >
              अपना पासवर्ड रीसेट करें और अपने खाते तक सुरक्षित पहुंच प्राप्त करें
            </motion.p>
          </div>

          {/* Footer */}
          <div className="relative z-10 mt-auto">
            <p className="text-orange-200 text-xs lg:text-sm text-center">© 2025 वैदिक भारत. सर्वाधिकार सुरक्षित.</p>
          </div>
        </div>
      </div>

      {/* Form - Always visible, centered on mobile, right side on desktop */}
      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-[#c14d14] p-6 text-center">
            <h1 className="text-2xl font-bold text-white">
              {step === "email" && "पासवर्ड भूल गए?"}
              {step === "otp" && "OTP सत्यापन"}
              {step === "newPassword" && "नया पासवर्ड सेट करें"}
            </h1>
            <p className="text-[#f9f3e9] mt-2">
              {step === "email" && "Forgot Password?"}
              {step === "otp" && "OTP Verification"}
              {step === "newPassword" && "Set New Password"}
            </p>
          </div>

          <div className="p-6 space-y-6">
            <Link href="/auth/login" className="flex items-center text-[#c14d14] hover:underline text-sm">
              <ArrowLeft size={16} className="mr-1" /> Back to Login
            </Link>

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            {step === "email" && (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    We&apos;ll send a one-time password (OTP) to your registered email address.
                  </p>
                </div>

                <Button type="submit" className="bg-[#c14d14] text-white w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </Button>
              </form>
            )}

            {step === "otp" && (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div>
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter the 6-digit OTP"
                    maxLength={6}
                    required
                  />
                  <p className="text-sm text-gray-500 mt-2">Please enter the 6-digit OTP sent to {email}</p>
                </div>

                <div className="flex flex-col space-y-3">
                  <Button type="submit" className="bg-[#c14d14] text-white w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify OTP"
                    )}
                  </Button>

                  <Button type="button" variant="outline" className="w-full" onClick={() => setStep("email")}>
                    Change Email
                  </Button>
                </div>
              </form>
            )}

            {step === "newPassword" && (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                  />
                </div>

                <Button type="submit" className="bg-[#c14d14] text-white w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resetting Password...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
