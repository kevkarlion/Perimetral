import Hero from "@/components/hero"
import SocialBanner from "@/components/SocialBanner"
import InfoBanner from "@/components/info-banner"
import ProductsSection from "@/components/products-section"
import Novedades from "@/components/novedades"
import Faq from "@/components/faq"


export default function Home() {
  return (
    <main className="min-h-screen">
    
      <Hero />
      <ProductsSection />
      <SocialBanner />
      <InfoBanner />
      <Novedades />
      <Faq />
  
    </main>
  )
}
