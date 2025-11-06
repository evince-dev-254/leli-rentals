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
<<<<<<< HEAD
    // NOTE: Turbopack experimental config removed to avoid invalid config warning.
    // If you need to enable Turbopack experiments, add valid keys here per Next.js docs.
=======
    turbopack: {
      root: __dirname,
    },
>>>>>>> 3d8eda87a4cf7f1e64fb62a98c6776c97b4964a1
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
