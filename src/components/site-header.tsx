'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { nav, navLabels, type NavItem } from '@/content/nav'
import { site } from '@/content/site'
import { BrandMark } from './brand-mark'
import { CtaButton } from './lead-modals'

export function SiteHeader() {
  const pathname = usePathname()
  const mobileId = useId()
  const mobileToggleRef = useRef<HTMLButtonElement>(null)

  // The panel remembers which page it was opened on, so navigating away closes
  // it for free -- no effect chasing the pathname.
  const [openedOn, setOpenedOn] = useState<string | null>(null)
  const mobileOpen = openedOn === pathname
  const setMobileOpen = useCallback(
    (open: boolean) => setOpenedOn(open ? pathname : null),
    [pathname],
  )

  useEffect(() => {
    if (!mobileOpen) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      setMobileOpen(false)
      mobileToggleRef.current?.focus()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [mobileOpen, setMobileOpen])

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/92 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-1.5 px-3 py-3 xs:gap-2 xs:px-4 sm:gap-4 sm:px-6 sm:py-3.5">
        <Link href="/" className="flex shrink-0 items-center gap-2 rounded-lg sm:gap-2.5">
          <BrandMark />
          <span className="font-display hidden text-sm font-semibold leading-tight tracking-[-0.01em] text-ink xs:block sm:text-base">
            Baldwin
            <span className="hidden font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-gold-deep sm:block sm:text-[11px]">
              Insurance Agency
            </span>
          </span>
          <span className="sr-only xs:hidden">{site.name}</span>
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-6 xl:gap-7">
            {nav.map((item) => (
              <DesktopItem key={item.href} item={item} pathname={pathname} />
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          {/* Tappable at every breakpoint -- calling is the fastest path to a
              human, and on a phone it is one tap. */}
          <a
            href={site.contact.phoneHref}
            className="whitespace-nowrap rounded-lg text-[11px] font-semibold text-body transition-colors hover:text-gold-deep xs:text-xs sm:text-sm"
          >
            {site.contact.phone}
          </a>

          <CtaButton
            kind="quote"
            className="whitespace-nowrap px-3.5! py-2.5! text-xs! sm:px-5! sm:py-3! sm:text-sm!"
          >
            Start Quote
          </CtaButton>

          <button
            ref={mobileToggleRef}
            type="button"
            aria-expanded={mobileOpen}
            aria-controls={mobileId}
            aria-label={mobileOpen ? navLabels.closeMenu : navLabels.menu}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="-mr-1 rounded-lg p-2 text-body transition-colors hover:bg-gold-wash hover:text-ink lg:hidden"
          >
            <MenuIcon open={mobileOpen} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div id={mobileId} className="border-t border-line bg-paper lg:hidden">
          <nav aria-label="Main" className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
            <ul className="flex flex-col">
              {nav.map((item) => (
                <MobileItem key={item.href} item={item} pathname={pathname} />
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  )
}

/* ------------------------------------------------------------------ desktop */

const DESKTOP_LINK =
  'rounded text-sm font-medium transition-colors hover:text-gold-deep whitespace-nowrap'

/**
 * Every nav item is a plain link. Products used to be a dropdown over the six
 * product pages; those collapsed into a single /products page, so the submenu
 * and all of its keyboard, pointer and touch handling went with them.
 */
function DesktopItem({ item, pathname }: { item: NavItem; pathname: string }) {
  const current = pathname === item.href
  // A section still highlights on its own page; there are no child pages left
  // for it to cover.
  return (
    <li>
      <Link
        href={item.href}
        aria-current={current ? 'page' : undefined}
        className={`${DESKTOP_LINK} ${current ? 'text-gold-deep' : 'text-body'}`}
      >
        {item.label}
      </Link>
    </li>
  )
}

/* ------------------------------------------------------------------- mobile */

const MOBILE_LINK = 'block rounded-lg px-2 py-3 text-base font-medium transition-colors'

function MobileItem({ item, pathname }: { item: NavItem; pathname: string }) {
  const current = pathname === item.href
  return (
    <li className="border-b border-line last:border-b-0">
      <Link
        href={item.href}
        aria-current={current ? 'page' : undefined}
        className={`${MOBILE_LINK} ${current ? 'text-gold-deep' : 'text-ink'}`}
      >
        {item.label}
      </Link>
    </li>
  )
}

/* -------------------------------------------------------------------- icons */

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {open ? <path d="M5 5l12 12M17 5L5 17" /> : <path d="M3 6h16M3 11h16M3 16h16" />}
    </svg>
  )
}
