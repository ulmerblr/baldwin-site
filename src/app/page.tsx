import { SiteShell } from '@/components/site-shell'
import { StructuredData } from '@/components/structured-data'
import {
  About,
  AgentOpportunity,
  Hero,
  HowItWorks,
  ServiceAreas,
  Services,
  Testimonials,
} from '@/components/sections'

export default function HomePage() {
  return (
    <SiteShell path="/">
      <StructuredData />
      <Hero />
      <Services />
      <About />
      <HowItWorks />
      <Testimonials />
      <ServiceAreas />
      <AgentOpportunity />
    </SiteShell>
  )
}
