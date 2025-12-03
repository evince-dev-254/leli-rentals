'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useRef } from 'react'

export function UserSyncer() {
    const { user, isLoaded } = useUser()
    const syncedRef = useRef(false)

    useEffect(() => {
        if (isLoaded && user && !syncedRef.current) {
            // Prevent double sync in strict mode or rapid re-renders
            syncedRef.current = true

            // Check session storage to avoid syncing on every page navigation if already done this session
            const sessionKey = `leli_synced_${user.id}`
            if (sessionStorage.getItem(sessionKey)) {
                return
            }

            fetch('/api/auth/sync', { method: 'POST' })
                .then((res) => {
                    if (res.ok) {
                        sessionStorage.setItem(sessionKey, 'true')
                        console.log('User synced with database')
                    }
                })
                .catch((err) => console.error('Sync failed:', err))
        }
    }, [user, isLoaded])

    return null
}
