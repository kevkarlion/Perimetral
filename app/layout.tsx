import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import  WhatsAppCTA  from "@/components/WhatsAppCTA"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

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
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <WhatsAppCTA />
        </ThemeProvider>
      </body>
    </html>
  )
}
