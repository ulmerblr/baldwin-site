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

function DesktopItem({ item, pathname }: { item: NavItem; pathname: string }) {
  const menuId = useId()
  // Same as the mobile panel: the dropdown closes itself on navigation by
  // remembering the page it was opened on.
  const [openedOn, setOpenedOn] = useState<string | null>(null)
  const open = openedOn === pathname
  const setOpen = useCallback(
    (next: boolean) => setOpenedOn(next ? pathname : null),
    [pathname],
  )
  const wrapperRef = useRef<HTMLLIElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([])

  const close = useCallback(
    (returnFocus = false) => {
      setOpen(false)
      if (returnFocus) triggerRef.current?.focus()
    },
    [setOpen],
  )

  const focusItem = useCallback((index: number) => {
    const items = itemRefs.current.filter(Boolean) as HTMLAnchorElement[]
    if (items.length === 0) return
    const wrapped = (index + items.length) % items.length
    items[wrapped]?.focus()
  }, [])

  // Pointer anywhere outside closes it. Pointerdown rather than click so the
  // menu is gone before the thing underneath reacts.
  useEffect(() => {
    if (!open) return
    function onPointerDown(event: PointerEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open, setOpen])

  if (!item.children) {
    return (
      <li>
        <Link
          href={item.href}
          aria-current={pathname === item.href ? 'page' : undefined}
          className={`${DESKTOP_LINK} ${pathname === item.href ? 'text-gold-deep' : 'text-body'}`}
        >
          {item.label}
        </Link>
      </li>
    )
  }

  // A section is "active" when you are on the parent or any child. That is a
  // visual cue only; aria-current marks the one page you are actually on.
  const inSection = pathname === item.href || pathname.startsWith(`${item.href}/`)

  function onTriggerKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setOpen(true)
      requestAnimationFrame(() => focusItem(0))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setOpen(true)
      requestAnimationFrame(() => focusItem(-1))
    } else if (event.key === 'Escape') {
      close()
    }
  }

  function onItemKeyDown(event: React.KeyboardEvent<HTMLAnchorElement>, index: number) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        focusItem(index + 1)
        break
      case 'ArrowUp':
        event.preventDefault()
        focusItem(index - 1)
        break
      case 'Home':
        event.preventDefault()
        focusItem(0)
        break
      case 'End':
        event.preventDefault()
        focusItem(-1)
        break
      case 'Escape':
        event.preventDefault()
        close(true)
        break
      case 'Tab':
        // Let focus leave naturally; the menu should not follow it out.
        setOpen(false)
        break
    }
  }

  return (
    <li
      ref={wrapperRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div className="flex items-center gap-0.5">
        {/* A real link, not a dead parent. Tapping it on a touch device goes
            to the overview page instead of doing nothing. */}
        <Link
          href={item.href}
          aria-current={pathname === item.href ? 'page' : undefined}
          className={`${DESKTOP_LINK} ${inSection ? 'text-gold-deep' : 'text-body'}`}
        >
          {item.label}
        </Link>
        <button
          ref={triggerRef}
          type="button"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={navLabels.submenu(item.label)}
          onClick={() => setOpen(!open)}
          onKeyDown={onTriggerKeyDown}
          className={`rounded p-1 transition-colors hover:text-gold-deep ${
            inSection ? 'text-gold-deep' : 'text-body'
          }`}
        >
          <Chevron open={open} />
        </button>
      </div>

      {open && (
        <ul
          id={menuId}
          className="raised absolute left-0 top-full z-50 mt-2 w-64 rounded-xl border border-line bg-surface p-2"
        >
          {item.children.map((child, index) => (
            <li key={child.href}>
              <Link
                ref={(node) => {
                  itemRefs.current[index] = node
                }}
                href={child.href}
                aria-current={pathname === child.href ? 'page' : undefined}
                onKeyDown={(event) => onItemKeyDown(event, index)}
                className={`block rounded-lg px-3 py-2 text-sm transition-colors hover:bg-gold-wash hover:text-gold-deep ${
                  pathname === child.href ? 'text-gold-deep' : 'text-body'
                }`}
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

/* ------------------------------------------------------------------- mobile */

const MOBILE_LINK = 'block rounded-lg px-2 py-3 text-base font-medium transition-colors'

function MobileItem({ item, pathname }: { item: NavItem; pathname: string }) {
  const subId = useId()
  const inSection = pathname === item.href || pathname.startsWith(`${item.href}/`)
  const [expanded, setExpanded] = useState(inSection && Boolean(item.children))

  return (
    <li className="border-b border-line last:border-b-0">
      <div className="flex items-center justify-between gap-2">
        <Link
          href={item.href}
          aria-current={pathname === item.href ? 'page' : undefined}
          className={`${MOBILE_LINK} flex-1 ${inSection ? 'text-gold-deep' : 'text-ink'}`}
        >
          {item.label}
        </Link>

        {item.children && (
          // A disclosure, not a hover menu: hover does not exist here.
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls={subId}
            aria-label={navLabels.submenu(item.label)}
            onClick={() => setExpanded((value) => !value)}
            className="rounded-lg p-3 text-body transition-colors hover:bg-gold-wash hover:text-gold-deep"
          >
            <Chevron open={expanded} />
          </button>
        )}
      </div>

      {item.children && expanded && (
        <ul id={subId} className="mb-2 ml-2 border-l border-line pl-3">
          {item.children.map((child) => (
            <li key={child.href}>
              <Link
                href={child.href}
                aria-current={pathname === child.href ? 'page' : undefined}
                className={`${MOBILE_LINK} text-sm ${
                  pathname === child.href ? 'text-gold-deep' : 'text-body'
                }`}
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

/* -------------------------------------------------------------------- icons */

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`transition-transform ${open ? 'rotate-180' : ''}`}
    >
      <path d="M4 6l4 4 4-4" />
    </svg>
  )
}

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
