// next.config.ts
import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  // keep/add other options here
  outputFileTracingRoot: path.join(__dirname, '..'),
}

export default nextConfig
