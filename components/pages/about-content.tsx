"use client"

import { useState } from "react"
import Image from "next/image"
import { Target, Heart, Shield, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"



const values = [
  {
    icon: Target,
    title: "Our Mission",
    description: "To make renting accessible, affordable, and trustworthy for everyone in Kenya and beyond.",
  },
  {
    icon: Heart,
    title: "Community First",
    description: "We believe in building strong communities by connecting people with the things they need.",
  },
  {
    icon: Shield,
    title: "Trust & Safety",
    description: "Every owner and affiliate is verified to ensure secure transactions for all users.",
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "We continuously improve our platform to deliver the best rental experience possible.",
  },
]



export function AboutContent() {
  const [videoError, setVideoError] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)

  return (
    <div className="relative">
      {/* Hero Section with Video Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        {/* Animated Background Image (Ken Burns Effect) */}
        <div
          className="absolute inset-0 bg-cover bg-center animate-ken-burns"
          style={{
            backgroundImage: `url('/kenyan-man-business.jpg')`,
          }}
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance text-white">
              About <span className="text-primary">leli rentals</span>
            </h1>
            <p className="text-xl text-white/80 text-pretty">
              Leli Rentals aims to modernize and simplify the rental experience by providing a trusted, seamless, and tech-driven marketplace that efficiently connects renters and listers, empowering the growth of the sharing economy.
            </p>
          </div>
        </div>
      </section>



      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Welcome to Leli Rentals, the premier modern, tech-inspired rental marketplace designed to simplify your search for the perfect item. We connect thousands of users across various categories, from vehicles and equipment to homes and fashion, all on one seamless platform.
                </p>
                <p>
                  Leli Rentals was founded in December 2025 with a singular vision: to revolutionize the rental experience. We recognized the growing need for a trusted, efficient, and streamlined platform to power the sharing economy in Kenya and beyond.
                </p>
                <p>
                  Our commitment is to your peace of mind. We leverage modern technology to provide easy search, verified listings, and an instant booking system. Whether you are looking to rent an item or earn money by listing your own, we are dedicated to making your experience secure, transparent, and effortlessly modern.
                </p>
              </div>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden">
              <Image src="/kenyan-man-business.jpg" alt="Leli Rentals Founder" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-lg font-semibold">Proudly Kenyan</p>
                <p className="text-sm opacity-80">Built in Nairobi, serving East Africa</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do at leli rentals.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="glass-card border-border/50">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>


    </div>
  )
}
