'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, onAuthStateChanged } from 'firebase/auth'
import { auth, db } from './firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isNewUser: boolean
  userProfile: any
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isNewUser: false,
  userProfile: null
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isNewUser, setIsNewUser] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)

  // Initialize user from localStorage for persistence across tabs
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          // Create a minimal user object for initial state
          setUser({
            uid: userData.uid,
            email: userData.email,
            displayName: userData.displayName,
            photoURL: userData.photoURL
          } as User)
        } catch (error) {
          console.error('Error parsing stored user:', error)
          localStorage.removeItem('user')
        }
      }
    }
  }, [])

  useEffect(() => {
    // Check if auth is available before setting up listener
    if (!auth) {
      console.warn('Firebase auth not initialized yet');
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      
      if (user) {
        try {
          // Check if user profile exists in Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid))
          
          if (userDoc.exists()) {
            // Existing user - load their profile
            const userData = userDoc.data()
            setUserProfile(userData)
            setIsNewUser(false)
            
            // Store user in localStorage for persistence across tabs
            if (typeof window !== 'undefined') {
              localStorage.setItem('user', JSON.stringify({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                accountType: userData.accountType || 'renter',
                isNewUser: false
              }))
            }
          } else {
            // New user - create basic profile and mark as new
            const newUserData = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              createdAt: new Date(),
              isNewUser: true,
              accountType: null, // Will be set during onboarding
              isVerified: false,
              lastActive: new Date()
            }
            
            try {
              await setDoc(doc(db, 'users', user.uid), newUserData)
              setUserProfile(newUserData)
              setIsNewUser(true)
            } catch (error) {
              console.error('Error creating user profile:', error)
              // Still set the user as new even if Firestore write fails
              setUserProfile(newUserData)
              setIsNewUser(true)
            }
            
            // Store user in localStorage for persistence across tabs
            if (typeof window !== 'undefined') {
              localStorage.setItem('user', JSON.stringify({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                isNewUser: true
              }))
            }
          }
        } catch (error) {
          console.error('Error checking user profile:', error)
          setIsNewUser(false)
        }
      } else {
        // User logged out
        setUserProfile(null)
        setIsNewUser(false)
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user')
        }
      }
      
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [auth])

  return (
    <AuthContext.Provider value={{ user, isLoading, isNewUser, userProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
