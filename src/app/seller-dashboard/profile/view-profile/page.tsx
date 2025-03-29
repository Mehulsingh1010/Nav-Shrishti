"use client"

import { useEffect, useState } from "react"
import ProfilePage from "@/components/profile-poge-2"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePageWrapper() {
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch("/api/profile")
        if (!response.ok) {
          throw new Error("Failed to fetch profile data")
        }
        const data = await response.json()
        setProfileData(data)
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast({
          title: "Error",
          description: "Failed to load profile data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProfileData()
  }, [toast])

  if (loading) {
    return (
      <div className="container mx-auto py-6 flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F05A28] mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading profile data...</p>
        </div>
      </div>
    )
  }

  return profileData ? <ProfilePage profileData={profileData} /> : null
}

