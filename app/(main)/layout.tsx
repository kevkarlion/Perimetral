import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import WhatsAppCTA from "@/app/components/WhatsAppCTA";
import "../globals.css";
import { ThemeProvider } from "@/app/components/theme-provider";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import ScrollToTop from "@/app/components/ScrollTop/ScrollToTop";
import { ProductInitializer } from "@/app/components/ProductInitializer"; // o donde esté tu componente
import { ClientInitializers  } from '@/app/components/ClientInitializers/ClientInitializers'


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Materiales de Construcción y Cercos Perimetrales | Perimetral",
  description:
    "Venta minorista y mayorista de materiales para la construcción. Especialistas en provisión e instalación de cercos perimetrales para obras y hogares.",
  keywords: ["materiales para construcción", "cercos perimetrales", "colocación de cercos", "obra civil"],
  authors: [{ name: "Perimetral" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicon/site.webmanifest" />
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen pt-6`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ScrollToTop />
         
          <Navbar />
          <ClientInitializers  />
          {children}
          <WhatsAppCTA />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
