import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FavoritesContextType {
    favorites: string[];
    toggleFavorite: (id: string) => Promise<void>;
    isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
    const [favorites, setFavorites] = useState<string[]>([]);

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        try {
            const saved = await AsyncStorage.getItem('favoriteProperties');
            if (saved) {
                setFavorites(JSON.parse(saved));
            }
        } catch (error) {
            console.error('Error loading favorites:', error);
        }
    };

    const toggleFavorite = async (id: string) => {
        try {
            let newFavorites = [...favorites];
            const index = newFavorites.indexOf(id);
            if (index > -1) {
                newFavorites.splice(index, 1);
            } else {
                newFavorites.push(id);
            }
            setFavorites(newFavorites);
            await AsyncStorage.setItem('favoriteProperties', JSON.stringify(newFavorites));
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    const isFavorite = (id: string) => favorites.includes(id);

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    const context = useContext(FavoritesContext);
    if (context === undefined) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
}
