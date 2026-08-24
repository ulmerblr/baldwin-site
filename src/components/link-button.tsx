import Link from 'next/link'

/**
 * Button-shaped link, for destinations rather than dialogs.
 *
 * The class strings mirror CtaButton's variants so the two sit side by side
 * without a seam. CtaButton itself is form/modal code and is left untouched.
 */
const BASE =
  'inline-flex items-center justify-center rounded-xl px-7 py-3.5 font-semibold transition-colors'

const VARIANTS = {
  primary: 'bg-gold-500 text-navy-950 hover:bg-gold-400',
  secondary: 'border border-gold-500/60 text-gold-300 hover:bg-gold-500/10',
} as const

type LinkButtonProps = {
  href: string
  children: React.ReactNode
  variant?: keyof typeof VARIANTS
  className?: string
}

export function LinkButton({
  href,
  children,
  variant = 'secondary',
  className = '',
}: LinkButtonProps) {
  // tel: and mailto: are not routes; Link would try to prefetch them.
  const external = /^(tel:|mailto:|https?:)/.test(href)
  const classes = `${BASE} ${VARIANTS[variant]} ${className}`

  if (external) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  )
}
