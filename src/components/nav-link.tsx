'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

/** A link that knows whether it points at the page you are already on. */
export function NavLink({
  href,
  children,
  className = '',
  currentClassName = '',
}: {
  href: string
  children: React.ReactNode
  className?: string
  currentClassName?: string
}) {
  const pathname = usePathname()
  const current = pathname === href

  return (
    <Link
      href={href}
      aria-current={current ? 'page' : undefined}
      className={`${className} ${current ? currentClassName : ''}`}
    >
      {children}
    </Link>
  )
}
