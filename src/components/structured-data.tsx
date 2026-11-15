import { site } from '@/content/site'
import { canonicalUrl } from '@/lib/seo'

/**
 * InsuranceAgency markup for the home page.
 *
 * The address and the area served are now real values supplied by the agency,
 * so they are published. `areaServed` is the United States because the agency
 * states it is licensed in all fifty.
 *
 * Still no licence field. Schema.org has no agreed property for an insurance
 * producer licence, and structured data is the wrong place to improvise one
 * about a regulated credential -- the number is on the page, in text, where a
 * person and a regulator can both read it.
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
    address: {
      '@type': 'PostalAddress',
      streetAddress: '276 Carlsbad Village Drive, Unit A',
      addressLocality: 'Carlsbad',
      addressRegion: 'CA',
      postalCode: '92008',
      addressCountry: 'US',
    },
    areaServed: { '@type': 'Country', name: 'United States' },
  }

  return (
    <script
      type="application/ld+json"
      // Serialized from a literal above; no user input reaches this.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
