import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Transpile react-d3-graph for better compatibility
  transpilePackages: ['react-d3-graph'],
  // Turbopack works well with most apps without special webpack config
  // If you need webpack fallbacks, you may need to keep using webpack instead
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Provide polyfills for browser APIs used by pdfjs-dist in Node.js
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
      };
    }
    return config;
  },
};

export default nextConfig;
