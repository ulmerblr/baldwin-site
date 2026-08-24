import { legalNav, nav, navLabels } from '@/content/nav'
import { compliance } from '@/content/pages'
import { site } from '@/content/site'
import { BrandMark } from './brand-mark'
import { CurrentYear } from './current-year'
import { NavLink } from './nav-link'
import { Copy } from './tk'

const FOOTER_LINK = 'rounded text-ink-300 transition-colors hover:text-gold-300'

export function SiteFooter() {
  return (
    <footer id="contact-details" className="border-t border-navy-800 py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <BrandMark />
              <span className="font-bold text-ink-100">{site.name}</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-400">
              {site.footer.blurb}
            </p>
          </div>

          {/* Mirrors the header, so every page is reachable from the bottom of
              any page without scrolling back up. */}
          <nav aria-label="Footer">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gold-400">
              {navLabels.sections}
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {nav.map((item) => (
                <li key={item.href}>
                  <NavLink href={item.href} className={FOOTER_LINK} currentClassName="text-gold-300">
                    {item.label}
                  </NavLink>
                  {item.children && (
                    <ul className="mt-2 space-y-2 border-l border-navy-800 pl-3">
                      {item.children
                        // The overview page is already the parent link above.
                        .filter((child) => child.href !== item.href)
                        .map((child) => (
                          <li key={child.href}>
                            <NavLink
                              href={child.href}
                              className={`${FOOTER_LINK} text-ink-400`}
                              currentClassName="text-gold-300"
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
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gold-400">
              {site.footer.contactLabel}
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <span className="block text-ink-400">{site.contact.phoneLabel}</span>
                <a href={site.contact.phoneHref} className={FOOTER_LINK}>
                  {site.contact.phone}
                </a>
              </li>
              <li>
                <span className="block text-ink-400">{site.contact.emailLabel}</span>
                <a href={site.contact.emailHref} className={`${FOOTER_LINK} break-words`}>
                  {site.contact.email}
                </a>
              </li>
              <li>
                <span className="block text-ink-400">{site.contact.hoursLabel}</span>
                <span className="text-ink-300">{site.contact.hours}</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gold-400">
              {site.footer.legalLabel}
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {legalNav.map((item) => (
                <li key={item.href}>
                  <NavLink href={item.href} className={FOOTER_LINK} currentClassName="text-gold-300">
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 space-y-4 border-t border-navy-800 pt-8">
          <p className="text-xs leading-relaxed text-ink-400">
            <Copy text={compliance} />
          </p>
          <p className="text-xs text-ink-400">
            &copy; <CurrentYear buildYear={new Date().getFullYear()} /> {site.legalName}. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
