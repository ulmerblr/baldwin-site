import Link from 'next/link'
import { CanonicalLink } from '@/components/canonical-link'
import { site } from '@/content/site'

/** Shared shell for the two legal routes. */
export function LegalPage({ title, path }: { title: string; path: string }) {
  return (
    <main id="main" className="mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-24">
      <CanonicalLink path={path} />
      <Link
        href="/"
        className="rounded text-sm font-medium text-gold-300 transition-colors hover:text-gold-400"
      >
        &larr; Back to home
      </Link>

      <h1 className="mt-8 text-3xl font-bold tracking-tight text-ink-100 sm:text-4xl">{title}</h1>

      <p className="mt-6 leading-relaxed text-ink-300">{site.legal.pendingNotice}</p>

      <div className="mt-10 rounded-2xl border border-navy-700 bg-navy-900/60 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gold-400">Contact</h2>
        <ul className="mt-4 space-y-2 text-sm">
          <li>
            <a
              href={site.contact.emailHref}
              className="rounded break-words text-ink-300 transition-colors hover:text-gold-300"
            >
              {site.contact.email}
            </a>
          </li>
          <li>
            <a
              href={site.contact.phoneHref}
              className="rounded text-ink-300 transition-colors hover:text-gold-300"
            >
              {site.contact.phone}
            </a>
          </li>
          <li className="text-ink-400">{site.contact.hours}</li>
        </ul>
      </div>
    </main>
  )
}
