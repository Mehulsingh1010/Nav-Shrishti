import HeroSection from "@/components/hero-section"
import ServicesSection from "@/components/services-section"
import CulturalSection from "@/components/cultural-section"
import TestimonialsPage from "@/components/testimonials"
import HallOfFamePage from "@/components/hall-of-fame"
import TeamPage from "../components/team"

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <ServicesSection />
      <CulturalSection />
    <TestimonialsPage/>
      <HallOfFamePage/>
      <TeamPage/>
    </main>
  )
}

