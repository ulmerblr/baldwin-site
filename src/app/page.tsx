import { LeadModalProvider } from '@/components/lead-modals'
import {
  About,
  Hero,
  HowItWorks,
  Products,
  Recruiting,
  SiteFooter,
  SiteHeader,
} from '@/components/sections'

export default function HomePage() {
  return (
    <LeadModalProvider>
      <SiteHeader />
      <main id="main">
        <Hero />
        <Products />
        <About />
        <HowItWorks />
        <Recruiting />
      </main>
      <SiteFooter />
    </LeadModalProvider>
  )
}
