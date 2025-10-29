"use client"

import React, { useEffect, useRef, useState } from 'react'

interface VideoBackgroundProps {
  src: string
  fallbackImage?: string
  className?: string
  children?: React.ReactNode
  overlayStyle?: string
}

export function VideoBackground({ 
  src, 
  fallbackImage = '/modern-rental-marketplace-hero-with-cars--apartmen.jpg',
  className = '',
  children,
  overlayStyle = ''
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showVideo, setShowVideo] = useState(false)

  useEffect(() => {
    // Check if device is mobile - temporarily disable mobile check to test video
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      setIsMobile(mobile)
      // Always show video for testing - remove this later
      setShowVideo(true)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !showVideo) return

    const handleCanPlay = () => {
      console.log('Video can play:', src)
      setIsVideoLoaded(true)
    }

    const handleError = (e: Event) => {
      console.error('Video failed to load:', src, e)
      setShowVideo(false)
    }

    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('error', handleError)

    // Let the source tag handle the src, just trigger load
    video.load()

    return () => {
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('error', handleError)
    }
  }, [showVideo, src])

  // Debug info
  console.log('VideoBackground render:', { showVideo, isVideoLoaded, isMobile, src })

  return (
    <div className={`relative overflow-hidden ${className}`}>

      {/* Video Background */}
      {showVideo && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover video-bg-layer opacity-100"
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* Fallback Image Background - Mobile or when video fails */}
      {!showVideo && (
        <div 
          className="absolute inset-0 w-full h-full object-cover bg-cover bg-center bg-no-repeat video-bg-layer"
          style={{ 
            backgroundImage: `url(${fallbackImage})`
          }}
        />
      )}

      {/* Loading state background - show immediately */}
      {showVideo && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-700 to-purple-900 video-bg-layer opacity-50" />
      )}

      {/* Gradient Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-black/60 dark:from-black/70 dark:via-black/50 dark:to-black/80 transition-all duration-500 video-overlay-layer" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

export default VideoBackground
