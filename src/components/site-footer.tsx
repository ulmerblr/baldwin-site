import { legalNav, nav, navLabels } from '@/content/nav'
import { compliance } from '@/content/pages'
import { site } from '@/content/site'
import { BrandMark } from './brand-mark'
import { CurrentYear } from './current-year'
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
                  {item.children && (
                    <ul className="mt-2 space-y-2 border-l border-line pl-3">
                      {item.children
                        // The overview page is already the parent link above.
                        .filter((child) => child.href !== item.href)
                        .map((child) => (
                          <li key={child.href}>
                            <NavLink
                              href={child.href}
                              className={`${FOOTER_LINK} text-muted`}
                              currentClassName="text-gold-deep"
                            >
                              {child.label}
                            </NavLink>
                          </li>
                        ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gold-deep">
              {site.footer.contactLabel}
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <span className="block text-muted">{site.contact.phoneLabel}</span>
                <a href={site.contact.phoneHref} className={FOOTER_LINK}>
                  {site.contact.phone}
                </a>
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
