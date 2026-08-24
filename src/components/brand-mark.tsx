/**
 * The shield mark. Inline SVG so there is no asset to fetch.
 *
 * On the light theme the shield is an outline in brand gold on the page
 * ground rather than a filled navy tile -- a solid dark chip would be the
 * heaviest thing in a light header. `tone="onDark"` restores a light-on-dark
 * version for use over an overlay scrim.
 */
export function BrandMark({
  size = 34,
  tone = 'light',
}: {
  size?: number
  tone?: 'light' | 'onDark'
}) {
  const frame = tone === 'light' ? '#A67C1A' : 'rgba(250,249,246,0.55)'
  const shield = tone === 'light' ? '#A67C1A' : '#FAF9F6'
  const tick = tone === 'light' ? '#101E33' : '#C9A227'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 34 34"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect
        x="0.75"
        y="0.75"
        width="32.5"
        height="32.5"
        rx="7.5"
        fill="none"
        stroke={frame}
        strokeWidth="1.5"
      />
      <path
        d="M17 8l7 3.2v5.4c0 4.2-2.9 7.6-7 8.9-4.1-1.3-7-4.7-7-8.9v-5.4L17 8z"
        fill="none"
        stroke={shield}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M13.6 17l2.4 2.4 4.6-4.8"
        fill="none"
        stroke={tick}
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
