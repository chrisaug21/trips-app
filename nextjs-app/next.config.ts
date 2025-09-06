// next.config.ts
import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, '..'),
  eslint: { ignoreDuringBuilds: true },      // TEMP
  typescript: { ignoreBuildErrors: true },   // TEMP
}

export default nextConfig
