"use client"

import { useState, useEffect } from "react"
import Script from "next/script"

export function ConsentManager() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <>
            <Script
                id="cmp-config"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
            window.cmp_id = 96403;
            window.cmp_host = "delivery.consentmanager.net";
            window.cmp_cdn = "cdn.consentmanager.net";
            window.cmp_proto = "https:";
            window.gdprAppliesGlobally = true;
          `
                }}
            />
            <Script
                id="cmp-script"
                strategy="afterInteractive"
                src="https://cdn.consentmanager.net/delivery/cmp.min.js"
            />
            {/* Auto-blocking disabled to allow Unsplash/Supabase images to load. 
                Trackers (GA, Tawk) are manually blocked in layout.tsx using type="text/plain" 
            */}
            {/* <Script
                id="cmp-autoblocking"
                strategy="afterInteractive"
                src="https://cdn.consentmanager.net/delivery/autoblocking/96403.js"
            /> */ }
        </>
    )
}
