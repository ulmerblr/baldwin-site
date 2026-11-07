import { SiteShell } from '@/components/site-shell'
import { StructuredData } from '@/components/structured-data'
import { ChrisCard, Hero, Services, Testimonials } from '@/components/sections'

/**
 * Home page.
 *
 * Anything with a page of its own no longer appears here as well: the About
 * band and the agent recruiting block both live at /about and
 * /agent-opportunity, one click away in the nav. How It Works and the
 * "Wherever You Are" band are gone outright.
 *
 * The six product cards are the deliberate exception -- they are how someone
 * landing cold sees what the agency actually sells -- and now link into the
 * single products page.
 */
export default function HomePage() {
  return (
    <SiteShell path="/">
      <StructuredData />
      <Hero />
      <ChrisCard />
      <Services />
      <Testimonials />
    </SiteShell>
  )
}
