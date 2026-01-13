export interface TurnstileValidationResponse {
    success: boolean;
    challenge_ts?: string;
    hostname?: string;
    "error-codes"?: string[];
    action?: string;
    cdata?: string;
    metadata?: {
        ephemeral_id: string;
    };
    error?: string; // For internal errors
}

export interface ValidationOptions {
    expectedAction?: string;
    expectedHostname?: string;
    idempotencyKey?: string;
}

export class TurnstileValidator {
    private secretKey: string;
    private timeout: number;

    constructor(secretKey: string, timeout = 10000) {
        this.secretKey = secretKey;
        this.timeout = timeout;
    }

    async validate(
        token: string,
        remoteip?: string,
        options: ValidationOptions = {}
    ): Promise<TurnstileValidationResponse> {
        // Input validation
        if (!token || typeof token !== "string") {
            return { success: false, error: "Invalid token format" };
        }

        if (token.length > 2048) {
            return { success: false, error: "Token too long" };
        }

        // Prepare request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const formData = new FormData();
            formData.append("secret", this.secretKey);
            formData.append("response", token);

            if (remoteip && remoteip !== 'unknown') {
                formData.append("remoteip", remoteip);
            }

            if (options.idempotencyKey) {
                formData.append("idempotency_key", options.idempotencyKey);
            }

            const response = await fetch(
                "https://challenges.cloudflare.com/turnstile/v0/siteverify",
                {
                    method: "POST",
                    body: formData,
                    signal: controller.signal,
                }
            );

            const result: TurnstileValidationResponse = await response.json();

            // Additional validation
            if (result.success) {
                if (
                    options.expectedAction &&
                    result.action !== options.expectedAction
                ) {
                    return {
                        success: false,
                        error: "Action mismatch",
                        action: result.action,
                    };
                }

                if (
                    options.expectedHostname &&
                    result.hostname !== options.expectedHostname
                ) {
                    return {
                        success: false,
                        error: "Hostname mismatch",
                        hostname: result.hostname,
                    };
                }
            }

            return result;
        } catch (error: any) {
            if (error.name === "AbortError") {
                return { success: false, error: "Validation timeout" };
            }

            console.error("Turnstile validation error:", error);
            return { success: false, error: "Internal error" };
        } finally {
            clearTimeout(timeoutId);
        }
    }
}

// Export a default instance
// Use production secret key ONLY if provided and environment is truly production
// Note: We can't easily detect Vercel Preview vs Production here on the server side without checking VERCEL_ENV
// So we rely on VERCEL_ENV if available, or NODE_ENV.
const isProduction = process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV === 'production';

const SECRET_KEY = isProduction && process.env.TURNSTILE_SECRET_KEY
    ? process.env.TURNSTILE_SECRET_KEY
    : '1x0000000000000000000000000000000AA';

export const turnstileValidator = new TurnstileValidator(SECRET_KEY);
