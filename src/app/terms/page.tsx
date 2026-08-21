import type { Metadata } from 'next'
import { LegalPage } from '../legal-page'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for Baldwin Insurance Agency.',
  robots: { index: false, follow: true },
}

export default function Terms() {
  return <LegalPage title="Terms of Service" />
}
