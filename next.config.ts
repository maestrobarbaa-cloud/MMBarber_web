import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'www.google.com',
      },
      {
        protocol: 'https',
        hostname: 'www.seznam.cz',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      }
    ],
    qualities: [60, 75, 85, 90, 100],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy-Report-Only',
            value: "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com/gsi/client https://www.googletagmanager.com; frame-src 'self' https://accounts.google.com/gsi/ https://calendar.google.com; connect-src 'self' https://accounts.google.com/gsi/ https://*.google-analytics.com; font-src 'self' https://fonts.gstatic.com;"
          }
        ]
      }
    ];
  },
};

export default nextConfig;
