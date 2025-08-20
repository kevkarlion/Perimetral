import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import  WhatsAppCTA  from "@/app/components/WhatsAppCTA"
import "../globals.css"
import { ThemeProvider } from "@/app/components/theme-provider"
import Navbar from "@/app/components/navbar"
import  Footer  from "@/app/components/footer"
import { ProductInitializer } from '@/app/components/ProductInit'
import  ScrollToTop  from '@/app/components/ScrollTop/ScrollToTop'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Corralón - Materiales para la construcción",
  description: "Todo lo que necesitas para tu proyecto de construcción en un solo lugar",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} flex flex-col min-h-screen pt-6`} >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ScrollToTop />
          <ProductInitializer />
          <Navbar />
          {children}
          <WhatsAppCTA />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
