"use client"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Car, Home, Wrench, Smartphone, Shirt, Music, PartyPopper, ArrowRight, Briefcase } from "lucide-react"
import { staggerContainer, fadeInUp } from "@/lib/animations"

const categories = [
  {
    name: "Vehicles",
    description: "Cars, motorcycles, trucks & more",
    count: "1,800+",
    icon: Car,
    href: "/categories/vehicles",
    color: "bg-blue-500",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
  },
  {
    name: "Living Spaces",
    description: "Homes & Apartments",
    count: "2,500+",
    icon: Home,
    href: "/categories/living",
    color: "bg-green-500",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
  },
  {
    name: "Equipment",
    description: "Professional tools & machinery",
    count: "3,200+",
    icon: Wrench,
    href: "/categories/equipment",
    color: "bg-orange-500",
    image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800&q=80",
  },
  {
    name: "Electronics",
    description: "Gadgets & tech gear",
    count: "950+",
    icon: Smartphone,
    href: "/categories/electronics",
    color: "bg-purple-500",
    image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&q=80",
  },
  {
    name: "Fashion",
    description: "Clothing & accessories",
    count: "1,200+",
    icon: Shirt,
    href: "/categories/fashion",
    color: "bg-pink-500",
    image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80",
  },
  {
    name: "Entertainment",
    description: "Music & gaming equipment",
    count: "850+",
    icon: Music,
    href: "/categories/entertainment",
    color: "bg-indigo-500",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80",
  },
  {
    name: "Utility Spaces",
    description: "Venues & work spaces",
    count: "600+",
    icon: PartyPopper,
    href: "/categories/utility",
    color: "bg-teal-500",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
  },
  {
    name: "Business Spaces",
    description: "Office & retail spaces",
    count: "1,200+",
    icon: Briefcase,
    href: "/categories/business",
    color: "bg-gray-500",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
  },
]

export function CategoriesSection() {
  return (
    <section className="pt-20 pb-10 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Browse by Category</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find exactly what you&apos;re looking for across our diverse range of rental categories.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto"
        >
          {/* Featured Category - Vehicles (Large) */}
          <motion.div
            variants={fadeInUp}
            className="md:col-span-2 md:row-span-2 group"
          >
            <Link href={categories[0].href} className="block h-full">
              <div className="relative h-full min-h-[400px] rounded-2xl overflow-hidden">
                <Image
                  src={categories[0].image || "/placeholder.svg"}
                  alt={categories[0].name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Icon Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <div className={`w-10 h-10 rounded-full ${categories[0].color} flex items-center justify-center`}>
                    <Car className="h-5 w-5 text-white" />
                  </div>
                  <Badge className="bg-black/50 text-white border-none">{categories[0].count} items</Badge>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-white mb-1">{categories[0].name}</h3>
                  <p className="text-white/80 mb-3">{categories[0].description}</p>
                  <div className="flex items-center text-white font-medium group-hover:underline">
                    Browse Category <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Living Spaces (Medium) */}
          <motion.div
            variants={fadeInUp}
            className="md:row-span-2 group"
          >
            <Link href={categories[1].href} className="block h-full">
              <div className="relative h-full min-h-[400px] rounded-2xl overflow-hidden">
                <Image
                  src={categories[1].image || "/placeholder.svg"}
                  alt={categories[1].name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 25vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Icon Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <div className={`w-10 h-10 rounded-full ${categories[1].color} flex items-center justify-center`}>
                    <Home className="h-5 w-5 text-white" />
                  </div>
                  <Badge className="bg-black/50 text-white border-none">{categories[1].count} items</Badge>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-xl font-bold text-white mb-1">{categories[1].name}</h3>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Equipment (Small) */}
          <motion.div
            variants={fadeInUp}
            className="group"
          >
            <Link href={categories[2].href} className="block h-full">
              <div className="relative h-[190px] rounded-2xl overflow-hidden">
                <Image
                  src={categories[2].image || "/placeholder.svg"}
                  alt={categories[2].name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Icon Badge */}
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full ${categories[2].color} flex items-center justify-center`}>
                    <Wrench className="h-4 w-4 text-white" />
                  </div>
                  <Badge className="bg-black/50 text-white border-none text-xs">{categories[2].count} items</Badge>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg font-bold text-white">{categories[2].name}</h3>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Electronics (Small) */}
          <motion.div
            variants={fadeInUp}
            className="group"
          >
            <Link href={categories[3].href} className="block h-full">
              <div className="relative h-[190px] rounded-2xl overflow-hidden">
                <Image
                  src={categories[3].image || "/placeholder.svg"}
                  alt={categories[3].name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Icon Badge */}
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full ${categories[3].color} flex items-center justify-center`}>
                    <Smartphone className="h-4 w-4 text-white" />
                  </div>
                  <Badge className="bg-black/50 text-white border-none text-xs">{categories[3].count} items</Badge>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg font-bold text-white">{categories[3].name}</h3>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Fashion (Small) */}
          <motion.div
            variants={fadeInUp}
            className="group"
          >
            <Link href={categories[4].href} className="block h-full">
              <div className="relative h-[190px] rounded-2xl overflow-hidden">
                <Image
                  src={categories[4].image || "/placeholder.svg"}
                  alt={categories[4].name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Icon Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full ${categories[4].color} flex items-center justify-center`}>
                    <Shirt className="h-4 w-4 text-white" />
                  </div>
                  <Badge className="bg-black/50 text-white border-none text-xs">{categories[4].count} items</Badge>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg font-bold text-white">{categories[4].name}</h3>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Entertainment (Medium spanning 2 cols) */}
          <motion.div
            variants={fadeInUp}
            className="md:col-span-2 group"
          >
            <Link href={categories[5].href} className="block h-full">
              <div className="relative h-[190px] rounded-2xl overflow-hidden">
                <Image
                  src={categories[5].image || "/placeholder.svg"}
                  alt={categories[5].name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Icon Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full ${categories[5].color} flex items-center justify-center`}>
                    <Music className="h-4 w-4 text-white" />
                  </div>
                  <Badge className="bg-black/50 text-white border-none text-xs">{categories[5].count} items</Badge>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg font-bold text-white">{categories[5].name}</h3>
                  <p className="text-white/70 text-sm">{categories[5].description}</p>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Utility Spaces */}
          <motion.div
            variants={fadeInUp}
            className="group"
          >
            <Link href={categories[6].href} className="block h-full">
              <div className="relative h-[190px] rounded-2xl overflow-hidden">
                <Image
                  src={categories[6].image || "/placeholder.svg"}
                  alt={categories[6].name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Icon Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full ${categories[6].color} flex items-center justify-center`}>
                    <PartyPopper className="h-4 w-4 text-white" />
                  </div>
                  <Badge className="bg-black/50 text-white border-none text-xs">{categories[6].count} items</Badge>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg font-bold text-white">{categories[6].name}</h3>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Business Spaces - New */}
          <motion.div
            variants={fadeInUp}
            className="group"
          >
            <Link href={categories[7].href} className="block h-full">
              <div className="relative h-[190px] rounded-2xl overflow-hidden">
                <Image
                  src={categories[7].image || "/placeholder.svg"}
                  alt={categories[7].name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Icon Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full ${categories[7].color} flex items-center justify-center`}>
                    <Briefcase className="h-4 w-4 text-white" />
                  </div>
                  <Badge className="bg-black/50 text-white border-none text-xs">{categories[7].count} items</Badge>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg font-bold text-white">{categories[7].name}</h3>
                </div>
              </div>
            </Link>
          </motion.div>
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center mt-6"
        >
          <Link href="/categories">
            <Button size="lg" className="bg-orange-500 text-white hover:bg-orange-600 border-none shadow-lg hover:shadow-xl transition-all duration-300 font-semibold px-8 py-6 rounded-xl text-lg group">
              View All Categories
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
