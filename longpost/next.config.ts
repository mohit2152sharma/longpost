import type { NextConfig } from "next";

export const isProd = process.env.NODE_ENV === 'production'
const images = { unoptimized: true }
let nextConfig: NextConfig

if (isProd) {
  nextConfig = {
    output: 'export',
    images: images,
    basePath: '/bsky-projects',
    assetPrefix: '/bsky-projects/'
  }
} else {
  nextConfig = {
    output: 'standalone',
  }
}

module.exports = nextConfig
