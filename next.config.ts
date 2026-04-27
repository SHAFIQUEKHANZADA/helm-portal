import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "careers.coordinators.pro",
      },
    ],
  },
};

export default nextConfig;
