import Image from 'next/image'
import { imagePlaceholderLabel, imageSlots, type ImageSlotName } from '@/content/images'
import { BrandMark } from './brand-mark'

/**
 * Renders a named photography slot.
 *
 * Real photography has not been supplied yet. Until a slot gets a `src` in
 * `src/content/images.ts` this draws a neutral branded panel in the site
 * palette -- no stock photograph, no generated image, nothing lifted from
 * another site. Dropping the real photo in is a one-line edit to that config
 * file; no component changes.
 */
export function ImageSlot({
  name,
  className = '',
  priority = false,
}: {
  name: ImageSlotName
  className?: string
  priority?: boolean
}) {
  const slot = imageSlots[name]

  if (slot.src) {
    return (
      <Image
        src={slot.src}
        alt={slot.alt}
        width={slot.width}
        height={slot.height}
        priority={priority}
        className={`w-full rounded-2xl border border-navy-700 object-cover ${className}`}
      />
    )
  }

  return (
    <div
      // Purely a stand-in for a photo: there is nothing here to describe, so
      // it stays out of the accessibility tree entirely.
      aria-hidden="true"
      style={{ aspectRatio: `${slot.width} / ${slot.height}` }}
      className={`flex w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-navy-600 bg-[linear-gradient(135deg,rgba(22,48,79,0.55),rgba(6,13,24,0.85))] ${className}`}
    >
      <BrandMark size={40} />
      <span className="px-4 text-center text-xs font-medium uppercase tracking-[0.18em] text-ink-400">
        {imagePlaceholderLabel}
      </span>
    </div>
  )
}
