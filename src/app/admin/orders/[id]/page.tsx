/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  CreditCard,
  Save,
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import AdminLayout from "@/components/admin/admin-layout"

export default function AdminOrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id

  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string>("")
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    async function fetchOrderData() {
      setLoading(true)
      try {
        const response = await fetch(`/api/admin/orders/${orderId}`)
        if (response.ok) {
          const orderData = await response.json()
          setOrder(orderData)
          setSelectedStatus(orderData.status)
        } else {
          console.error("Failed to fetch order data")
        }
      } catch (error) {
        console.error("Error fetching order data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      fetchOrderData()
    }
  }, [orderId])

  const handleStatusChange = async () => {
    if (selectedStatus === order.status) return

    setSaving(true)
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: selectedStatus }),
      })

      if (response.ok) {
        const updatedOrder = await response.json()
        setOrder({
          ...order,
          status: updatedOrder.status,
        })
        setSaveSuccess(true)

        // Reset success message after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false)
        }, 3000)
      } else {
        console.error("Failed to update order status")
      }
    } catch (error) {
      console.error("Error updating order status:", error)
    } finally {
      setSaving(false)
    }
  }

  // Helper function to format price
  function formatPrice(price: number) {
    return `₹${(price / 100).toLocaleString("en-IN")}`
  }

  // Helper function to format date
  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("hi-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
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

  if (!order) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-700">ऑर्डर नहीं मिला</h2>
          <p className="mt-2 text-gray-500">यह ऑर्डर मौजूद नहीं है या हटा दिया गया है।</p>
          <Button className="mt-4" onClick={() => router.push("/admin/orders")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            ऑर्डर सूची पर वापस जाएं
          </Button>
        </div>
      </AdminLayout>
    )
  }

  // Calculate order total
  const orderTotal = order.items.reduce((sum: number, item: any) => {
    return sum + item.quantity * item.pricePerUnit
  }, 0)

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={() => router.push("/admin/orders")}>
              <ArrowLeft className="h-4 w-4 mr-1" />
            </Button>
            <h1 className="text-2xl font-bold text-orange-800">ऑर्डर विवरण</h1>
          </div>
          <div>
            <Badge
              className={
                order.status === "completed"
                  ? "bg-green-100 text-green-800"
                  : order.status === "processing"
                    ? "bg-blue-100 text-blue-800"
                    : order.status === "cancelled"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
              }
            >
              {order.status}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">ऑर्डर सारांश</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <ShoppingBag className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">ऑर्डर आईडी</p>
                    <p className="font-medium">{order.orderId}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">ऑर्डर दिनांक</p>
                    <p>{formatDate(order.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">भुगतान स्थिति</p>
                    <Badge
                      className={
                        order.payment?.status === "captured"
                          ? "bg-green-100 text-green-800"
                          : order.payment?.status === "authorized"
                            ? "bg-blue-100 text-blue-800"
                            : order.payment?.status === "failed"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {order.payment?.status || "pending"}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center">
                  <Truck className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">ऑर्डर स्थिति</p>
                    <Badge
                      className={
                        order.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "processing"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h3 className="font-medium mb-4">ऑर्डर स्थिति अपडेट करें</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">स्थिति</p>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="स्थिति चुनें" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">लंबित</SelectItem>
                        <SelectItem value="processing">प्रोसेसिंग</SelectItem>
                        <SelectItem value="completed">पूर्ण</SelectItem>
                        <SelectItem value="cancelled">रद्द</SelectItem>
                        <SelectItem value="refunded">रिफंड</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleStatusChange}
                    disabled={selectedStatus === order.status || saving}
                    className="w-full"
                  >
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

                  {saveSuccess && <p className="text-green-600 text-sm text-center">स्थिति सफलतापूर्वक अपडेट की गई!</p>}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h3 className="font-medium mb-4">ग्राहक विवरण</h3>
                {order.customer ? (
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">नाम</p>
                        <p>
                          {order.customer.firstName} {order.customer.surname}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">ईमेल</p>
                        <p>{order.customer.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">मोबाइल</p>
                        <p>{order.customer.mobile}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">ग्राहक विवरण उपलब्ध नहीं है</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardContent className="p-0">
              <Tabs defaultValue="items" className="w-full">
                <TabsList className="w-full border-b rounded-none">
                  <TabsTrigger value="items" className="flex-1">
                    ऑर्डर आइटम
                  </TabsTrigger>
                  <TabsTrigger value="payment" className="flex-1">
                    भुगतान विवरण
                  </TabsTrigger>
                  <TabsTrigger value="shipping" className="flex-1">
                    शिपिंग विवरण
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="items" className="p-6">
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium mb-4">ऑर्डर आइटम</h3>

                    <div className="space-y-4">
                      {order.items.map((item: any, index: number) => (
                        <div key={index} className="flex items-start border-b pb-4">
                          <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center mr-4">
                            {item.product?.photoUrl ? (
                              <img
                                src={item.product.photoUrl || "/placeholder.svg"}
                                alt={item.product?.name || "Product"}
                                className="w-full h-full object-cover rounded"
                              />
                            ) : (
                              <Package className="h-8 w-8 text-gray-400" />
                            )}
                          </div>

                          <div className="flex-1">
                            <h4 className="font-medium">{item.product?.name || "Unknown Product"}</h4>
                            <div className="text-sm text-gray-500 mt-1">
                              {item.product?.category && (
                                <Badge variant="outline" className="mr-2">
                                  {item.product.category}
                                </Badge>
                              )}
                              <span>मात्रा: {item.quantity}</span>
                            </div>
                            <div className="mt-2 flex justify-between">
                              <span className="text-sm text-gray-500">प्रति इकाई: {formatPrice(item.pricePerUnit)}</span>
                              <span className="font-medium">{formatPrice(item.quantity * item.pricePerUnit)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-500">उप-योग</span>
                        <span>{formatPrice(orderTotal)}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-500">शिपिंग</span>
                        <span>₹0.00</span>
                      </div>
                      <div className="flex justify-between font-medium text-lg pt-2 border-t">
                        <span>कुल</span>
                        <span>{formatPrice(order.totalAmount)}</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="payment" className="p-6">
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium mb-4">भुगतान विवरण</h3>

                    {order.payment ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">भुगतान आईडी</p>
                            <p className="font-medium">{order.payment.razorpayPaymentId || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">ऑर्डर आईडी</p>
                            <p className="font-medium">{order.payment.razorpayOrderId}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">राशि</p>
                            <p className="font-medium">{formatPrice(order.payment.amount)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">मुद्रा</p>
                            <p className="font-medium">{order.payment.currency}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">भुगतान विधि</p>
                            <p className="font-medium">{order.payment.paymentMethod || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">स्थिति</p>
                            <Badge
                              className={
                                order.payment.status === "captured"
                                  ? "bg-green-100 text-green-800"
                                  : order.payment.status === "authorized"
                                    ? "bg-blue-100 text-blue-800"
                                    : order.payment.status === "failed"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {order.payment.status}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">दिनांक</p>
                            <p className="font-medium">{formatDate(order.payment.createdAt)}</p>
                          </div>
                        </div>

                        {order.payment.paymentDetails && (
                          <div className="mt-4 pt-4 border-t">
                            <h4 className="font-medium mb-2">अतिरिक्त विवरण</h4>
                            <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto">
                              {JSON.stringify(order.payment.paymentDetails, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <CreditCard className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                        <p>कोई भुगतान विवरण उपलब्ध नहीं है</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="shipping" className="p-6">
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium mb-4">शिपिंग विवरण</h3>

                    <div className="space-y-4">
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                        <div>
                          <p className="text-sm text-gray-500 mb-1">शिपिंग पता</p>
                          {order.shippingAddress ? (
                            <div>
                              <p>{order.shippingAddress.name}</p>
                              <p>{order.shippingAddress.addressLine1}</p>
                              {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                              <p>
                                {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                                {order.shippingAddress.pincode}
                              </p>
                              <p>{order.shippingAddress.mobile}</p>
                            </div>
                          ) : order.customer ? (
                            <div>
                              <p>
                                {order.customer.firstName} {order.customer.surname}
                              </p>
                              <p>{order.customer.addressLine1}</p>
                              {order.customer.addressLine2 && <p>{order.customer.addressLine2}</p>}
                              <p>
                                {order.customer.city}, {order.customer.state} - {order.customer.pincode}
                              </p>
                              <p>{order.customer.mobile}</p>
                            </div>
                          ) : (
                            <p className="text-gray-500">शिपिंग पता उपलब्ध नहीं है</p>
                          )}
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <h4 className="font-medium mb-4">ऑर्डर प्रगति</h4>
                        <div className="space-y-4">
                          <div className="flex items-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                                ["pending", "processing", "completed"].includes(order.status)
                                  ? "bg-green-100 text-green-600"
                                  : "bg-gray-100 text-gray-400"
                              }`}
                            >
                              <CheckCircle className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium">ऑर्डर प्राप्त हुआ</p>
                              <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                            </div>
                          </div>

                          <div className="flex items-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                                ["processing", "completed"].includes(order.status)
                                  ? "bg-green-100 text-green-600"
                                  : "bg-gray-100 text-gray-400"
                              }`}
                            >
                              <CheckCircle className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium">प्रोसेसिंग</p>
                              <p className="text-sm text-gray-500">
                                {order.status === "processing" || order.status === "completed"
                                  ? "ऑर्डर प्रोसेस किया जा रहा है"
                                  : "अभी तक प्रोसेस नहीं किया गया"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                                order.status === "completed"
                                  ? "bg-green-100 text-green-600"
                                  : "bg-gray-100 text-gray-400"
                              }`}
                            >
                              <CheckCircle className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium">पूर्ण</p>
                              <p className="text-sm text-gray-500">
                                {order.status === "completed" ? "ऑर्डर पूरा हो गया है" : "अभी तक पूरा नहीं हुआ"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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

