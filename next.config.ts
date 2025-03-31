import type { NextConfig } from "next";

module.exports = {
  webpack: (config : NextConfig) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      encoding: false,
      path: false,
      crypto: false
    };
    return config;
  },
};

