import type { Metadata, Viewport } from 'next'
import { Inter, Source_Serif_4 } from 'next/font/google'
import { site } from '@/content/site'
import './globals.css'

/*
 * Two families, deliberately.
 *
 * Source Serif 4 for display: a transitional serif drawn for screen, with
 * real optical sizing. It carries the "established agency, not a template"
 * signal that the dark ground used to carry.
 *
 * Inter for body: a neutral grotesque that holds up at small sizes, where
 * most of this site's words live. Tracking is tightened at display sizes in
 * the components so it never reads as a default stack.
 *
 * Both are self-hosted by next/font -- no runtime request to Google.
 */
const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-source-serif',
  weight: ['400', '600', '700'],
})

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

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
  themeColor: '#faf9f6',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sourceSerif.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only rounded-md focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-gold-bright focus:px-4 focus:py-2 focus:font-semibold focus:text-ink"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  )
}
