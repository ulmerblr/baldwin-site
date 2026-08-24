import { CanonicalLink } from './canonical-link'
import { LeadModalProvider } from './lead-modals'
import { SiteFooter } from './site-footer'
import { SiteHeader } from './site-header'

/**
 * Chrome shared by every marketing page: header, footer, canonical tag, and
 * the dialog provider -- so a Start Quote or Join Our Team button works from
 * any page, not just the home page.
 */
export function SiteShell({ path, children }: { path: string; children: React.ReactNode }) {
  return (
    <LeadModalProvider>
      <CanonicalLink path={path} />
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
    </LeadModalProvider>
  )
}
