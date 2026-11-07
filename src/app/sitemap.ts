import type { MetadataRoute } from 'next'
import { nav } from '@/content/nav'
import { canonicalUrl } from '@/lib/seo'

/**
 * Every public route. Built from the same nav the site renders from, so a new
 * page cannot be added without appearing here. The six product pages are gone
 * -- all six products live on /products.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const marketing = nav.map((item) => item.href)

  return [
    ...marketing.map((path) => ({
      url: canonicalUrl(path),
      changeFrequency: 'monthly' as const,
      priority: path === '/' ? 1 : 0.8,
    })),
    { url: canonicalUrl('/privacy'), changeFrequency: 'yearly' as const, priority: 0.2 },
    { url: canonicalUrl('/terms'), changeFrequency: 'yearly' as const, priority: 0.2 },
  ]
}
