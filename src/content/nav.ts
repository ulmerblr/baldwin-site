/**
 * Site navigation. Header and footer render the same tree, so they cannot
 * drift apart.
 *
 * The Products entry has both an `href` and `children`: the parent is a real
 * link to the overview page, never a dead `#` that swallows a tap on a touch
 * device. The dropdown is additive.
 */

import { products } from './products'

export type NavItem = {
  label: string
  href: string
  children?: readonly NavItem[]
}

export const nav: readonly NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  {
    label: 'Products',
    href: '/products',
    children: [
      { label: 'All Products', href: '/products' },
      ...products.map((product) => ({ label: product.navLabel, href: product.href })),
    ],
  },
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
  /** Accessible name for the dropdown toggle that sits beside the parent link. */
  submenu: (label: string) => `${label} submenu`,
  sections: 'Sections',
  legal: 'Legal',
} as const
