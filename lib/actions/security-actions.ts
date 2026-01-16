"use server"

import { turnstileValidator } from "@/lib/turnstile";
import { headers } from "next/headers";

/**
 * Server action to verify a Turnstile token.
 * Can be used by client components to verify a token before proceeding with sensitive actions.
 */
export async function verifyTurnstileToken(token: string, action?: string) {
    const headerList = await headers();
    const remoteip = headerList.get("x-forwarded-for") || headerList.get("x-real-ip") || undefined;

    // Bypass check: Environment Variable or Header
    // If NEXT_PUBLIC_DISABLE_TURNSTILE is true, or x-mobile-app header is present, skip verification
    const isBypassEnabled = process.env.NEXT_PUBLIC_DISABLE_TURNSTILE === 'true';
    const isMobileApp = headerList.get("x-mobile-app") === "leli-rentals-mobile";

    if (isBypassEnabled || isMobileApp) {
        return { success: true };
    }

    // Perform validation using the advanced validator
    const result = await turnstileValidator.validate(token, remoteip, {
        expectedAction: action,
        // You could also add expectedHostname: "leli.rentals" for production
    });

    if (!result.success) {
        console.warn(`[SECURITY] Turnstile validation failed: ${result.error || result["error-codes"]?.join(", ")}`);
    }

    return {
        success: result.success,
        error: result.error || (result["error-codes"]?.length ? result["error-codes"][0] : undefined),
        action: result.action,
    };
}
