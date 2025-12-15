import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { GoogleAnalytics } from '@next/third-parties/google'
import { CookieConsent } from "@/components/cookie-consent"
import { AiAssistant } from "@/components/ai-assistant"
import { FavoritesProvider } from "@/lib/favorites-context"
import { MessagesProvider } from "@/lib/messages-context"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.leli.rentals'),
  title: {
    default: "leli rentals - Find Your Perfect Rental in Kenya",
    template: "%s | leli rentals"
  },
  description:
    "The premier destination for all your rental needs in Kenya. Discover amazing rentals for every occasion - from cars to equipment, homes to fashion. Rent what you need, when you need it.",
  generator: "evince Agency",
  applicationName: "leli rentals",
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
    "leli rentals"
  ],
  authors: [{ name: "leli rentals" }],
  creator: "evince Agency",
  publisher: "leli rentals",
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
    siteName: 'leli rentals',
    title: 'leli rentals - Find Your Perfect Rental in Kenya',
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
    title: 'leli rentals - Find Your Perfect Rental in Kenya',
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
      <body className={`font-sans antialiased hide-scrollbar`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <FavoritesProvider>
            <MessagesProvider>
              {children}
              <AiAssistant />
              <CookieConsent />
              <Analytics />
              <GoogleAnalytics gaId="G-7MHZ00M71E" />
            </MessagesProvider>
          </FavoritesProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
