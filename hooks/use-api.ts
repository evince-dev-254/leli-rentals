// hooks/use-api.ts
// React hook for making authenticated API calls

'use client';

import { useAuth } from '@clerk/nextjs';
import { apiClient, ApiResponse } from '@/lib/api-client';
import { useState, useCallback } from 'react';

export function useApi() {
    const { getToken } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Make an API call with automatic authentication
     */
    const callApi = useCallback(
        async <T,>(
            method: 'get' | 'post' | 'put' | 'delete' | 'patch',
            endpoint: string,
            data?: any
        ): Promise<ApiResponse<T>> => {
            setLoading(true);
            setError(null);

            try {
                // Get authentication token from Clerk
                const token = await getToken();

                if (!token) {
                    throw new Error('Not authenticated');
                }

                let result: ApiResponse<T>;

                // Call appropriate method
                switch (method) {
                    case 'get':
                        result = await apiClient.get<T>(endpoint, token);
                        break;
                    case 'post':
                        result = await apiClient.post<T>(endpoint, data, token);
                        break;
                    case 'put':
                        result = await apiClient.put<T>(endpoint, data, token);
                        break;
                    case 'delete':
                        result = await apiClient.delete<T>(endpoint, token);
                        break;
                    case 'patch':
                        result = await apiClient.patch<T>(endpoint, data, token);
                        break;
                }

                if (!result.success) {
                    setError(result.error || 'Request failed');
                }

                return result;
            } catch (err: any) {
                const errorMessage = err.message || 'An error occurred';
                setError(errorMessage);
                console.error('API Error:', err);
                return {
                    success: false,
                    error: errorMessage
                };
            } finally {
                setLoading(false);
            }
        },
        [getToken]
    );

    /**
     * Clear error state
     */
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        callApi,
        loading,
        error,
        clearError
    };
}
