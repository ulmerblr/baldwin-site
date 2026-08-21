import { LeadModalProvider } from '@/components/lead-modals'
import {
  About,
  AgentOpportunity,
  Hero,
  HowItWorks,
  Services,
  SiteFooter,
  SiteHeader,
} from '@/components/sections'

export default function HomePage() {
  return (
    <LeadModalProvider>
      <SiteHeader />
      <main id="main">
        <Hero />
        <Services />
        <About />
        <HowItWorks />
        <AgentOpportunity />
      </main>
      <SiteFooter />
    </LeadModalProvider>
  )
}
