import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "revoshop-apis.onrender.com" },
      { protocol: "http", hostname: "localhost", port: "5000" },
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
