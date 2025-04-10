/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, CheckCircle, Loader2, Truck, CreditCard } from "lucide-react"
import Link from "next/link"
import Script from "next/script"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function CheckoutPage({ params }) {
  // Fix 1: Use React.use() to unwrap the params Promise
  const unwrappedParams = React.use(params)
  const productId = unwrappedParams?.productId

  const router = useRouter()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [error, setError] = useState(null)
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false)

  // New state for payment method selection
  const [paymentMethod, setPaymentMethod] = useState("online")
  const [showCodDialog, setShowCodDialog] = useState(false)
  const [shippingDetails, setShippingDetails] = useState({
    name: "",
    mobile: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    notes: "",
  })

  // Handle Razorpay script loading status
  const handleRazorpayLoad = () => {
    console.log("Razorpay SDK loaded successfully")
    setIsRazorpayLoaded(true)
  }

  // Fix 2: Move the fetch logic outside of the component render cycle
  useEffect(() => {
    if (!productId) return

    let isMounted = true

    async function fetchProductDetails() {
      try {
        console.log("Fetching product with ID:", productId)

        // Fix 3: Ensure correct API endpoint
        const response = await fetch(`/api/payment/products/${productId}`)

        if (!response.ok) {
          throw new Error(`Product not found (Status: ${response.status})`)
        }

        const data = await response.json()
        console.log("Product data received:", data)

        if (isMounted) {
          setProduct(data)

          // Pre-fill shipping details if user data is available
          if (data.user) {
            setShippingDetails({
              name: `${data.user.firstName || ""} ${data.user.surname || ""}`.trim(),
              mobile: data.user.mobile || "",
              addressLine1: data.user.addressLine1 || "",
              addressLine2: data.user.addressLine2 || "",
              city: data.user.city || "",
              state: data.user.state || "",
              pincode: data.user.pincode || "",
              notes: "",
            })
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(`Failed to load product details: ${err.message}`)
        }
        console.error("Error fetching product:", err)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchProductDetails()

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false
    }
  }, [productId])

  // Check if Razorpay is already loaded on mount
  useEffect(() => {
    if (typeof window !== "undefined" && window.Razorpay) {
      setIsRazorpayLoaded(true)
      console.log("Razorpay SDK already loaded")
    }
  }, [])

  // Handle input change for shipping details form
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setShippingDetails((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle Cash on Delivery order creation
  const handleCodOrder = async () => {
    if (!product) return

    setPaymentLoading(true)

    try {
      const response = await fetch("/api/payment/create-cod-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity: 1,
          shippingDetails,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage

        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.error || "Failed to create order"
        } catch (e) {
          errorMessage = `Failed to create order: ${errorText.substring(0, 100)}`
        }

        throw new Error(errorMessage)
      }

      const orderData = await response.json()
      console.log("COD Order created:", orderData)

      setPaymentSuccess(true)
      setShowCodDialog(false)

      setTimeout(() => {
        router.push("/user-dashboard/purchase/history")
      }, 2000)
    } catch (err) {
      console.error("COD order error:", err)
      setError(`Failed to process order: ${err.message}`)
    } finally {
      setPaymentLoading(false)
    }
  }

  // Fix 4: Move the payment handler outside the render cycle
  const handlePayment = async () => {
    if (!product) return

    // If payment method is COD, show the shipping details dialog
    if (paymentMethod === "cod") {
      setShowCodDialog(true)
      return
    }

    // Online payment flow
    if (!isRazorpayLoaded) {
      setError("Payment gateway is still loading. Please try again in a moment.")
      return
    }

    setPaymentLoading(true)

    try {
      // Fix 5: Ensure correct API endpoint for payments
      const response = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity: 1,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage

        try {
          // Try parsing as JSON first
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.error || "Failed to create order"
        } catch (e) {
          // If not valid JSON, use the text directly
          errorMessage = `Failed to create order: ${errorText.substring(0, 100)}`
        }

        throw new Error(errorMessage)
      }

      const orderData = await response.json()
      console.log("Order created:", orderData)

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Krishi Bazaar",
        description: `Purchase of ${orderData.productName}`,
        order_id: orderData.razorpayOrderId,
        prefill: {
          name: orderData.customerName,
          email: orderData.customerEmail,
          contact: orderData.customerPhone,
        },
        handler: async (response) => {
          try {
            console.log("Payment successful, verifying...")

            // Fix 6: Ensure correct API endpoint for verification
            const verifyResponse = await fetch("/api/payment/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })

            if (!verifyResponse.ok) {
              throw new Error("Payment verification failed")
            }

            setPaymentSuccess(true)

            setTimeout(() => {
              router.push("/user-dashboard/purchase/history")
            }, 2000)
          } catch (err) {
            console.error("Payment verification error:", err)
            setError("Payment verification failed")
          }
        },
        theme: { color: "#F97316" },
      }

      // Create and open Razorpay payment window
      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (err) {
      console.error("Payment error:", err)
      setError(`Failed to process payment: ${err.message}`)
    } finally {
      setPaymentLoading(false)
    }
  }

  function formatPrice(price) {
    return `₹${(price / 100).toLocaleString("en-IN")}`
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-md text-center">
        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <p className="text-red-700">{error}</p>
          <Link href="/navlinks/products" className="mt-4 inline-block text-orange-600 hover:text-orange-700">
            <ArrowLeft className="inline mr-2 h-4 w-4" />
            सभी उत्पादों पर वापस जाएं
          </Link>
        </div>
      </div>
    )
  }

  if (paymentSuccess) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-md text-center">
        <Card>
          <CardContent className="pt-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-700 mb-2">ऑर्डर सफल!</h2>
            <p className="text-gray-600 mb-4">आपका ऑर्डर सफलतापूर्वक प्रोसेस किया गया है।</p>
            <Button
              onClick={() => router.push("/user-dashboard/purchase/history")}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              अपने ऑर्डर देखें
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Fix 7: Fix Image component props
  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
        onLoad={handleRazorpayLoad}
        onError={() => setError("Failed to load payment gateway. Please refresh and try again.")}
      />

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Link
          href={`/products/${productId}`}
          className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          उत्पाद पर वापस जाएं
        </Link>

        <h1 className="text-2xl font-bold text-orange-800 mb-6">चेकआउट</h1>

        {product && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="relative w-20 h-20">
                  <img src={product.photoUrl || "/placeholder.svg"} alt={product.name} width="300" height="200" />
                </div>
                <div className="flex-grow">
                  <h3 className="font-medium text-gray-900">{product.name}</h3>
                  <p className="text-orange-600 font-semibold">{formatPrice(product.price)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-medium text-gray-900 mb-4">भुगतान विकल्प चुनें</h3>
            <RadioGroup
              defaultValue="online"
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              className="grid grid-cols-2 gap-4"
            >
              <div className="relative">
                <RadioGroupItem value="online" id="online" className="peer sr-only" />
                <Label
                  htmlFor="online"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <CreditCard className="mb-3 h-6 w-6" />
                  ऑनलाइन भुगतान
                </Label>
              </div>
              <div className="relative">
                <RadioGroupItem value="cod" id="cod" className="peer sr-only" />
                <Label
                  htmlFor="cod"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Truck className="mb-3 h-6 w-6" />
                  कैश ऑन डिलीवरी
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Button
          onClick={handlePayment}
          disabled={paymentLoading || !product || (paymentMethod === "online" && !isRazorpayLoaded)}
          className="w-full bg-orange-600 hover:bg-orange-700"
        >
          {paymentLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : paymentMethod === "online" && !isRazorpayLoaded ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              भुगतान गेटवे लोड हो रहा है...
            </>
          ) : paymentMethod === "online" ? (
            "ऑनलाइन भुगतान करें"
          ) : (
            "कैश ऑन डिलीवरी के साथ आगे बढ़ें"
          )}
        </Button>

        {paymentMethod === "online" && !isRazorpayLoaded && (
          <p className="text-sm text-gray-500 mt-2 text-center">भुगतान गेटवे लोड हो रहा है, कृपया प्रतीक्षा करें...</p>
        )}
      </div>

      {/* Cash on Delivery Dialog */}
      <Dialog open={showCodDialog} onOpenChange={setShowCodDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>शिपिंग विवरण</DialogTitle>
            <DialogDescription>कृपया अपना शिपिंग पता और संपर्क विवरण प्रदान करें</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">पूरा नाम</Label>
              <Input
                id="name"
                name="name"
                value={shippingDetails.name}
                onChange={handleInputChange}
                placeholder="आपका पूरा नाम"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mobile">मोबाइल नंबर</Label>
              <Input
                id="mobile"
                name="mobile"
                value={shippingDetails.mobile}
                onChange={handleInputChange}
                placeholder="आपका मोबाइल नंबर"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="addressLine1">पता पंक्ति 1</Label>
              <Input
                id="addressLine1"
                name="addressLine1"
                value={shippingDetails.addressLine1}
                onChange={handleInputChange}
                placeholder="घर नंबर, अपार्टमेंट, सड़क"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="addressLine2">पता पंक्ति 2 (वैकल्पिक)</Label>
              <Input
                id="addressLine2"
                name="addressLine2"
                value={shippingDetails.addressLine2}
                onChange={handleInputChange}
                placeholder="लैंडमार्क, क्षेत्र"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="city">शहर</Label>
                <Input
                  id="city"
                  name="city"
                  value={shippingDetails.city}
                  onChange={handleInputChange}
                  placeholder="आपका शहर"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="state">राज्य</Label>
                <Input
                  id="state"
                  name="state"
                  value={shippingDetails.state}
                  onChange={handleInputChange}
                  placeholder="आपका राज्य"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pincode">पिन कोड</Label>
              <Input
                id="pincode"
                name="pincode"
                value={shippingDetails.pincode}
                onChange={handleInputChange}
                placeholder="आपका पिन कोड"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">अतिरिक्त नोट्स (वैकल्पिक)</Label>
              <Textarea
                id="notes"
                name="notes"
                value={shippingDetails.notes}
                onChange={handleInputChange}
                placeholder="डिलीवरी के लिए कोई विशेष निर्देश"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCodDialog(false)} disabled={paymentLoading}>
              रद्द करें
            </Button>
            <Button onClick={handleCodOrder} disabled={paymentLoading} className="bg-orange-600 hover:bg-orange-700">
              {paymentLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "ऑर्डर पूरा करें"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
