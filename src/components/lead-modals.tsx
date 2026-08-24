'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { site } from '@/content/site'
import { LeadForm } from './lead-form'
import { Modal } from './modal'

export type LeadKind = 'quote' | 'apply'

type LeadModalContext = {
  open: (kind: LeadKind) => void
}

const Context = createContext<LeadModalContext | null>(null)

/**
 * Owns both dialogs and their open state. Kept as one small client island so
 * the rest of the page stays a static server render.
 */
export function LeadModalProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<LeadKind | null>(null)

  const open = useCallback((kind: LeadKind) => setActive(kind), [])
  const close = useCallback(() => setActive(null), [])

  const value = useMemo(() => ({ open }), [open])

  return (
    <Context.Provider value={value}>
      {children}

      <Modal
        open={active === 'quote'}
        onClose={close}
        title={site.forms.quote.title}
        description={site.forms.quote.description}
      >
        <LeadForm
          endpoint="/api/quote"
          submitLabel={site.forms.quote.submit}
          submittingLabel={site.forms.quote.submitting}
          successTitle={site.forms.quote.successTitle}
          successBody={site.forms.quote.successBody}
          onDone={close}
        />
      </Modal>

      <Modal
        open={active === 'apply'}
        onClose={close}
        title={site.forms.apply.title}
        description={site.forms.apply.description}
      >
        <LeadForm
          endpoint="/api/apply"
          submitLabel={site.forms.apply.submit}
          submittingLabel={site.forms.apply.submitting}
          successTitle={site.forms.apply.successTitle}
          successBody={site.forms.apply.successBody}
          onDone={close}
        />
      </Modal>
    </Context.Provider>
  )
}

function useLeadModals(): LeadModalContext {
  const context = useContext(Context)
  if (!context) throw new Error('CtaButton must be rendered inside LeadModalProvider')
  return context
}

type CtaButtonProps = {
  kind: LeadKind
  children: React.ReactNode
  variant?: keyof typeof VARIANTS
  className?: string
}

const VARIANTS = {
  primary: 'bg-gold-bright text-ink hover:bg-gold',
  secondary: 'border border-gold/60 text-gold-deep hover:bg-gold-wash',
  // For use on an overlay scrim, where the light half has to do the work.
  onDark:
    'border border-overlay-text/70 text-overlay-text hover:bg-overlay-text hover:text-ink',
} as const

/** Opens the matching dialog. Focus returns here when it closes. */
export function CtaButton({ kind, children, variant = 'primary', className = '' }: CtaButtonProps) {
  const { open } = useLeadModals()

  return (
    <button
      type="button"
      onClick={() => open(kind)}
      className={`inline-flex items-center justify-center rounded-xl px-7 py-3.5 font-semibold transition-colors ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
