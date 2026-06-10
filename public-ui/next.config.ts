import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
