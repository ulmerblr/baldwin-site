import type { Metadata } from 'next'
import { site } from '@/content/site'

const BASE = `https://www.${site.domain}`

/**
 * The canonical URL for a route.
 *
 * The home page declares a trailing slash, matching the existing live site;
 * every other route does not. Next's metadata layer normalizes the slash away,
 * which is why canonicals are emitted as an explicit <link> (see
 * CanonicalLink) rather than through `alternates.canonical`.
 */
export function canonicalUrl(path: string): string {
  return path === '/' ? `${BASE}/` : `${BASE}${path}`
}

/**
 * Per-page title and description.
 *
 * Titles from the copy already include the site name, so they are set as
 * `absolute` -- the layout's "%s | Baldwin Insurance Agency" template would
 * otherwise append it twice. OG and Twitter tags deliberately fall through to
 * the sitewide defaults in the root layout.
 */
export function pageMetadata({
  title,
  description,
}: {
  title: string
  description: string
}): Metadata {
  return {
    title: { absolute: title },
    description,
  }
}
