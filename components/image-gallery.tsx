"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface ImageGalleryProps {
    images: string[]
    alt?: string
    className?: string
}

export function ImageGallery({ images, alt = "Gallery image", className }: ImageGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [isLightboxOpen, setIsLightboxOpen] = useState(false)

    const openLightbox = (index: number) => {
        setSelectedIndex(index)
        setIsLightboxOpen(true)
    }

    const closeLightbox = () => {
        setIsLightboxOpen(false)
    }

    const goToPrevious = () => {
        setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    }

    const goToNext = () => {
        setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }

    if (images.length === 0) {
        return (
            <div className={cn("bg-gray-200 dark:bg-gray-800 rounded-2xl flex items-center justify-center", className)}>
                <p className="text-gray-500">No images available</p>
            </div>
        )
    }

    return (
        <>
            <div className={cn("space-y-4", className)}>
                {/* Main Image */}
                <div
                    className="relative aspect-[16/10] rounded-2xl overflow-hidden cursor-pointer group"
                    onClick={() => openLightbox(selectedIndex)}
                >
                    <Image
                        src={images[selectedIndex]}
                        alt={`${alt} - Main`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileHover={{ opacity: 1, scale: 1 }}
                            className="bg-white/90 dark:bg-gray-900/90 p-3 rounded-full"
                        >
                            <ZoomIn className="h-6 w-6 text-gray-900 dark:text-white" />
                        </motion.div>
                    </div>
                </div>

                {/* Thumbnail Grid */}
                {images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                        {images.slice(0, 4).map((image, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all",
                                    selectedIndex === index
                                        ? "border-blue-500 ring-2 ring-blue-500/50"
                                        : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                                )}
                                onClick={() => setSelectedIndex(index)}
                            >
                                <Image
                                    src={image}
                                    alt={`${alt} - Thumbnail ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                                {index === 3 && images.length > 4 && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                        <span className="text-white font-semibold text-lg">
                                            +{images.length - 4}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {isLightboxOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
                        onClick={closeLightbox}
                    >
                        {/* Close Button */}
                        <button
                            onClick={closeLightbox}
                            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
                        >
                            <X className="h-6 w-6 text-white" />
                        </button>

                        {/* Navigation Buttons */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        goToPrevious()
                                    }}
                                    className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
                                >
                                    <ChevronLeft className="h-6 w-6 text-white" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        goToNext()
                                    }}
                                    className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
                                >
                                    <ChevronRight className="h-6 w-6 text-white" />
                                </button>
                            </>
                        )}

                        {/* Image Counter */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 rounded-full text-white text-sm">
                            {selectedIndex + 1} / {images.length}
                        </div>

                        {/* Main Image */}
                        <motion.div
                            key={selectedIndex}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            className="relative max-w-7xl max-h-[90vh] w-full h-full mx-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={images[selectedIndex]}
                                alt={`${alt} - ${selectedIndex + 1}`}
                                fill
                                className="object-contain"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
