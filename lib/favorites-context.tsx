"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface FavoritesContextType {
  favorites: string[]
  addFavorite: (listingId: string) => void
  removeFavorite: (listingId: string) => void
  isFavorite: (listingId: string) => boolean
  toggleFavorite: (listingId: string) => void
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([])

  // Load favorites from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("leli-favorites")
    if (stored) {
      setFavorites(JSON.parse(stored))
    }
  }, [])

  // Save to localStorage when favorites change
  useEffect(() => {
    localStorage.setItem("leli-favorites", JSON.stringify(favorites))
  }, [favorites])

  const addFavorite = (listingId: string) => {
    setFavorites((prev) => [...prev, listingId])
  }

  const removeFavorite = (listingId: string) => {
    setFavorites((prev) => prev.filter((id) => id !== listingId))
  }

  const isFavorite = (listingId: string) => {
    return favorites.includes(listingId)
  }

  const toggleFavorite = (listingId: string) => {
    if (isFavorite(listingId)) {
      removeFavorite(listingId)
    } else {
      addFavorite(listingId)
    }
  }

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider")
  }
  return context
}
