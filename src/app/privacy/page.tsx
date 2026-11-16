import type { Metadata } from 'next'
import { LegalPage } from '../legal-page'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for Baldwin Life Insurance.',
  robots: { index: false, follow: true },
}

export default function Privacy() {
  return <LegalPage path="/privacy" title="Privacy Policy" />
}
