/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Calendar, Upload, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BankDetailsForm } from "@/app/seller-dashboard/_components/bank-details-form"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { useRouter } from "next/navigation"

interface ProfilePageProps {
  profileData?: ProfileData
}

interface ProfileData {
  user?: {
    firstName?: string
    surname?: string
    dob?: string
    fatherName?: string
    mobile?: string
    email?: string
    addressLine1?: string
    addressLine2?: string
    landmark?: string
    city?: string
    state?: string
    pincode?: string
    createdAt?: string
    referenceId?: string
    sponsorId?: string
    sponsorName?: string
    name?: string
  }
  nominee?: {
    name?: string
    relation?: string
    dob?: string
    mobile?: string
    address?: string
  }
  documents?: {
    profile_photo?: string
    aadhaar_front?: string
    aadhaar_back?: string
    pan_card?: string
    bank_passbook?: string
    cancelled_cheque?: string
  }
}

export default function ProfilePage({ profileData }: { profileData: ProfileData }) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    personal: {
      firstName: profileData?.user?.firstName || "",
      surname: profileData?.user?.surname || "",
      dob: profileData?.user?.dob || "",
      fatherName: profileData?.user?.fatherName || "",
      mobile: profileData?.user?.mobile || "",
      email: profileData?.user?.email || "",
      addressLine1: profileData?.user?.addressLine1 || "",
      addressLine2: profileData?.user?.addressLine2 || "",
      landmark: profileData?.user?.landmark || "",
      city: profileData?.user?.city || "",
      state: profileData?.user?.state || "",
      pincode: profileData?.user?.pincode || "",
    },
    nominee: {
      name: profileData?.nominee?.name || "",
      relation: profileData?.nominee?.relation || "",
      dob: profileData?.nominee?.dob || "",
      mobile: profileData?.nominee?.mobile || "",
      address: profileData?.nominee?.address || "",
    },
  })

  const router = useRouter()

  const handleInputChange = (section: "personal" | "nominee", field: string, value: string) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value,
      },
    })
  }

  const handleSavePersonal = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/profile/personal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData.personal),
      })

      if (!response.ok) {
        throw new Error("Failed to update personal information")
      }

      toast({
        title: "Success",
        description: "Personal information updated successfully",
      })
    } catch (error) {
      console.error("Error updating personal info:", error)
      toast({
        title: "Error",
        description: "Failed to update personal information",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveNominee = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/profile/nominee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData.nominee),
      })

      if (!response.ok) {
        throw new Error("Failed to update nominee information")
      }

      toast({
        title: "Success",
        description: "Nominee information updated successfully",
      })
    } catch (error) {
      console.error("Error updating nominee info:", error)
      toast({
        title: "Error",
        description: "Failed to update nominee information",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileUpload = async (documentType: string | Blob, file: string | Blob) => {
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)
    formData.append("documentType", documentType)

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/profile/documents", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload document")
      }

      toast({
        title: "Success",
        description: "Document uploaded successfully",
      })

      // Refresh the page to show the updated document
      window.location.reload()
    } catch (error) {
      console.error("Error uploading document:", error)
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Format registration date
  const registrationDate = profileData?.user?.createdAt
    ? format(new Date(profileData.user.createdAt), "MMMM yyyy")
    : "March 2024"

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (profileData?.user?.firstName && profileData?.user?.surname) {
      return `${profileData.user.firstName.charAt(0)}${profileData.user.surname.charAt(0)}`
    }
    return "MS"
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#8B4513]">User Profile</h1>
          <p className="text-muted-foreground">View and manage your profile information</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-32 w-32">
                <AvatarImage
                  src={profileData?.documents?.profile_photo || "/placeholder.svg?height=128&width=128"}
                  alt="Profile"
                />
                <AvatarFallback className="text-4xl">{getInitials()}</AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-2xl">{profileData?.user?.name || "Mehul Singh"}</CardTitle>
            <CardDescription>Member since {registrationDate}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">User ID</span>
                <span className="font-medium">{profileData?.user?.referenceId || ""}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sponsor ID</span>
                <span className="font-medium">{profileData?.user?.sponsorId || ""}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sponsor Name</span>
                <span className="font-medium">{profileData?.user?.sponsorName || ""}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Registration Date</span>
                <span className="font-medium">{registrationDate}</span>
              </div>
              <Separator />
              <div className="pt-2 space-y-2">
                
                <Button
                  variant="default"
                  className="w-full bg-[#F05A28] hover:bg-[#D04A18]"
                  onClick={() => router.push("/seller-dashboard/profile/referrals")}
                >
                  <Users className="mr-2 h-4 w-4" />
                  My Referrals
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            <CardDescription>Manage your personal information and documents</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="nominee">Nominee</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-6 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.personal.firstName}
                      onChange={(e) => handleInputChange("personal", "firstName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.personal.surname}
                      onChange={(e) => handleInputChange("personal", "surname", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={formData.personal.dob}
                      onChange={(e) => handleInputChange("personal", "dob", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fatherName">Father's Name</Label>
                    <Input
                      id="fatherName"
                      value={formData.personal.fatherName}
                      onChange={(e) => handleInputChange("personal", "fatherName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input
                      id="mobile"
                      value={formData.personal.mobile}
                      onChange={(e) => handleInputChange("personal", "mobile", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.personal.email}
                      onChange={(e) => handleInputChange("personal", "email", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address1">Address Line 1</Label>
                    <Input
                      id="address1"
                      value={formData.personal.addressLine1}
                      onChange={(e) => handleInputChange("personal", "addressLine1", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address2">Address Line 2</Label>
                    <Input
                      id="address2"
                      value={formData.personal.addressLine2}
                      onChange={(e) => handleInputChange("personal", "addressLine2", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="landmark">Landmark</Label>
                    <Input
                      id="landmark"
                      value={formData.personal.landmark}
                      onChange={(e) => handleInputChange("personal", "landmark", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.personal.city}
                      onChange={(e) => handleInputChange("personal", "city", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.personal.state}
                      onChange={(e) => handleInputChange("personal", "state", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">PIN Code</Label>
                    <Input
                      id="pincode"
                      value={formData.personal.pincode}
                      onChange={(e) => handleInputChange("personal", "pincode", e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end mt-4">
                    <Button
                      className="bg-[#F05A28] hover:bg-[#D04A18]"
                      onClick={handleSavePersonal}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="account" className="space-y-6 pt-4">
                <BankDetailsForm />
              </TabsContent>

              <TabsContent value="nominee" className="space-y-6 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nomineeName">Nominee Name</Label>
                    <Input
                      id="nomineeName"
                      value={formData.nominee.name}
                      onChange={(e) => handleInputChange("nominee", "name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nomineeRelation">Relation</Label>
                    <Input
                      id="nomineeRelation"
                      value={formData.nominee.relation}
                      onChange={(e) => handleInputChange("nominee", "relation", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nomineeDob">Date of Birth</Label>
                    <Input
                      id="nomineeDob"
                      type="date"
                      value={formData.nominee.dob}
                      onChange={(e) => handleInputChange("nominee", "dob", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nomineeMobile">Mobile Number</Label>
                    <Input
                      id="nomineeMobile"
                      value={formData.nominee.mobile}
                      onChange={(e) => handleInputChange("nominee", "mobile", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="nomineeAddress">Address</Label>
                    <Input
                      id="nomineeAddress"
                      value={formData.nominee.address}
                      onChange={(e) => handleInputChange("nominee", "address", e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end mt-4">
                    <Button
                      className="bg-[#F05A28] hover:bg-[#D04A18]"
                      onClick={handleSaveNominee}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="documents" className="space-y-6 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label>Profile Photo</Label>
                    <div className="border-2 border-dashed rounded-lg p-4 text-center">
                      <div className="flex justify-center mb-2">
                        <Avatar className="h-24 w-24">
                          <AvatarImage
                            src={profileData?.documents?.profile_photo || "/placeholder.svg?height=96&width=96"}
                            alt="Profile"
                          />
                          <AvatarFallback>{getInitials()}</AvatarFallback>
                        </Avatar>
                      </div>
                      <label htmlFor="profile-photo-upload" className="cursor-pointer">
                        <Button variant="outline" size="sm" className="relative">
                          <input
                            id="profile-photo-upload"
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleFileUpload("profile_photo", e.target.files[0])
                              }
                            }}
                          />
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Photo
                        </Button>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Aadhaar Card (Front)</Label>
                    <div className="border-2 border-dashed rounded-lg p-4 text-center">
                      <img
                        src={profileData?.documents?.aadhaar_front || "/placeholder.svg?height=120&width=200"}
                        alt="Aadhaar Front"
                        className="mx-auto mb-2 rounded h-[120px] w-[200px] object-cover"
                      />
                      <label htmlFor="aadhaar-front-upload" className="cursor-pointer">
                        <Button variant="outline" size="sm" className="relative">
                          <input
                            id="aadhaar-front-upload"
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleFileUpload("aadhaar_front", e.target.files[0])
                              }
                            }}
                          />
                          <Upload className="mr-2 h-4 w-4" />
                          Upload
                        </Button>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Aadhaar Card (Back)</Label>
                    <div className="border-2 border-dashed rounded-lg p-4 text-center">
                      <img
                        src={profileData?.documents?.aadhaar_back || "/placeholder.svg?height=120&width=200"}
                        alt="Aadhaar Back"
                        className="mx-auto mb-2 rounded h-[120px] w-[200px] object-cover"
                      />
                      <label htmlFor="aadhaar-back-upload" className="cursor-pointer">
                        <Button variant="outline" size="sm" className="relative">
                          <input
                            id="aadhaar-back-upload"
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleFileUpload("aadhaar_back", e.target.files[0])
                              }
                            }}
                          />
                          <Upload className="mr-2 h-4 w-4" />
                          Upload
                        </Button>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>PAN Card</Label>
                    <div className="border-2 border-dashed rounded-lg p-4 text-center">
                      <img
                        src={profileData?.documents?.pan_card || "/placeholder.svg?height=120&width=200"}
                        alt="PAN Card"
                        className="mx-auto mb-2 rounded h-[120px] w-[200px] object-cover"
                      />
                      <label htmlFor="pan-card-upload" className="cursor-pointer">
                        <Button variant="outline" size="sm" className="relative">
                          <input
                            id="pan-card-upload"
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleFileUpload("pan_card", e.target.files[0])
                              }
                            }}
                          />
                          <Upload className="mr-2 h-4 w-4" />
                          Upload
                        </Button>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Bank Passbook</Label>
                    <div className="border-2 border-dashed rounded-lg p-4 text-center">
                      <img
                        src={profileData?.documents?.bank_passbook || "/placeholder.svg?height=120&width=200"}
                        alt="Bank Passbook"
                        className="mx-auto mb-2 rounded h-[120px] w-[200px] object-cover"
                      />
                      <label htmlFor="bank-passbook-upload" className="cursor-pointer">
                        <Button variant="outline" size="sm" className="relative">
                          <input
                            id="bank-passbook-upload"
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleFileUpload("bank_passbook", e.target.files[0])
                              }
                            }}
                          />
                          <Upload className="mr-2 h-4 w-4" />
                          Upload
                        </Button>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Cancelled Cheque</Label>
                    <div className="border-2 border-dashed rounded-lg p-4 text-center">
                      <img
                        src={profileData?.documents?.cancelled_cheque || "/placeholder.svg?height=120&width=200"}
                        alt="Cancelled Cheque"
                        className="mx-auto mb-2 rounded h-[120px] w-[200px] object-cover"
                      />
                      <label htmlFor="cancelled-cheque-upload" className="cursor-pointer">
                        <Button variant="outline" size="sm" className="relative">
                          <input
                            id="cancelled-cheque-upload"
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleFileUpload("cancelled_cheque", e.target.files[0])
                              }
                            }}
                          />
                          <Upload className="mr-2 h-4 w-4" />
                          Upload
                        </Button>
                      </label>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

