import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.nba.com' },
      { protocol: 'https', hostname: 'ak-static.cms.nba.com' },
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', 'framer-motion'],
  },
}

export default nextConfig
