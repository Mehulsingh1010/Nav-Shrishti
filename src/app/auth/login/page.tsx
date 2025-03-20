"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
  
    if (!captchaVerified) {
      setError("Please verify you are not a robot.");
      setIsSubmitting(false);
      return;
    }
  
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
  
      toast({ title: "Login Successful", description: "Welcome back!" });
  
      // Store user role in localStorage or sessionStorage
      localStorage.setItem("userRole", data.role); 
  
      // Redirect based on role
      if (data.role === "seller") {
        router.push("/seller-dashboard");
      } else if (data.role === "user") {
        router.push("/user-dashboard");
      } else {
        router.push("/");
      }
  
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Login failed. Please try again.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  

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
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
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
                    ॐ नमः शिवाय • हरे कृष्ण हरे राम • श्री राम जय राम जय जय राम •
                    ॐ गं गणपतये नमः • ॐ ह्रीं क्लीं महालक्ष्म्यै नमः •
                  </textPath>
                </text>
              </svg>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="relative z-10 text-center my-auto">
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-block px-4 py-1.5 lg:px-5 lg:py-2 bg-white/20 rounded-full text-white font-semibold text-xs lg:text-sm tracking-wide mb-4 lg:mb-6"
            >
              वैदिक संस्कृति का पुनरुत्थान
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-3xl lg:text-5xl font-extrabold text-white leading-tight mb-4 lg:mb-6"
            >
              वैदिक भारत के{" "}
              <span className="block text-orange-200">निर्माण के लिये</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-lg lg:text-xl text-orange-100 mb-6 lg:mb-10 max-w-md mx-auto"
            >
              हमारे समुदाय से जुड़ें और एक साथ भारतीय संस्कृति का संवर्धन करें
            </motion.p>

            {/* Grid images */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-2 gap-4 lg:gap-6 max-w-lg mx-auto"
            >
              {[
                { title: "गुरुकुल शिक्षा", description: "पारंपरिक शिक्षा का आधुनिक दृष्टिकोण" },
                { title: "योग साधना", description: "शारीरिक और मानसिक स्वास्थ्य का मार्ग" },
                { title: "मंदिर संस्कृति", description: "आध्यात्मिक विरासत का संरक्षण" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5, scale: 1.05 }}
                  className={`p-4 lg:p-5 bg-white/10 backdrop-blur-sm rounded-lg text-left ${
                    index === 2 ? "col-span-2" : ""
                  }`}
                >
                  <h3 className="text-base lg:text-lg font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-orange-100 text-xs lg:text-sm">{item.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Footer */}
          <div className="relative z-10 mt-auto">
            <p className="text-orange-200 text-xs lg:text-sm text-center">
              © 2025 वैदिक भारत. सर्वाधिकार सुरक्षित.
            </p>
          </div>
        </div>
      </div>

      {/* Login Form - Always visible, centered on mobile, right side on desktop */}
      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-[#c14d14] p-6 text-center">
            <h1 className="text-2xl font-bold text-white">सदस्य लॉगिन</h1>
            <p className="text-[#f9f3e9] mt-2">Member Login</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div>
                <div className="flex justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/auth/forgot-password" className="text-sm text-[#c14d14] hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <ReCAPTCHA sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" onChange={() => setCaptchaVerified(true)} />
            </div>

            <div className="flex justify-center pt-4">
              <Button type="submit" className="bg-[#c14d14] text-white px-8 py-2 rounded-md w-full" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </div>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Don&lsquo;t have an account? <Link href="/auth/register" className="text-[#c14d14] hover:underline">Register here</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}