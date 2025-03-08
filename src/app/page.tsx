import HeroSection from "@/components/hero-section"
import ServicesSection from "@/components/services-section"
import CulturalSection from "@/components/cultural-section"

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <ServicesSection />
      <CulturalSection />

      <footer className="bg-orange-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg mb-2">संपर्क करें: नव सृष्टि सृजन सेवा संस्थान</p>
          <p className="text-orange-200">ईमेल: info@navsrishti.org | फ़ोन: +91 XXXXXXXXXX</p>
        </div>
      </footer>
    </main>
  )
}

