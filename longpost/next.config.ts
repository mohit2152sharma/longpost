import type { NextConfig } from "next";
import path from "path";

export const isLocal = process.env.NODE_ENV === 'production'
const basePath = isLocal ? '/bsky-projects/longpost' : path.join(process.env.HOME as string, 'github', 'bsky-projects', 'longpost', 'out')

const nextConfig: NextConfig = {
  output: 'export',  // Enable static HTML export
  images: {
    unoptimized: true, // Required for static export
  },
  basePath: basePath, // Replace with your GitHub repo name
  assetPrefix: basePath + '/'
}

module.exports = nextConfig
