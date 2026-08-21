import type { Metadata } from 'next'
import { LegalPage } from '../legal-page'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for Baldwin Insurance Agency.',
  robots: { index: false, follow: true },
}

export default function Privacy() {
  return <LegalPage title="Privacy Policy" />
}
