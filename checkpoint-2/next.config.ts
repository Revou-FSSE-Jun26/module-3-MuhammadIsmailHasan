import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `cacheComponents` is deliberately disabled: it requires every dynamic API and
  // uncached fetch to sit behind a Suspense boundary, which conflicts with the
  // loading.tsx / error.tsx structure this project uses.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
