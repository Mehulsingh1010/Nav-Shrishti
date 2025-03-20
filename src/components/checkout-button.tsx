/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

// Extend the Window interface to include Razorpay
declare global {
  interface Window {
    Razorpay: any
  }
}

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface CheckoutButtonProps {
  productId: number
  quantity: number
  shippingAddress: {
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    pincode: string
  }
}

export default function CheckoutButton({ productId, quantity, shippingAddress }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleCheckout = async () => {
    try {
      setIsLoading(true)

      // Create order
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [{ productId, quantity }],
          shippingAddress,
        }),
      })

      if (!orderResponse.ok) {
        const error = await orderResponse.json()
        throw new Error(error.error || "Failed to create order")
      }

      const orderData = await orderResponse.json()

      // Initialize Razorpay
      const options = {
        key: orderData.key,
        amount: orderData.razorpayOrder.amount,
        currency: orderData.razorpayOrder.currency,
        name: "Your Company Name",
        description: "Product Purchase",
        order_id: orderData.razorpayOrder.id,
        handler: async (response: any) => {
          try {
            // Verify payment
            const verifyResponse = await fetch("/api/payments/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })

            if (!verifyResponse.ok) {
              const error = await verifyResponse.json()
              throw new Error(error.error || "Payment verification failed")
            }

            // Redirect to order confirmation page
            router.push(`/orders/${orderData.order.id}`)
          } catch (error) {
            console.error("Payment verification error:", error)
            alert("Payment verification failed. Please contact support.")
          }
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      }

    
      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Checkout failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleCheckout} disabled={isLoading} className="w-full">
      {isLoading ? "Processing..." : "Buy Now"}
    </Button>
  )
}

