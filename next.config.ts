import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // All imagery is a local static asset; no remote loader, no runtime optimizer.
  images: { unoptimized: true },
  /**
   * The six product pages collapsed into /products. Every /products/<slug>
   * redirects there: the two renamed slugs, the four unchanged ones, and
   * anything already bookmarked or indexed. Permanent, so search engines
   * move their weight to /products rather than keep the dead URLs.
   */
  async redirects() {
    return [{ source: '/products/:slug', destination: '/products', permanent: true }]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
        ],
      },
    ]
  },
}

export default nextConfig
