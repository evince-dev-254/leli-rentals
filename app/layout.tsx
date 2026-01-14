import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Script from "next/script"
import { Toaster } from "@/components/ui/sonner"
import { OfflineBanner } from "@/components/ui/offline-banner"
import { FavoritesProvider } from "@/lib/favorites-context"
import { MessagesProvider } from "@/lib/messages-context"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const geist = Geist({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-geist'
})
const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-geist-mono'
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.leli.rentals'),
  title: {
    default: "Leli Rentals - Find Your Perfect Rental in Kenya",
    template: "%s | Leli Rentals"
  },
  description:
    "The premier destination for all your rental needs in Kenya. Discover amazing rentals for every occasion - from cars to equipment, homes to fashion. Rent what you need, when you need it.",
  generator: "evince Agency",
  applicationName: "Leli Rentals",
  keywords: [
    "rentals Kenya",
    "car rental Nairobi",
    "home rental Kenya",
    "equipment rental",
    "vehicle hire Kenya",
    "property rental",
    "event space rental",
    "electronics rental",
    "fashion rental",
    "rent items Kenya",
    "peer to peer rental",
    "rental marketplace",
    "Leli Rentals"
  ],
  authors: [{ name: "Leli Rentals" }],
  creator: "evince Agency",
  publisher: "Leli Rentals",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: 'https://www.leli.rentals',
    siteName: 'Leli Rentals',
    title: 'Leli Rentals - Find Your Perfect Rental in Kenya',
    description: 'The premier destination for all your rental needs in Kenya. Discover amazing rentals for every occasion - from cars to equipment, homes to fashion.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'leli rentals - Rent Anything, Anytime',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Leli Rentals - Find Your Perfect Rental in Kenya',
    description: 'The premier destination for all your rental needs in Kenya. Discover amazing rentals for every occasion.',
    images: ['/og-image.png'],
    creator: '@lelirentals',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased hide-scrollbar`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <FavoritesProvider>
            <MessagesProvider>
              {children}
              <Toaster position="top-center" richColors duration={12000} />
              <OfflineBanner />
            </MessagesProvider>
          </FavoritesProvider>
        </ThemeProvider>

        {/* CookieYes - Load after page is interactive */}
        <Script
          id="cookieyes"
          src="https://cdn-cookieyes.com/client_data/be8a3339e81a28dfeba5c085b6d4786b/script.js"
          strategy="afterInteractive"
        />

        {/* Tawk.to - Load lazily after everything else */}
        <Script
          id="tawk-to"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              (function(){
                var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                s1.async=true;
                s1.src='https://embed.tawk.to/YOUR_TAWK_PROPERTY_ID/YOUR_WIDGET_ID';
                s1.charset='UTF-8';
                s1.setAttribute('crossorigin','*');
                s0.parentNode.insertBefore(s1,s0);
              })();
            `
          }}
        />
      </body>
    </html>
  )
}
