import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone', // Enable standalone mode for Docker
  
  // Optimize for production
  reactStrictMode: true,
  
  // Disable telemetry
  typescript: {
    // Set to true to ignore TypeScript errors during build (not recommended for production)
    ignoreBuildErrors: false,
  },
  
  eslint: {
    // Set to true to ignore ESLint errors during build (not recommended for production)
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
