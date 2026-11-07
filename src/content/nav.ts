/**
 * Site navigation. Header and footer render the same tree, so they cannot
 * drift apart.
 *
 * Every entry is a plain link. Products was a dropdown over six product
 * pages; those are now one page, so it behaves exactly like About and Agent
 * Opportunity and `children` is gone.
 */

export type NavItem = {
  label: string
  href: string
}

export const nav: readonly NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Products', href: '/products' },
  { label: 'Agent Opportunity', href: '/agent-opportunity' },
  { label: 'Contact', href: '/contact' },
]

/** Footer-only links, kept out of the header. */
export const legalNav: readonly NavItem[] = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
]

export const navLabels = {
  menu: 'Menu',
  closeMenu: 'Close menu',
  sections: 'Sections',
  legal: 'Legal',
} as const
