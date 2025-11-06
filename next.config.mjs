/** @type {import('next').NextConfig} */
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    // Remove turbopack config as it's enabled by default in Next.js 16
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
