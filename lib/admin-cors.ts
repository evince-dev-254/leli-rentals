import { NextRequest, NextResponse } from 'next/server'

/**
 * Get the allowed origin for CORS requests
 * Allows requests from admin dashboard subdomain and main domain (www.leli.rentals)
 */
function getAllowedOrigin(req: NextRequest): string | null {
  const origin = req.headers.get('origin')
  const adminDashboardUrl = process.env.NEXT_PUBLIC_ADMIN_DASHBOARD_URL || 'http://localhost:3001'
  const mainSiteUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  
  // Production domains - comprehensive list including www.leli.rentals
  const productionDomains = [
    'https://www.leli.rentals',
    'https://leli.rentals',
    'http://www.leli.rentals',
    'http://leli.rentals',
    'https://admin.leli.rentals',
    'http://admin.leli.rentals',
    // Support with and without www prefix
    'www.leli.rentals',
    'leli.rentals',
    'admin.leli.rentals'
  ]
  
  // Check if origin matches any production domain (with protocol)
  if (origin && productionDomains.some(domain => {
    return origin === `https://${domain}` || 
           origin === `http://${domain}` ||
           origin.includes(domain) ||
           origin.startsWith(`https://${domain}/`) ||
           origin.startsWith(`http://${domain}/`)
  })) {
    return origin
  }
  
  // Allow requests from admin dashboard
  if (origin === adminDashboardUrl || origin?.includes('admin.leli.rentals')) {
    return origin
  }
  
  // Allow same-origin requests from main site (www.leli.rentals)
  if (origin === mainSiteUrl || 
      origin?.includes('www.leli.rentals') || 
      origin?.includes('leli.rentals')) {
    return origin
  }
  
  // For development, allow localhost
  if (origin?.includes('localhost') || origin?.includes('127.0.0.1')) {
    return origin
  }
  
  return null
}

/**
 * Add CORS headers to response
 */
export function addCorsHeaders(response: NextResponse, req: NextRequest): NextResponse {
  const allowedOrigin = getAllowedOrigin(req)
  
  if (allowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', allowedOrigin)
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.set('Access-Control-Max-Age', '86400') // 24 hours
  }
  
  return response
}

/**
 * Create OPTIONS response for CORS preflight
 */
export function createOptionsResponse(req: NextRequest): NextResponse {
  const allowedOrigin = getAllowedOrigin(req)
  
  if (!allowedOrigin) {
    return new NextResponse(null, { status: 403 })
  }
  
  const response = new NextResponse(null, { status: 200 })
  response.headers.set('Access-Control-Allow-Origin', allowedOrigin)
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Max-Age', '86400')
  
  return response
}

