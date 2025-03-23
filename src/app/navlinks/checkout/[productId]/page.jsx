/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import Script from "next/script";

export default function CheckoutPage({ params }) {
  // Fix 1: Use React.use() to unwrap the params Promise
  const unwrappedParams = React.use(params);
  const productId = unwrappedParams?.productId;

  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);

  // Handle Razorpay script loading status
  const handleRazorpayLoad = () => {
    console.log("Razorpay SDK loaded successfully");
    setIsRazorpayLoaded(true);
  };

  // Fix 2: Move the fetch logic outside of the component render cycle
  useEffect(() => {
    if (!productId) return;

    let isMounted = true;
    
    async function fetchProductDetails() {
      try {
        console.log("Fetching product with ID:", productId);

        // Fix 3: Ensure correct API endpoint
        const response = await fetch(`/api/payment/products/${productId}`);

        if (!response.ok) {
          throw new Error(`Product not found (Status: ${response.status})`);
        }

        const data = await response.json();
        console.log("Product data received:", data);
        
        if (isMounted) {
          setProduct(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(`Failed to load product details: ${err.message}`);
        }
        console.error("Error fetching product:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchProductDetails();
    
    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, [productId]);

  // Check if Razorpay is already loaded on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      setIsRazorpayLoaded(true);
      console.log("Razorpay SDK already loaded");
    }
  }, []);

  // Fix 4: Move the payment handler outside the render cycle
  const handlePayment = async () => {
    if (!product) return;
    
    if (!isRazorpayLoaded) {
      setError("Payment gateway is still loading. Please try again in a moment.");
      return;
    }

    setPaymentLoading(true);
    
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
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        
        try {
          // Try parsing as JSON first
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || "Failed to create order";
        } catch (e) {
          // If not valid JSON, use the text directly
          errorMessage = `Failed to create order: ${errorText.substring(0, 100)}`;
        }
        
        throw new Error(errorMessage);
      }

      const orderData = await response.json();
      console.log("Order created:", orderData);

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
            console.log("Payment successful, verifying...");

            // Fix 6: Ensure correct API endpoint for verification
            const verifyResponse = await fetch("/api/payment/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (!verifyResponse.ok) {
              throw new Error("Payment verification failed");
            }

            setPaymentSuccess(true);

            setTimeout(() => {
              router.push("/user-dashboard/purchase/history");
            }, 2000);
          } catch (err) {
            console.error("Payment verification error:", err);
            setError("Payment verification failed");
          }
        },
        theme: { color: "#F97316" },
      };

      // Create and open Razorpay payment window
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("Payment error:", err);
      setError(`Failed to process payment: ${err.message}`);
    } finally {
      setPaymentLoading(false);
    }
  };

  function formatPrice(price) {
    return `₹${(price / 100).toLocaleString("en-IN")}`;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-md text-center">
        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <p className="text-red-700">{error}</p>
          <Link href="/products" className="mt-4 inline-block text-orange-600 hover:text-orange-700">
            <ArrowLeft className="inline mr-2 h-4 w-4" />
            सभी उत्पादों पर वापस जाएं
          </Link>
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-md text-center">
        <Card>
          <CardContent className="pt-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-700 mb-2">भुगतान सफल!</h2>
            <p className="text-gray-600 mb-4">आपका ऑर्डर सफलतापूर्वक प्रोसेस किया गया है।</p>
          </CardContent>
        </Card>
      </div>
    );
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
        <Link href={`/products/${productId}`} className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          उत्पाद पर वापस जाएं
        </Link>

        <h1 className="text-2xl font-bold text-orange-800 mb-6">चेकआउट</h1>

        {product && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="relative w-20 h-20">
                  <Image
                    src={product.photoUrl || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    sizes="80px"
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="font-medium text-gray-900">{product.name}</h3>
                  <p className="text-orange-600 font-semibold">{formatPrice(product.price)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Button 
          onClick={handlePayment} 
          disabled={paymentLoading || !product || !isRazorpayLoaded} 
          className="w-full bg-orange-600 hover:bg-orange-700"
        >
          {paymentLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : !isRazorpayLoaded ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              भुगतान गेटवे लोड हो रहा है...
            </>
          ) : (
            "भुगतान करें"
          )}
        </Button>
        
        {!isRazorpayLoaded && (
          <p className="text-sm text-gray-500 mt-2 text-center">
            भुगतान गेटवे लोड हो रहा है, कृपया प्रतीक्षा करें...
          </p>
        )}
      </div>
    </>
  );
}