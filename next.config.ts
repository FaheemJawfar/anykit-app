import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.anykit.app" }],
        destination: "https://anykit.app/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
