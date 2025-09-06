// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },      // TEMP
  typescript: { ignoreBuildErrors: true },   // TEMP
}

export default nextConfig