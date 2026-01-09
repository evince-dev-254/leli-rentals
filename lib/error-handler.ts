/**
 * Centralized error handler for Server Actions
 * This utility parses database and system errors into user-friendly messages
 * to avoid leaking sensitive information (like PostgreSQL error codes) to the client.
 */

export type ActionResponse<T = any> = {
    success: boolean;
    data?: T;
    error?: string;
    details?: string;
};

export function handleServerError(error: any, customMessage?: string): ActionResponse {
    console.error(`[Error Handler] ${customMessage || 'An error occurred'}:`, error);

    let message = customMessage || "An unexpected error occurred. Please try again later.";
    let details = "";

    if (typeof error === 'string') {
        message = error;
    } else if (error instanceof Error) {
        // Handle common database errors if they are exposed
        const originalMessage = error.message.toLowerCase();

        if (originalMessage.includes('unique constraint') || originalMessage.includes('already exists')) {
            message = "A record with this information already exists.";
        } else if (originalMessage.includes('foreign key constraint')) {
            message = "This action cannot be completed because it depends on other records.";
        } else if (originalMessage.includes('not found') || originalMessage.includes('pgrst116')) {
            message = "The requested record was not found.";
        } else if (originalMessage.includes('permission denied') || originalMessage.includes('insufficient privilege')) {
            message = "You don't have permission to perform this action.";
        } else if (originalMessage.includes('jwt expired') || originalMessage.includes('invalid ticket')) {
            message = "Your session has expired. Please log in again.";
        } else if (process.env.NODE_ENV === 'development') {
            // Only show detailed errors in development
            details = error.message;
        }
    } else if (error && typeof error === 'object') {
        // Handle Supabase error objects
        if (error.code === '23505') {
            message = "This information is already in use.";
        } else if (error.code === 'PGRST116') {
            message = "No record found.";
        } else if (error.message) {
            if (process.env.NODE_ENV === 'development') {
                details = error.message;
            }
        }
    }

    return {
        success: false,
        error: message,
        details: details || undefined
    };
}
