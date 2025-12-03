"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin, ArrowRight, Sparkles } from "lucide-react"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"

export function Footer() {
  const { theme } = useTheme()
  const [email, setEmail] = useState("")
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubscribe = async () => {
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address to subscribe.",
        variant: "destructive",
      })
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe')
      }

      toast({
        title: "Successfully subscribed!",
        description: "Thank you for subscribing to our newsletter. Check your email for confirmation.",
      })
      setEmail("")
    } catch (error: any) {
      toast({
        title: "Subscription failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const handleSocialClick = (platform: string) => {
    const urls = {
      facebook: "https://facebook.com/lelirentals",
      twitter: "https://twitter.com/lelirentals",
      instagram: "https://instagram.com/lelirentals",
      linkedin: "https://linkedin.com/company/lelirentals",
      youtube: "https://youtube.com/@lelirentals",
    }
    window.open(urls[platform as keyof typeof urls], "_blank")
  }

  return (
    <footer className="relative bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* Newsletter Section */}
      <div className="relative border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-6 py-16 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl text-center lg:text-left">
              <h3 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Stay ahead of the curve
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Join our newsletter for exclusive deals, new listings, and rental tips delivered straight to your inbox.
              </p>
            </div>
            <div className="w-full max-w-md">
              <div className="flex gap-2 p-1.5 bg-gray-100 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                <Input
                  placeholder="Enter your email address"
                  className="flex-1 border-none bg-transparent h-12 px-4 focus-visible:ring-0 text-base"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSubscribe()}
                />
                <Button
                  className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
                  onClick={handleSubscribe}
                >
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-3 text-center lg:text-left">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative pt-16 pb-8">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
            {/* Brand Column */}
            <div className="lg:col-span-4 space-y-6">
              <Link href="/" className="flex items-center group w-fit">
                <img
                  src="/default-monochrome-black.svg"
                  alt="Leli Rentals Logo"
                  className="h-8 w-auto object-contain dark:hidden hover:opacity-80 transition-opacity"
                />
                <img
                  src="/default-monochrome-white.svg"
                  alt="Leli Rentals Logo"
                  className="h-8 w-auto object-contain hidden dark:block hover:opacity-80 transition-opacity"
                />
              </Link>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-sm">
                The premier destination for all your rental needs. Experience seamless booking, verified listings, and premium support.
              </p>
              <div className="flex gap-3">
                {['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'].map((platform) => (
                  <Button
                    key={platform}
                    variant="outline"
                    size="icon"
                    className="rounded-full h-10 w-10 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:-translate-y-1"
                    onClick={() => handleSocialClick(platform)}
                  >
                    {platform === 'facebook' && <Facebook className="h-5 w-5" />}
                    {platform === 'twitter' && <Twitter className="h-5 w-5" />}
                    {platform === 'instagram' && <Instagram className="h-5 w-5" />}
                    {platform === 'linkedin' && <Linkedin className="h-5 w-5" />}
                    {platform === 'youtube' && <Youtube className="h-5 w-5" />}
                  </Button>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            <div className="lg:col-span-2">
              <h4 className="font-heading font-bold text-gray-900 dark:text-white mb-6">Platform</h4>
              <ul className="space-y-4">
                <li><Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link></li>
                <li><Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About Us</Link></li>
                <li><Link href="/pricing" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Pricing</Link></li>
                <li><Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="font-heading font-bold text-gray-900 dark:text-white mb-6">Categories</h4>
              <ul className="space-y-4">
                <li><Link href="/listings/homes" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Homes</Link></li>
                <li><Link href="/listings/vehicles" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Vehicles</Link></li>
                <li><Link href="/listings/equipment" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Equipment</Link></li>
                <li><Link href="/listings/events" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Event Spaces</Link></li>
              </ul>
            </div>

            <div className="lg:col-span-4">
              <h4 className="font-heading font-bold text-gray-900 dark:text-white mb-6">Contact Us</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Headquarters</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">123 Rental Street, Nairobi, Kenya 00100</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Phone</p>
                    <a href="tel:+254112081866" className="text-gray-600 dark:text-gray-400 text-sm mt-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">+254 112 081 866</a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Email</p>
                    <a href="mailto:info@leli.rentals" className="text-gray-600 dark:text-gray-400 text-sm mt-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">info@leli.rentals</a>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left space-y-1">
              <p className="text-gray-500 dark:text-gray-500 text-sm">
                © 2025 Leli Rentals. All rights reserved.
              </p>
              <p className="text-gray-400 dark:text-gray-600 text-xs">
                Developed by <a href="https://gurucrafts.agency" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">GuruCrafts Agency</a>
              </p>
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">Terms</Link>
              <Link href="/cookies" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

