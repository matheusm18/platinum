import type { NextConfig } from "next";

const r2Hostname = process.env.R2_PUBLIC_URL
  ? new URL(process.env.R2_PUBLIC_URL).hostname
  : null;

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
];

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    minimumCacheTTL: 2592000, // 30 days (game covers rarely change)
    formats: ["image/webp"],
    deviceSizes: [640, 1080, 1920],
    imageSizes: [32, 80, 150, 256],
    localPatterns: [
      { pathname: "/uploads/**" },
    ],
    remotePatterns: [
      { protocol: "https", hostname: "media.rawg.io" },
      ...(r2Hostname ? [{ protocol: "https" as const, hostname: r2Hostname }] : []),
    ],
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;