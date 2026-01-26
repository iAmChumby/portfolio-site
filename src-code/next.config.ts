import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }
    // Ensure D3 modules are resolved correctly
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    return config;
  },
  // Transpile react-d3-graph for better compatibility
  transpilePackages: ['react-d3-graph'],
};

export default nextConfig;
