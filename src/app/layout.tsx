import type { Metadata, Viewport } from 'next'
import { site } from '@/content/site'
import './globals.css'

const title = `${site.name} | Life Insurance & Retirement Planning`
const description =
  'Independent life insurance, annuities and retirement planning for families in California and Texas. 25+ years of straight answers from Chris Baldwin. Get a free, no-obligation quote.'

export const metadata: Metadata = {
  metadataBase: new URL(`https://www.${site.domain}`),
  title: {
    default: title,
    template: `%s | ${site.name}`,
  },
  description,
  keywords: [
    'life insurance',
    'indexed universal life',
    'mortgage protection',
    'final expense insurance',
    'annuities',
    'retirement rollover',
    'estate planning',
    'California life insurance',
    'Texas life insurance',
  ],
  authors: [{ name: site.name }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: site.name,
    title,
    description,
    url: '/',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
  // Geo targeting carried over from the existing site.
  other: {
    'geo.region': 'US-CA, US-TX',
    'geo.placename': 'California, Texas',
    'og:locality': 'California, Texas',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a1628',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a
          href="#main"
          className="sr-only rounded-md focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-gold-500 focus:px-4 focus:py-2 focus:font-semibold focus:text-navy-950"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  )
}
