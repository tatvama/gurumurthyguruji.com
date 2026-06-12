import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: ["192.168.50.75"],
  async redirects() {
    return [
      // /admin → /en/admin
      {
        source: "/admin",
        destination: "/en/admin",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
