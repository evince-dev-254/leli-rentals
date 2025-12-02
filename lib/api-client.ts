// lib/api-client.ts
// Frontend API client for communicating with Express backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    /**
     * Generic request method
     */
    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const url = `${this.baseUrl}${endpoint}`;

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: data.error || 'Request failed'
                };
            }

            return data;
        } catch (error: any) {
            console.error('API request error:', error);
            return {
                success: false,
                error: error.message || 'Network error'
            };
        }
    }

    /**
     * GET request
     */
    async get<T>(endpoint: string, token?: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'GET',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
    }

    /**
     * POST request
     */
    async post<T>(
        endpoint: string,
        data: any,
        token?: string
    ): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'POST',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: JSON.stringify(data),
        });
    }

    /**
     * PUT request
     */
    async put<T>(
        endpoint: string,
        data: any,
        token?: string
    ): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: JSON.stringify(data),
        });
    }

    /**
     * DELETE request
     */
    async delete<T>(endpoint: string, token?: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'DELETE',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
    }

    /**
     * PATCH request
     */
    async patch<T>(
        endpoint: string,
        data: any,
        token?: string
    ): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'PATCH',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: JSON.stringify(data),
        });
    }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export types
export type { ApiResponse };
