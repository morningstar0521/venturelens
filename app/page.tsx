// ─── Landing Page ──────────────────────────────────────────────────────────
import { Navbar }       from "@/components/landing/Navbar"
import { Hero }         from "@/components/landing/Hero"
import { HowItWorks }  from "@/components/landing/HowItWorks"
import { Features }    from "@/components/landing/Features"
import { Testimonials } from "@/components/landing/Testimonials"
import { Footer }       from "@/components/landing/Footer"

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="site-spotlight pointer-events-none fixed inset-0 z-0" />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <HowItWorks />
        <Features />
        <Testimonials />
      </main>
      <Footer />
    </div>
  )
}
