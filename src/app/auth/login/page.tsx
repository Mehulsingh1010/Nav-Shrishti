"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size on mount and when resizing
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkScreenSize();
    
    // Add event listener for resize
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleSubmit = async (e) => {
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

      toast({ title: "Login Successful", description: `Welcome back!` });
      router.push("/user-dashboard");
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

  // Login form component - extracted for reuse
  const LoginForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6 w-full">
      {error && <p className="text-sm text-red-500 text-center">{error}</p>}
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full" 
            required 
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/auth/forgot-password" className="text-sm text-orange-700 hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pr-10"
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

      <div className="flex justify-center pt-2">
        <ReCAPTCHA 
          sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" 
          onChange={() => setCaptchaVerified(true)} 
          size={isMobile ? "compact" : "normal"}
        />
      </div>

      <div className="flex justify-center pt-4">
        <Button 
          type="submit" 
          className="bg-orange-700 hover:bg-orange-800 text-white px-8 py-6 h-auto text-lg rounded-md w-full" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>
      </div>

      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Don&lsquo;t have an account? <Link href="/auth/register" className="text-orange-700 hover:underline">Register here</Link>
        </p>
      </div>
    </form>
  );

  // Mobile layout - only show login form
  if (isMobile) {
    return (
      <div className="h-screen min-h-screen w-full flex flex-col bg-gradient-to-br from-orange-50 via-orange-100/30 to-orange-50">
        {/* Logo at the top */}
        <div className="flex items-center justify-center space-x-3 pt-8 pb-6">
          <div className="h-10 w-10 bg-orange-700 rounded-full flex items-center justify-center">
            <span className="text-white text-xl font-bold">ॐ</span>
          </div>
          <h2 className="text-orange-800 text-xl font-bold">वैदिक भारत</h2>
        </div>
        
        {/* Login Form Container */}
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-md px-4 py-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-md">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-orange-900">सदस्य लॉगिन</h2>
              <p className="text-orange-700 mt-1">Member Login</p>
            </div>
            
            <LoginForm />
          </div>
        </div>
        
        {/* Footer */}
        <div className="py-4 text-center">
          <p className="text-orange-800 text-xs">
            © 2025 वैदिक भारत. सर्वाधिकार सुरक्षित.
          </p>
        </div>
      </div>
    );
  }

  // Desktop and tablet layout
  return (
    <div className="h-screen w-full flex flex-col md:flex-row overflow-hidden bg-gradient-to-br from-orange-50 via-orange-100/30 to-orange-50">
      {/* Left Side - Design Elements (hidden on mobile) */}
      <div className="w-full md:w-1/2 h-full relative bg-gradient-to-br from-orange-800 to-orange-600 p-6 md:p-12 flex flex-col justify-between">
        {/* Logo at the top */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10"
        >
          <div className="flex items-center space-x-3">
            <div className="h-10 md:h-12 w-10 md:w-12 bg-white rounded-full flex items-center justify-center">
              <span className="text-orange-800 text-xl md:text-2xl font-bold">ॐ</span>
            </div>
            <h2 className="text-white text-xl md:text-2xl font-bold">वैदिक भारत</h2>
          </div>
        </motion.div>

        {/* Circular Rotating Mantra */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] md:w-[350px] h-[250px] md:h-[350px] opacity-20">
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
            className="inline-block px-4 py-1 md:px-5 md:py-2 bg-white/20 rounded-full text-white font-semibold text-xs md:text-sm tracking-wide mb-4 md:mb-6"
          >
            वैदिक संस्कृति का पुनरुत्थान
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4 md:mb-6"
          >
            आपके खाते में
            <span className="block text-orange-200">आपका स्वागत है</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-lg md:text-xl text-orange-100 mb-6 md:mb-10 max-w-md mx-auto"
          >
            आध्यात्मिक यात्रा पर हमारे साथ जुड़ें और अपनी संस्कृति का संरक्षण करें
          </motion.p>

          {/* Featured Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-w-lg mx-auto"
          >
            {[
              { title: "विशेष कार्यक्रम", description: "मंदिरों और आश्रमों में विशेष पहुंच" },
              { title: "आध्यात्मिक सामग्री", description: "दुर्लभ वैदिक ग्रंथों तक पहुंच" },
              { title: "समुदाय जुड़ाव", description: "देश भर के साधकों के साथ जुड़ें और सीखें" },
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5, scale: 1.05 }}
                className={`p-4 md:p-5 bg-white/10 backdrop-blur-sm rounded-lg text-left ${
                  index === 2 ? "sm:col-span-2" : ""
                }`}
              >
                <h3 className="text-base md:text-lg font-bold text-white mb-1">{item.title}</h3>
                <p className="text-orange-100 text-xs md:text-sm">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <p className="text-orange-200 text-xs md:text-sm text-center">
            © 2025 वैदिक भारत. सर्वाधिकार सुरक्षित.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 h-full flex items-center justify-center">
        <div className="w-full max-w-md px-6 py-8 md:py-0">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-orange-900">सदस्य लॉगिन</h2>
            <p className="text-orange-700 mt-2">Member Login</p>
          </div>
          
          <LoginForm />
        </div>
      </div>
    </div>
  );
}