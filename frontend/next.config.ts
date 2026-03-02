import type { NextConfig } from "next";

const replitDomains = process.env.REPLIT_DOMAINS
  ? process.env.REPLIT_DOMAINS.split(",")
  : [];

const nextConfig: NextConfig = {
  allowedDevOrigins: ["localhost", "127.0.0.1", ...replitDomains],
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3001/api/:path*",
      },
    ];
  },
};

export default nextConfig;
