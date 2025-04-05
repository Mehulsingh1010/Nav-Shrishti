/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { User, Mail, Phone, MapPin, Calendar, ShoppingBag, Network, Save, ArrowLeft, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import AdminLayout from "@/components/admin/admin-layout"

export default function AdminUserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id

  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedRole, setSelectedRole] = useState<string>("")
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    async function fetchUserData() {
      setLoading(true)
      try {
        const response = await fetch(`/api/admin/users/${userId}`)
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
          setSelectedRole(userData.role)
        } else {
          console.error("Failed to fetch user data")
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchUserData()
    }
  }, [userId])

  const handleRoleChange = async () => {
    if (selectedRole === user.role) return

    setSaving(true)
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: selectedRole }),
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setUser(updatedUser)
        setSaveSuccess(true)

        // Reset success message after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false)
        }, 3000)
      } else {
        console.error("Failed to update user role")
      }
    } catch (error) {
      console.error("Error updating user role:", error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    )
  }

  if (!user) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-700">उपयोगकर्ता नहीं मिला</h2>
          <p className="mt-2 text-gray-500">यह उपयोगकर्ता मौजूद नहीं है या हटा दिया गया है।</p>
          <Button className="mt-4" onClick={() => router.push("/admin/users")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            उपयोगकर्ता सूची पर वापस जाएं
          </Button>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={() => router.push("/admin/users")}>
              <ArrowLeft className="h-4 w-4 mr-1" />
            </Button>
            <h1 className="text-2xl font-bold text-orange-800">उपयोगकर्ता विवरण</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">उपयोगकर्ता प्रोफ़ाइल</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                  <User className="h-12 w-12 text-orange-500" />
                </div>
                <h2 className="text-xl font-semibold">
                  {user.firstName} {user.surname}
                </h2>
                <p className="text-gray-500 mt-1">{user.email}</p>
                <Badge
                  className={`mt-2 ${
                    user.role === "admin"
                      ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
                      : user.role === "seller"
                        ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                        : "bg-green-100 text-green-800 hover:bg-green-100"
                  }`}
                >
                  {user.role}
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">ईमेल</p>
                    <p>{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">मोबाइल</p>
                    <p>{user.mobile}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">पता</p>
                    <p>{user.addressLine1}</p>
                    {user.addressLine2 && <p>{user.addressLine2}</p>}
                    <p>
                      {user.city}, {user.state} - {user.pincode}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">पंजीकरण तिथि</p>
                    <p>{new Date(user.createdAt).toLocaleDateString("hi-IN")}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h3 className="font-medium mb-4">भूमिका प्रबंधन</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">उपयोगकर्ता भूमिका</p>
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger>
                        <SelectValue placeholder="भूमिका चुनें" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">उपयोगकर्ता</SelectItem>
                        <SelectItem value="seller">विक्रेता</SelectItem>
                        <SelectItem value="admin">प्रशासक</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={handleRoleChange} disabled={selectedRole === user.role || saving} className="w-full">
                    {saving ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        सहेजा जा रहा है...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Save className="h-4 w-4 mr-2" />
                        परिवर्तन सहेजें
                      </div>
                    )}
                  </Button>

                  {saveSuccess && <p className="text-green-600 text-sm text-center">भूमिका सफलतापूर्वक अपडेट की गई!</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardContent className="p-0">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="w-full border-b rounded-none">
                  <TabsTrigger value="details" className="flex-1">
                    विस्तृत जानकारी
                  </TabsTrigger>
                  <TabsTrigger value="orders" className="flex-1">
                    ऑर्डर
                  </TabsTrigger>
                  <TabsTrigger value="referrals" className="flex-1">
                    रेफरल
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">व्यक्तिगत विवरण</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">शीर्षक</p>
                          <p className="font-medium">{user.title}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">पिता का नाम</p>
                          <p className="font-medium">{user.fatherName || "उपलब्ध नहीं"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">जन्म तिथि</p>
                          <p className="font-medium">
                            {user.dob ? new Date(user.dob).toLocaleDateString("hi-IN") : "उपलब्ध नहीं"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">संदर्भ आईडी</p>
                          <p className="font-medium">{user.referenceId}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">रेफरल द्वारा</p>
                          <p className="font-medium">{user.referredBy || "कोई नहीं"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">प्रचार रैंक</p>
                          <p className="font-medium">{user.promotionalRank}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="text-lg font-medium mb-4">बैंक विवरण</h3>
                      {user.bankDetails && user.bankDetails.length > 0 ? (
                        <div className="space-y-4">
                          {user.bankDetails.map((bank: any, index: number) => (
                            <div key={index} className="border rounded-md p-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-gray-500">खाता धारक का नाम</p>
                                  <p className="font-medium">{bank.accountHolderName}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">बैंक का नाम</p>
                                  <p className="font-medium">{bank.bankName}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">खाता संख्या</p>
                                  <p className="font-medium">{bank.accountNumber}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">IFSC कोड</p>
                                  <p className="font-medium">{bank.ifscCode}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">शाखा का नाम</p>
                                  <p className="font-medium">{bank.branchName}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">मोबाइल नंबर</p>
                                  <p className="font-medium">{bank.mobileNumber}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">सत्यापित</p>
                                  <Badge
                                    className={
                                      bank.isVerified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                    }
                                  >
                                    {bank.isVerified ? "हां" : "नहीं"}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">कोई बैंक विवरण उपलब्ध नहीं है</p>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="orders" className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">उपयोगकर्ता ऑर्डर</h3>
                    <Button variant="outline" size="sm">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      सभी ऑर्डर देखें
                    </Button>
                  </div>

                  <div className="text-center py-12 text-gray-500">
                    <ShoppingCart className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <p>ऑर्डर डेटा लोड हो रहा है...</p>
                  </div>
                </TabsContent>

                <TabsContent value="referrals" className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">रेफरल नेटवर्क</h3>
                    <Button variant="outline" size="sm">
                      <Network className="h-4 w-4 mr-2" />
                      पूरा नेटवर्क देखें
                    </Button>
                  </div>

                  <div className="text-center py-12 text-gray-500">
                    <Network className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <p>रेफरल डेटा लोड हो रहा है...</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}

