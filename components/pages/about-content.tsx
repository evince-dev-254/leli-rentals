"use client"

import { useState } from "react"
import Image from "next/image"
import { Users, Package, MapPin, Star, Target, Heart, Shield, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const stats = [
  { icon: Users, value: "50,000+", label: "Active Users" },
  { icon: Package, value: "200,000+", label: "Successful Rentals" },
  { icon: MapPin, value: "25+", label: "Cities Covered" },
  { icon: Star, value: "4.8", label: "Average Rating" },
]

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

const team = [
  { name: "John Kamau", role: "CEO & Founder", image: "/african-man-professional.png" },
  { name: "Sarah Wanjiku", role: "COO", image: "/african-woman-professional.jpg" },
  { name: "David Ochieng", role: "CTO", image: "/kenyan-man-business.jpg" },
  { name: "Grace Muthoni", role: "Head of Operations", image: "/young-african-woman.jpg" },
]

export function AboutContent() {
  const [videoError, setVideoError] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)

  return (
    <div className="relative">
      {/* Hero Section with Video Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        {!videoError && (
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="/modern-apartment-interior-with-city-skyline-view.jpg"
            onLoadedData={() => setVideoLoaded(true)}
            onError={() => setVideoError(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded ? "opacity-100" : "opacity-0"
              }`}
          >
            <source
              src="/videos/about-hero-video.mp4"
              type="video/mp4"
            />
          </video>
        )}

        {/* Fallback Background Image */}
        <div
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${videoLoaded && !videoError ? "opacity-0" : "opacity-100"
            }`}
          style={{
            backgroundImage: `url('/nairobi-city-skyline-at-sunset-panoramic.jpg')`,
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
              We&apos;re on a mission to transform how people access and share items. From vehicles to homes, equipment to
              fashion, we connect you with what you need, when you need it.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="glass-card border-border/50 text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
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
                  leli rentals was born from a simple observation: people own items they rarely use, while others
                  struggle to access those same items when they need them most.
                </p>
                <p>
                  Founded in Nairobi in 2020, we started as a small platform connecting car owners with those who needed
                  temporary transportation. Today, we&apos;ve grown to serve thousands of users across Kenya, offering
                  everything from vehicles and homes to equipment and fashion items.
                </p>
                <p>
                  Our commitment to verification and trust has made us the leading rental marketplace in East Africa. We
                  verify every owner and affiliate within 5 days to ensure safe, secure transactions for our community.
                </p>
              </div>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden">
              <Image src="/modern-apartment-interior-with-city-skyline-view.jpg" alt="Nairobi Skyline" fill className="object-cover" />
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

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">The passionate people behind leli rentals.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="glass-card border-border/50 overflow-hidden group">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="pt-4 text-center">
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
