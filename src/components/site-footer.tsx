import { legalNav, nav, navLabels } from '@/content/nav'
import { compliance } from '@/content/pages'
import { site } from '@/content/site'
import { BrandMark } from './brand-mark'
import { CurrentYear } from './current-year'
import { LicenseLine } from './license-line'
import { NavLink } from './nav-link'
import { Copy } from './tk'

const FOOTER_LINK = 'rounded text-body transition-colors hover:text-gold-deep'

export function SiteFooter() {
  return (
    <footer id="contact-details" className="border-t border-line py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <BrandMark />
              <span className="font-bold text-ink">{site.name}</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              {site.footer.blurb}
            </p>
          </div>

          {/* Mirrors the header, so every page is reachable from the bottom of
              any page without scrolling back up. */}
          <nav aria-label="Footer">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gold-deep">
              {navLabels.sections}
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {nav.map((item) => (
                <li key={item.href}>
                  <NavLink href={item.href} className={FOOTER_LINK} currentClassName="text-gold-deep">
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gold-deep">
              {site.footer.contactLabel}
            </h2>
            {/* text-sm sizes the whole column, so the licence under the
                phone number is the same size as it without being told to. */}
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <span className="block text-muted">{site.contact.phoneLabel}</span>
                <a href={site.contact.phoneHref} className={FOOTER_LINK}>
                  {site.contact.phone}
                </a>
                <LicenseLine className="mt-1 block text-muted" />
              </li>
              <li>
                <span className="block text-muted">{site.contact.emailLabel}</span>
                <a href={site.contact.emailHref} className={`${FOOTER_LINK} break-words`}>
                  {site.contact.email}
                </a>
              </li>
              <li>
                <span className="block text-muted">{site.contact.hoursLabel}</span>
                <span className="text-body">{site.contact.hours}</span>
              </li>
              {/* The public address, at the bottom of every page that has a
                  footer. <address> rather than <p>: this is the contact
                  address for the business the page belongs to. */}
              <li>
                <span className="block text-muted">{site.contact.addressLabel}</span>
                <address className="not-italic text-body">{site.contact.address}</address>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gold-deep">
              {site.footer.legalLabel}
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {legalNav.map((item) => (
                <li key={item.href}>
                  <NavLink href={item.href} className={FOOTER_LINK} currentClassName="text-gold-deep">
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 space-y-4 border-t border-line pt-8">
          <p className="text-xs leading-relaxed text-muted">
            <Copy text={compliance} />
          </p>
          <p className="text-xs text-muted">
            &copy; <CurrentYear buildYear={new Date().getFullYear()} /> {site.legalName}. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
