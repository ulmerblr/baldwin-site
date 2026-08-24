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
        className="rounded text-sm font-medium text-gold-deep underline-offset-4 transition-colors hover:text-ink hover:underline"
      >
        &larr; Back to home
      </Link>

      <h1 className="font-display mt-8 text-3xl font-semibold leading-[1.12] tracking-[-0.015em] text-ink sm:text-4xl">{title}</h1>

      <p className="mt-6 leading-relaxed text-body">{site.legal.pendingNotice}</p>

      <div className="mt-10 rounded-2xl border border-line bg-surface p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gold-deep">Contact</h2>
        <ul className="mt-4 space-y-2 text-sm">
          <li>
            <a
              href={site.contact.emailHref}
              className="rounded break-words text-body transition-colors hover:text-gold-deep"
            >
              {site.contact.email}
            </a>
          </li>
          <li>
            <a
              href={site.contact.phoneHref}
              className="rounded text-body transition-colors hover:text-gold-deep"
            >
              {site.contact.phone}
            </a>
          </li>
          <li className="text-muted">{site.contact.hours}</li>
        </ul>
      </div>
    </main>
  )
}
