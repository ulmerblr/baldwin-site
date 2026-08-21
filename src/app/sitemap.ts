import type { MetadataRoute } from 'next'
import { site } from '@/content/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = `https://www.${site.domain}`
  return [
    { url: base, changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/privacy`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/terms`, changeFrequency: 'yearly', priority: 0.2 },
  ]
}
