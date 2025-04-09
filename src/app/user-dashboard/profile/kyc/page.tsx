"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
// import Link from "next/link"
import { motion } from "framer-motion"
import { Upload, CheckCircle, AlertCircle,FileText, Camera, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"

type DocumentStatus = "pending" | "uploading" | "verifying" | "verified" | "rejected"

interface Document {
  id: string
  name: string
  description: string
  status: DocumentStatus
  errorMessage?: string
}

export default function KYCVerificationPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "aadhar",
      name: "Aadhar Card",
      description: "Upload front and back of your Aadhar card",
      status: "pending",
    },
    {
      id: "pan",
      name: "PAN Card",
      description: "Upload a clear image of your PAN card",
      status: "pending",
    },
    {
      id: "selfie",
      name: "Selfie Verification",
      description: "Take a clear selfie holding your ID card",
      status: "pending",
    },
  ])

  const [overallProgress, setOverallProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const handleFileUpload = (documentId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    // Update document status to uploading
    setDocuments((prev) => prev.map((doc) => (doc.id === documentId ? { ...doc, status: "uploading" } : doc)))

    // Mock upload progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      if (progress >= 100) {
        clearInterval(interval)

        // After upload complete, change status to verifying
        setDocuments((prev) => prev.map((doc) => (doc.id === documentId ? { ...doc, status: "verifying" } : doc)))

        // Mock verification process
        setTimeout(() => {
          // Randomly decide if verification passed (90% chance of success)
          const isVerified = Math.random() < 0.9

          setDocuments((prev) =>
            prev.map((doc) =>
              doc.id === documentId
                ? {
                    ...doc,
                    status: isVerified ? "verified" : "rejected",
                    errorMessage: isVerified ? undefined : "Document unclear or invalid. Please try again.",
                  }
                : doc,
            ),
          )

          // Update overall progress
          updateOverallProgress()

          // Show toast notification
          if (isVerified) {
            toast({
              title: "Document Verified",
              description: `Your ${documentId === "aadhar" ? "Aadhar Card" : documentId === "pan" ? "PAN Card" : "Selfie"} has been successfully verified.`,
            })
          } else {
            toast({
              title: "Verification Failed",
              description: `Your ${documentId === "aadhar" ? "Aadhar Card" : documentId === "pan" ? "PAN Card" : "Selfie"} could not be verified. Please try again.`,
              variant: "destructive",
            })
          }
        }, 2000)
      }
    }, 200)
  }

  const updateOverallProgress = () => {
    const verifiedCount = documents.filter((doc) => doc.status === "verified").length
    const newProgress = Math.round((verifiedCount / documents.length) * 100)
    setOverallProgress(newProgress)

    // Check if all documents are verified
    if (verifiedCount === documents.length) {
      setIsComplete(true)
    }
  }

  const handleCompleteKYC = () => {
    setIsProcessing(true)

    // Mock final processing
    setTimeout(() => {
      setIsProcessing(false)
      toast({
        title: "KYC Verification Complete",
        description: "Your identity has been successfully verified. You now have full access to all features.",
      })

      // Redirect to dashboard
      router.push("/user-dashboard")
    }, 2000)
  }

  const getStatusIcon = (status: DocumentStatus) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "rejected":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "uploading":
      case "verifying":
        return (
          <svg
            className="animate-spin h-5 w-5 text-orange-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )
      default:
        return <Upload className="h-5 w-5 text-orange-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100/30 to-orange-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-orange-900">KYC Verification</h1>
            <p className="text-orange-700 mt-2">Complete your identity verification to access all features</p>
          </div>

          <Card className="mb-8 bg-white/80 backdrop-blur shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-orange-800">Verification Progress</h2>
                  <p className="text-sm text-gray-600">Complete all steps to verify your identity</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium">{overallProgress}% Complete</span>
                </div>
              </div>

              <Progress value={overallProgress} className="h-2 mb-6" />

              <div className="grid gap-4">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className={`border rounded-lg p-4 transition-colors ${
                      doc.status === "verified"
                        ? "bg-green-50 border-green-200"
                        : doc.status === "rejected"
                          ? "bg-red-50 border-red-200"
                          : "bg-white border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="mt-1">
                          {doc.id === "aadhar" && <FileText className="h-6 w-6 text-orange-600" />}
                          {doc.id === "pan" && <FileText className="h-6 w-6 text-orange-600" />}
                          {doc.id === "selfie" && <Camera className="h-6 w-6 text-orange-600" />}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{doc.name}</h3>
                          <p className="text-sm text-gray-600">{doc.description}</p>

                          {doc.status === "rejected" && <p className="text-sm text-red-600 mt-1">{doc.errorMessage}</p>}
                        </div>
                      </div>

                      <div className="flex items-center">
                        {getStatusIcon(doc.status)}
                        <span className="ml-2 text-sm capitalize">
                          {doc.status === "uploading"
                            ? "Uploading..."
                            : doc.status === "verifying"
                              ? "Verifying..."
                              : doc.status}
                        </span>
                      </div>
                    </div>

                    {(doc.status === "pending" || doc.status === "rejected") && (
                      <div className="mt-3">
                        <label className="relative">
                          <Button
                            variant="outline"
                            className="w-full bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {doc.status === "rejected" ? "Upload Again" : "Upload Document"}
                          </Button>
                          <input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={(e) => handleFileUpload(doc.id, e)}
                            accept="image/*"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-6 text-center"
                >
                  <p className="text-green-600 font-medium mb-4">All documents have been successfully verified!</p>
                  <Button
                    onClick={handleCompleteKYC}
                    disabled={isProcessing}
                    className="bg-orange-700 hover:bg-orange-800 text-white px-8 py-5 h-auto text-base"
                  >
                    {isProcessing ? "Processing..." : "Complete KYC Verification"}
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h3 className="font-medium text-orange-800 mb-2 flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Your Privacy & Security
            </h3>
            <p className="text-sm text-gray-700">
              Your documents are encrypted and securely stored. We comply with all data protection regulations and your
              information will only be used for verification purposes.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
