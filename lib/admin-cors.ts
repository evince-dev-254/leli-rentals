import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Get the admin dashboard URL from environment variables
 */
export function getAdminDashboardUrl(): string {
  return process.env.NEXT_PUBLIC_ADMIN_DASHBOARD_URL || 
         process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
         'http://localhost:3001'
}

/**
 * Add CORS headers to admin API responses
 */
export function addCorsHeaders(response: NextResponse, request: NextRequest): NextResponse {
  const origin = request.headers.get('origin')
  const adminDashboardUrl = getAdminDashboardUrl()
  
  // Allow requests from admin dashboard subdomain
  const allowedOrigins = [
    adminDashboardUrl,
    adminDashboardUrl.replace('https://', 'http://'), // HTTP for local dev
    'http://localhost:3001',
    'http://localhost:3000',
  ]
  
  // Check if origin is allowed
  const isAllowedOrigin = origin && allowedOrigins.some(allowed => {
    try {
      const allowedUrl = new URL(allowed)
      const originUrl = new URL(origin)
      return originUrl.hostname === allowedUrl.hostname || origin === allowed
    } catch {
      return origin === allowed || origin.includes(allowed.replace('https://', '').replace('http://', ''))
    }
  })
  
  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Credentials', 'true')
  }
  
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
  response.headers.set('Access-Control-Max-Age', '86400')
  
  return response
}

/**
 * Create OPTIONS response for preflight requests
 */
export function createOptionsResponse(request: NextRequest): NextResponse {
  const response = new NextResponse(null, { status: 204 })
  return addCorsHeaders(response, request)
}

