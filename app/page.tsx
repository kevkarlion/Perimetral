import Hero from "@/components/hero"
import Navbar from "@/components/navbar"
import SocialBanner from "@/components/SocialBanner"
import InfoBanner from "@/components/info-banner"
import ProductsSection from "@/components/products-section"
import Novedades from "@/components/novedades"
import Faq from "@/components/faq"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* <Navbar /> */}
      <Hero />
      <InfoBanner />
      <SocialBanner />
      <ProductsSection />
      <Novedades />
      <Faq />
      {/* <Footer /> */}
    </main>
  )
}
