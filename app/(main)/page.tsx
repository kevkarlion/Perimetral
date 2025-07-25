import Hero from "@/app/components/hero"
import SocialBanner from "@/app/components/SocialBanner"
import InfoBanner from "@/app/components/info-banner"
import ProductsSection from "@/app/components/products-section"
import Novedades from "@/app/components/novedades"
import Faq from "@/app/components/faq"


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
