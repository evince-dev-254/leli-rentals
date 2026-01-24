"use client"

import { useEffect } from "react"

export function ConsoleWarning() {
    useEffect(() => {
        // Styling for the warning matches standard security warnings (like Facebook/Discord)
        setTimeout(() => {
            console.log(
                "%cStop!",
                "color: red; font-size: 60px; font-weight: bold; text-shadow: 2px 2px 0px black;"
            )
            console.log(
                "%cUsing this console may allow attackers to impersonate you and steal your information using an attack called Self-XSS.\n\n%cDo not enter or paste code that you do not understand.",
                "font-size: 18px; color: #333; font-family: sans-serif;",
                "font-size: 20px; font-weight: bold; color: red; font-family: sans-serif;"
            )
        }, 1000) // Small delay to ensure it appears after other logs
    }, [])

    return null
}
