"use client"

import { motion } from "framer-motion"
import { ArrowRight, Car, Home, Wrench, Laptop, Shirt, Music, Camera, Star } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const categories = [
    {
        id: "vehicles",
        name: "Vehicles",
        description: "Cars, motorcycles, trucks & more",
        count: "1,800+",
        href: "/listings?category=vehicles",
        image: "/luxury-cars-in-modern-showroom.jpg",
        icon: Car,
        className: "md:col-span-2 md:row-span-2",
        color: "bg-blue-500",
    },
    {
        id: "homes",
        name: "Homes",
        description: "Vacation homes & apartments",
        count: "2,500+",
        href: "/listings?category=homes",
        image: "/modern-apartment-city-view.png",
        icon: Home,
        className: "md:col-span-1 md:row-span-2",
        color: "bg-green-500",
    },
    {
        id: "equipment",
        name: "Equipment",
        description: "Professional tools",
        count: "3,200+",
        href: "/listings?category=equipment",
        image: "/professional-construction-and-industrial-equipment.jpg",
        icon: Wrench,
        className: "md:col-span-1 md:row-span-1",
        color: "bg-orange-500",
    },
    {
        id: "electronics",
        name: "Electronics",
        description: "Gadgets & tech",
        count: "950+",
        href: "/listings?category=electronics",
        image: "/modern-electronics-and-tech-gadgets-display.jpg",
        icon: Laptop,
        className: "md:col-span-1 md:row-span-1",
        color: "bg-purple-500",
    },
    {
        id: "fashion",
        name: "Fashion",
        description: "Clothing & accessories",
        count: "1,200+",
        href: "/listings?category=fashion",
        image: "/designer-clothing-and-fashion-accessories.jpg",
        icon: Shirt,
        className: "md:col-span-1 md:row-span-1",
        color: "bg-pink-500",
    },
    {
        id: "entertainment",
        name: "Entertainment",
        description: "Music & gaming",
        count: "850+",
        href: "/listings?category=entertainment",
        image: "/elegant-event-venue-with-chandeliers-and-tables.jpg",
        icon: Music,
        className: "md:col-span-2 md:row-span-1",
        color: "bg-indigo-500",
    },
]

export function BentoGridCategories() {
    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                        <Star className="h-4 w-4 fill-current" />
                        Explore Categories
                    </div>
                    <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Browse by Category
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Find exactly what you're looking for across our diverse range of rental categories.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[200px]">
                    {categories.map((category, index) => (
                        <Link
                            key={category.id}
                            href={category.href}
                            className={cn(
                                "group relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-xl transition-all duration-300",
                                category.className
                            )}
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                            </div>

                            {/* Content */}
                            <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className={cn("p-2 rounded-lg text-white backdrop-blur-md bg-white/10", category.color)}>
                                            <category.icon className="h-5 w-5" />
                                        </div>
                                        <span className="text-xs font-medium text-white/80 bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">
                                            {category.count} items
                                        </span>
                                    </div>
                                    <h3 className="font-heading text-2xl font-bold text-white mb-1">
                                        {category.name}
                                    </h3>
                                    <p className="text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                                        {category.description}
                                    </p>

                                    <div className="mt-4 flex items-center text-sm font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                        Browse Category <ArrowRight className="ml-2 h-4 w-4" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Link href="/categories">
                        <Button variant="outline" size="lg" className="rounded-full px-8 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">
                            View All Categories
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}
