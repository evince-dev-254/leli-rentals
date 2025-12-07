import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { GoogleAnalytics } from '@next/third-parties/google'
import { CookieConsent } from "@/components/cookie-consent"
import { FavoritesProvider } from "@/lib/favorites-context"
import { MessagesProvider } from "@/lib/messages-context"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Leli Rentals - Find Your Perfect Rental",
  description:
    "The premier destination for all your rental needs. Discover amazing rentals for every occasion - from cars to equipment, homes to fashion.",
  generator: "evince Agency",
  keywords: ["rentals", "car rental", "home rental", "equipment rental", "Kenya", "Nairobi"],
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <FavoritesProvider>
            <MessagesProvider>
              {children}
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
