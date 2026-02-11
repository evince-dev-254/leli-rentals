import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserRole = 'renter' | 'owner' | 'agent';

interface PinnedPage {
    id: string;
    label: string;
    href: string;
    icon: string;
}

interface UserContextType {
    role: UserRole;
    userName: string;
    email: string;
    phone: string;
    location: string;
    isVerified: boolean;
    switchRole: (newRole: UserRole) => void;
    updateProfile: (profile: Partial<{ userName: string, email: string, phone: string, location: string }>) => void;
    pinnedPages: PinnedPage[];
    togglePinPage: (page: PinnedPage) => void;
    isPinned: (id: string) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [role, setRole] = useState<UserRole>('owner');
    const [userName, setUserName] = useState('Jane Doe');
    const [email, setEmail] = useState('jane.doe@email.com');
    const [phone, setPhone] = useState('+254 712 345 678');
    const [location, setLocation] = useState('Nairobi, Kenya');
    const [isVerified, setIsVerified] = useState(true);
    const [pinnedPages, setPinnedPages] = useState<PinnedPage[]>([]);

    useEffect(() => {
        loadPinnedPages();
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const saved = await AsyncStorage.getItem('userProfile');
            if (saved) {
                const profile = JSON.parse(saved);
                if (profile.userName) setUserName(profile.userName);
                if (profile.email) setEmail(profile.email);
                if (profile.phone) setPhone(profile.phone);
                if (profile.location) setLocation(profile.location);
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    };

    const updateProfile = async (profile: Partial<{ userName: string, email: string, phone: string, location: string }>) => {
        if (profile.userName) setUserName(profile.userName);
        if (profile.email) setEmail(profile.email);
        if (profile.phone) setPhone(profile.phone);
        if (profile.location) setLocation(profile.location);

        try {
            const current = await AsyncStorage.getItem('userProfile');
            const currentProfile = current ? JSON.parse(current) : {};
            const newProfile = { ...currentProfile, ...profile };
            await AsyncStorage.setItem('userProfile', JSON.stringify(newProfile));
        } catch (error) {
            console.error('Error saving profile:', error);
        }
    };

    const loadPinnedPages = async () => {
        try {
            const saved = await AsyncStorage.getItem('pinnedPages');
            if (saved) {
                setPinnedPages(JSON.parse(saved));
            }
        } catch (error) {
            console.error('Error loading pinned pages:', error);
        }
    };

    const togglePinPage = async (page: PinnedPage) => {
        try {
            let newPinned = [...pinnedPages];
            const index = newPinned.findIndex(p => p.id === page.id);
            if (index > -1) {
                newPinned.splice(index, 1);
            } else {
                newPinned = [page, ...newPinned];
            }
            setPinnedPages(newPinned);
            await AsyncStorage.setItem('pinnedPages', JSON.stringify(newPinned));
        } catch (error) {
            console.error('Error toggling pin:', error);
        }
    };

    const isPinned = (id: string) => pinnedPages.some(p => p.id === id);

    const switchRole = (newRole: UserRole) => {
        setRole(newRole);
    };

    return (
        <UserContext.Provider value={{
            role,
            userName,
            email,
            phone,
            location,
            isVerified,
            switchRole,
            updateProfile,
            pinnedPages,
            togglePinPage,
            isPinned
        }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
