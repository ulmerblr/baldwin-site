import { canonicalUrl } from '@/lib/seo'

/** React hoists this into <head>. One per page, emitted by SiteShell. */
export function CanonicalLink({ path }: { path: string }) {
  return <link rel="canonical" href={canonicalUrl(path)} />
}
