'use client'

import { useCallback, useEffect, useId, useRef } from 'react'

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

type ModalProps = {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
}

/**
 * Accessible dialog: focus moves in on open, is trapped while open, Escape
 * closes, and focus returns to whatever opened it. Background scroll is locked
 * and the rest of the page is hidden from assistive tech.
 */
export function Modal({ open, onClose, title, description, children }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)
  const titleId = useId()
  const descriptionId = useId()

  const focusable = useCallback((): HTMLElement[] => {
    if (!panelRef.current) return []
    return Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => {
      // Skip anything explicitly removed from the tab order (the honeypot) or
      // hidden from assistive tech -- neither belongs in the focus cycle.
      if (el.tabIndex < 0) return false
      if (el.closest('[aria-hidden="true"]')) return false
      return el.offsetParent !== null || el === document.activeElement
    })
  }, [])

  // Remember the trigger, move focus in, and restore it on close.
  useEffect(() => {
    if (!open) return

    previouslyFocused.current = document.activeElement as HTMLElement | null

    // Prefer the first form control over the close button -- fewer tabs to the
    // thing the person actually came here to do. Falls back to the first
    // focusable element (the success state has no inputs, only a button).
    const items = focusable()
    const firstField = items.find((el) =>
      ['INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName),
    )
    const first = firstField ?? items[0] ?? panelRef.current
    first?.focus()

    return () => {
      previouslyFocused.current?.focus?.()
    }
  }, [open, focusable])

  // Lock background scroll while open.
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  // Escape to close; Tab cycles within the panel.
  useEffect(() => {
    if (!open) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab') return

      const items = focusable()
      if (items.length === 0) {
        event.preventDefault()
        return
      }

      const firstItem = items[0]
      const lastItem = items[items.length - 1]
      const active = document.activeElement

      if (event.shiftKey && (active === firstItem || !panelRef.current?.contains(active))) {
        event.preventDefault()
        lastItem.focus()
      } else if (!event.shiftKey && active === lastItem) {
        event.preventDefault()
        firstItem.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown, true)
    return () => document.removeEventListener('keydown', onKeyDown, true)
  }, [open, onClose, focusable])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto p-0 sm:items-center sm:p-4">
      {/* Backdrop. Presentational -- Escape and the close button do the work. */}
      <div
        className="fixed inset-0 bg-ink/45 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className="relative z-10 w-full max-w-lg rounded-t-2xl border border-line raised bg-surface p-6 sm:rounded-2xl sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id={titleId} className="font-display text-xl font-semibold tracking-[-0.01em] text-ink sm:text-2xl">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="mt-2 text-sm leading-relaxed text-body">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="-mr-2 -mt-2 rounded-lg p-2 text-muted transition-colors hover:bg-gold-wash hover:text-ink"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>

        <div className="mt-6">{children}</div>
      </div>
    </div>
  )
}
