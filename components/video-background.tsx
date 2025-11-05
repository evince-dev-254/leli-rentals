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
  const [isPlaying, setIsPlaying] = useState(false)

  // Check if document is visible
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playVideo = async () => {
      try {
        await video.play();
        setIsPlaying(true);
      } catch (err) {
        console.error('Video playback failed:', err);
        setIsPlaying(false);
      }
    };

    const handleCanPlay = () => {
      console.log('Video can play:', src);
      playVideo();
    };

    video.addEventListener('canplay', handleCanPlay);
    video.load(); // Start loading the video

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Fallback Image */}
      <img 
        src={fallbackImage}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        role="presentation"
      />

      {/* Video */}
      <video
        ref={videoRef}
        playsInline
        autoPlay
        loop
        muted
        preload="auto"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
        poster={fallbackImage}
      >
        <source src={src} type="video/mp4" />
      </video>

      {/* Single Overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-black/50 via-black/30 to-black/60 dark:from-black/70 dark:via-black/50 dark:to-black/80 transition-all duration-500" />

      {/* Single Content Layer */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

export default VideoBackground
