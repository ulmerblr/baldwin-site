import type { Metadata, Viewport } from 'next'
import { site } from '@/content/site'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(site.canonical),
  title: {
    default: site.meta.title,
    template: `%s | ${site.name}`,
  },
  description: site.meta.description,
  // Joined by hand: Next joins an array with a bare comma, and the live site
  // separates keywords with a comma AND a space.
  keywords: site.meta.keywords.join(', '),
  authors: [{ name: site.meta.author }],
  // NOTE: no `alternates.canonical` here. Next normalizes the trailing slash
  // off the URL, and the live site declares it on the home page. Each page
  // emits its own canonical explicitly instead -- see src/lib/seo.ts.
  openGraph: {
    type: 'website',
    siteName: site.name,
    title: site.meta.socialTitle,
    description: site.meta.socialDescription,
    url: '/',
    locale: 'en_US',
    // NOTE: the live site's OG image is `/images/image-3.jpg`. That file is not
    // in this repo yet (see public/images/README.md), so the image tag is
    // omitted rather than pointing crawlers at a 404. Once the file is added,
    // restore it here and on `twitter` below:
    //   images: [{ url: site.meta.socialImage, width: 1200, height: 630, alt: site.about.image.alt }],
  },
  twitter: {
    card: 'summary_large_image',
    title: site.meta.socialTitle,
    description: site.meta.socialDescription,
    // images: [site.meta.socialImage],  <- restore with the file, as above
  },
  robots: {
    index: true,
    follow: true,
  },
  // No geo.* tags. They are a machine-readable claim about where the agency
  // operates, the same kind of assertion as schema.org areaServed, and are
  // left out for the same reason: accurate or absent. Restore them from the
  // real state list once it exists.
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
