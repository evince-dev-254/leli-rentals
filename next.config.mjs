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
    // NOTE: Turbopack experimental config removed to avoid invalid config warning.
    // If you need to enable Turbopack experiments, add valid keys here per Next.js docs.
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
