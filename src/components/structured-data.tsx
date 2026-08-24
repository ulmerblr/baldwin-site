import { site } from '@/content/site'
import { canonicalUrl } from '@/lib/seo'

/**
 * InsuranceAgency markup for the home page.
 *
 * Deliberately omits any license or credential field: those values are still
 * unfilled (see the TK placeholders), and structured data is exactly
 * the wrong place to publish a guess about a regulated credential. Add them
 * here once real numbers exist.
 */
export function StructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'InsuranceAgency',
    name: site.legalName,
    url: canonicalUrl('/'),
    telephone: site.contact.phone,
    email: site.contact.email,
    description: site.meta.description,
    areaServed: [
      { '@type': 'State', name: 'California' },
      { '@type': 'State', name: 'Texas' },
    ],
    openingHours: 'Mo-Fr 09:00-17:00',
  }

  return (
    <script
      type="application/ld+json"
      // Serialized from a literal above; no user input reaches this.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
