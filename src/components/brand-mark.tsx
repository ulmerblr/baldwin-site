/** The shield mark. Inline SVG so there is no asset to fetch. */
export function BrandMark({ size = 34 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 34 34"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect width="34" height="34" rx="8" fill="#0f2038" stroke="#c9a227" strokeWidth="1.5" />
      <path
        d="M17 8l7 3.2v5.4c0 4.2-2.9 7.6-7 8.9-4.1-1.3-7-4.7-7-8.9v-5.4L17 8z"
        fill="none"
        stroke="#c9a227"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M13.6 17l2.4 2.4 4.6-4.8"
        fill="none"
        stroke="#e8ca6b"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
