"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { toggleFavoriteAction } from "./actions/dashboard-actions"
import { supabase } from "./supabase"

interface FavoritesContextType {
  favorites: string[]
  addFavorite: (listingId: string) => void
  removeFavorite: (listingId: string) => void
  isFavorite: (listingId: string) => boolean
  toggleFavorite: (listingId: string) => void
  userId: string | null
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([])
  const [userId, setUserId] = useState<string | null>(null)

  // 1. Get user on mount and sync favorites
  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        // Fetch favorites from DB
        const { data } = await supabase
          .from('favorites')
          .select('listing_id')
          .eq('user_id', user.id)

        if (data) {
          const ids = data.map(f => f.listing_id)
          setFavorites(ids)
          localStorage.setItem("leli-favorites", JSON.stringify(ids))
        }
      } else {
        // Fallback to localStorage for guests
        const stored = localStorage.getItem("leli-favorites")
        if (stored) {
          setFavorites(JSON.parse(stored))
        }
      }
    }
    init()
  }, [])

  // Save to localStorage when favorites change (for persistence and guests)
  useEffect(() => {
    if (favorites.length > 0) {
      localStorage.setItem("leli-favorites", JSON.stringify(favorites))
    }
  }, [favorites])

  const addFavorite = (listingId: string) => {
    if (!favorites.includes(listingId)) {
      setFavorites((prev) => [...prev, listingId])
    }
  }

  const removeFavorite = (listingId: string) => {
    setFavorites((prev) => prev.filter((id) => id !== listingId))
  }

  const isFavorite = (listingId: string) => {
    return favorites.includes(listingId)
  }

  const toggleFavorite = async (listingId: string) => {
    const wasFavorite = isFavorite(listingId)

    // Optimistic UI
    if (wasFavorite) {
      removeFavorite(listingId)
    } else {
      addFavorite(listingId)
    }

    // Server-side persistence if logged in
    if (userId) {
      try {
        await toggleFavoriteAction(listingId, userId)
      } catch (error) {
        console.error("Failed to sync favorite to server:", error)
        // Revert on error? Or just leave it local
      }
    }
  }

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite, userId }}>
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
