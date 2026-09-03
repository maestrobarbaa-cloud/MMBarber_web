import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
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
    qualities: [60, 65, 75, 80, 85, 90, 95, 100],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com/gsi/client https://www.googletagmanager.com; frame-src 'self' https://accounts.google.com/gsi/ https://calendar.google.com; connect-src 'self' https://accounts.google.com/gsi/ https://*.google-analytics.com; font-src 'self' https://fonts.gstatic.com;"
          }
        ]
      }
    ];
  },
  async redirects() {
    return [
      {
        source: '/barbershop-zlin',
        destination: '/',
        permanent: true,
      },
      {
        source: '/faq',
        destination: '/',
        permanent: true,
      },
      {
        source: '/region-slovacko',
        destination: '/',
        permanent: true,
      },
      {
        source: '/specialni-mise',
        destination: '/',
        permanent: true,
      },
      {
        source: '/fade-gallery',
        destination: '/',
        permanent: true,
      }
    ];
  },
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
};

export default nextConfig;
