import type React from "react"
import type { Metadata } from "next"
import { Outfit, Geist_Mono } from "next/font/google"
import Script from "next/script"
import { Toaster } from "@/components/ui/sonner"
import { OfflineBanner } from "@/components/ui/offline-banner"
import { FavoritesProvider } from "@/lib/favorites-context"
import { MessagesProvider } from "@/lib/messages-context"
import { ThemeProvider } from "@/components/theme-provider"
import { ConsoleWarning } from "@/components/security/console-warning"
import "./globals.css"

const outfit = Outfit({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-outfit'
})
const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-geist-mono'
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.leli.rentals'),
  alternates: {
    canonical: './',
  },
  title: {
    default: "Leli Rentals - Find Your Perfect Rental",
    template: "%s | Leli Rentals"
  },
  description:
    "Premier peer-to-peer rental marketplace in Kenya. Rent cars, homes, equipment, electronics, fashion & more. Find what you need, when you need it.",
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
    "Leli Rentals",
    "rental tips Kenya",
    "rental market insights",
    "sharing economy blog",
    "rental guides Kenya"
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
    locale: 'en_US',
    url: 'https://www.leli.rentals',
    siteName: 'Leli Rentals',
    title: 'Leli Rentals - Find Your Perfect Rental',
    description: 'Premier peer-to-peer rental marketplace in Kenya. Rent cars, homes, equipment, electronics, fashion & more.',
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
      <body className={`${outfit.variable} ${geistMono.variable} font-sans antialiased hide-scrollbar gradient-mesh`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <FavoritesProvider>
            <MessagesProvider>
              {children}
              <Toaster position="top-center" richColors duration={12000} />
              <OfflineBanner />
            </MessagesProvider>
          </FavoritesProvider>
        </ThemeProvider>

        {/* CookieYes - Load after page is interactive (Production only) */}
        {process.env.NODE_ENV === 'production' && (
          <Script
            id="cookieyes"
            src="https://cdn-cookieyes.com/client_data/be8a3339e81a28dfeba5c085b6d4786b/script.js"
            strategy="afterInteractive"
          />
        )}

        {/* Google Analytics 4 - Load after page is interactive */}
        {process.env.NODE_ENV === 'production' && (
          <>
            <Script
              src="https://www.googletagmanager.com/gtag/js?id=G-7MHZ00M71E"
              strategy="afterInteractive"
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'G-7MHZ00M71E', {
                    page_path: window.location.pathname,
                  });
                `
              }}
            />
          </>
        )}

        {/* Ahrefs Web Analytics - Load after page is interactive */}
        <Script
          id="ahrefs-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                var s=document.createElement('script');
                s.src='https://analytics.ahrefs.com/analytics.js';
                s.setAttribute('data-key','ShZx2eLOXdw8j+XqKVfzDw');
                s.async=true;
                document.head.appendChild(s);
              })();
            `
          }}
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
                s1.src='https://embed.tawk.to/6954cc957665ef197dae18b7/1jdpjuar6';
                s1.charset='UTF-8';
                s1.setAttribute('crossorigin','*');
                s0.parentNode.insertBefore(s1,s0);
              })();
            `
          }}
        />

        {/* Structured Data for SEO */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Leli Rentals',
              alternateName: 'Leli',
              url: 'https://www.leli.rentals',
              logo: 'https://www.leli.rentals/logo.png',
              description: 'Premier peer-to-peer rental marketplace in Kenya. Rent cars, homes, equipment, electronics, fashion & more.',
              foundingDate: '2024',
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'KE',
                addressLocality: 'Nairobi',
                addressRegion: 'Nairobi County',
              },
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'Customer Service',
                telephone: '+254785063461',
                email: 'support@leli.rentals',
                availableLanguage: ['English', 'Swahili'],
                areaServed: 'KE',
              },
              sameAs: [
                'https://twitter.com/lelirentals',
                'https://facebook.com/lelirentals',
                'https://instagram.com/lelirentals',
                'https://tiktok.com/@lelirentals',
                'https://linkedin.com/company/lelirentals',
              ],
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                reviewCount: '250',
              },
            })
          }}
        />
        <Script
          id="website-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Leli Rentals',
              url: 'https://www.leli.rentals',
              description: 'The premier destination for all your rental needs in Kenya.',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://www.leli.rentals/search?q={search_term_string}',
                },
                'query-input': 'required name=search_term_string',
              },
            })
          }}
        />
        <ConsoleWarning />
      </body>
    </html>
  )
}
