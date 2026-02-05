import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from "../lib/supabase";

interface FavoritesContextType {
    favorites: string[];
    addFavorite: (listingId: string) => void;
    removeFavorite: (listingId: string) => void;
    isFavorite: (listingId: string) => boolean;
    toggleFavorite: (listingId: string) => void;
    userId: string | null;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
    const [favorites, setFavorites] = useState<string[]>([]);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        async function init() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserId(user.id);
                const { data } = await supabase
                    .from('favorites')
                    .select('listing_id')
                    .eq('user_id', user.id);

                if (data) {
                    const ids = data.map(f => f.listing_id);
                    setFavorites(ids);
                    await AsyncStorage.setItem("leli-favorites", JSON.stringify(ids));
                }
            } else {
                const stored = await AsyncStorage.getItem("leli-favorites");
                if (stored) {
                    setFavorites(JSON.parse(stored));
                }
            }
        }
        init();
    }, []);

    useEffect(() => {
        if (favorites.length > 0) {
            AsyncStorage.setItem("leli-favorites", JSON.stringify(favorites));
        }
    }, [favorites]);

    const addFavorite = (listingId: string) => {
        if (!favorites.includes(listingId)) {
            setFavorites((prev) => [...prev, listingId]);
        }
    };

    const removeFavorite = (listingId: string) => {
        setFavorites((prev) => prev.filter((id) => id !== listingId));
    };

    const isFavorite = (listingId: string) => {
        return favorites.includes(listingId);
    };

    const toggleFavorite = async (listingId: string) => {
        const wasFavorite = isFavorite(listingId);

        if (wasFavorite) {
            removeFavorite(listingId);
        } else {
            addFavorite(listingId);
        }

        if (userId) {
            try {
                if (wasFavorite) {
                    await supabase.from('favorites').delete().eq('user_id', userId).eq('listing_id', listingId);
                } else {
                    await supabase.from('favorites').insert({ user_id: userId, listing_id: listingId });
                }
            } catch (error) {
                console.error("Failed to sync favorite to server:", error);
            }
        }
    };

    return (
        <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite, userId }}>
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error("useFavorites must be used within a FavoritesProvider");
    }
    return context;
}
