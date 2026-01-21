import Hero from "@/app/components/hero"
import SocialBanner from "@/app/components/SocialBanner"
import InfoBanner from "@/app/components/info-banner"
import CategoriesPageHome from "@/app/components/CategoriesPageHome"
import { CategoryInitializer } from '@/app/components/CategoryInitializer'



import Novedades from "@/app/components/novedades"
import Faq from "@/app/components/faq"
import { ProductInitializer } from "../components/ProductInitializer"


export default function Home() {
  return (
    <main className="min-h-screen">
    
      <Hero />
      <CategoryInitializer />
      <CategoriesPageHome /> {/* Muestra las categorías */}
      <ProductInitializer />
      <SocialBanner />
      <InfoBanner />
      <Novedades />
      <Faq />
  
    </main>
  )
}
