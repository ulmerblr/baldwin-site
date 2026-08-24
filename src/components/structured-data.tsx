import { site } from '@/content/site'
import { canonicalUrl } from '@/lib/seo'

/**
 * InsuranceAgency markup for the home page.
 *
 * Deliberately omits both the license fields and `areaServed`. Those values
 * are still unfilled (see the TK placeholders), and structured data is exactly
 * the wrong place to publish a guess about a regulated credential or about
 * where an agency operates: such a claim should be accurate or absent. Add
 * both once the real license numbers and state list exist.
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
