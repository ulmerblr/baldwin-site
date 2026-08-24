import Image from 'next/image'
import {
  SCRIM_FLOOR,
  imagePlaceholderLabel,
  imageSlots,
  resolveSlot,
  type ImageSlotName,
  type OverlaySlotName,
  type Scrim,
  type StandaloneSlotName,
} from '@/content/images'

/**
 * Named photography slots. Two renderers, one per slot type.
 *
 * Three states, decided entirely by `state` in `src/content/images.ts` and read
 * only through `resolveSlot()`:
 *
 *   empty   the neutral "photograph to come" treatment
 *   sample  a generated stand-in, loudly marked SAMPLE - REPLACE. Scaffolding
 *           for reviewing layout and overlay contrast. NOT a filled slot:
 *           `data-slot-filled` stays "false" and nothing here treats it as done.
 *   real    an actual photograph
 *
 * All three reserve the slot's exact aspect ratio, so nothing moves when the
 * real file lands. No stock photography, no generated imagery, nothing lifted
 * from another site.
 */

/** The marker a sample carries in the DOM, over the image itself. */
const SAMPLE_LABEL = 'SAMPLE — REPLACE'

/* ------------------------------------------------------------ shared bits */

/**
 * The placeholder fill. Deliberately in between: enough tone to read as a
 * reserved space rather than a broken build, plain enough that nobody mistakes
 * it for finished art. The slot name is printed on it so it is obvious which
 * photograph belongs where.
 */
function PlaceholderBody({ name }: { name: ImageSlotName }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-4 text-center">
      <PhotoGlyph className="text-gold" />
      <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
        {imagePlaceholderLabel}
      </span>
      {/* Which photo goes here. Muted, small, unmistakably a build note. */}
      <code className="font-mono text-[10px] tracking-tight text-muted">{name}</code>
    </div>
  )
}

/**
 * The Type B stand-in.
 *
 * An overlay placeholder has to do two things at once: render the scrim, so the
 * text on top is contrast-testable today, and still say which photograph
 * belongs here. A centred label loses that fight -- it ends up buried under
 * both the scrim and the headline. So the ground gets a faint hatch, which
 * reads as reserved space rather than as a design decision, and the label moves
 * to a corner tag that sits ABOVE the scrim and out of the text's way.
 */
function OverlayPlaceholderGround() {
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-20 bg-ink">
      <div
        className="absolute inset-0 opacity-[0.09]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg, #FAF9F6 0 1px, transparent 1px 11px)',
        }}
      />
    </div>
  )
}

function OverlayPlaceholderTag({ name }: { name: OverlaySlotName }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute bottom-3 right-3 z-10 flex items-center gap-2 rounded-lg border border-overlay-text/25 bg-ink/50 px-2.5 py-1.5"
    >
      <PhotoGlyph className="text-overlay-text/70" size={14} />
      <span className="font-mono text-[10px] tracking-tight text-overlay-text/70">
        {name}
      </span>
    </div>
  )
}

function PhotoGlyph({ className = '', size = 26 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
      className={className}
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="8.5" cy="10" r="1.6" />
      <path d="M21 16l-5-5-4.5 4.5L9 13l-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/**
 * Ink scrim as a SINGLE gradient whose lightest stop is still the floor.
 *
 * The tempting version -- a flat base tint plus a directional gradient on top
 * -- double-composites: 0.70 under 0.82 is an effective 0.95, near-solid ink,
 * which would bury any photograph that lands here later. One gradient that
 * runs from `peak` down to SCRIM_FLOOR keeps the directional look and still
 * guarantees every pixel clears the floor, which is what makes overlay text
 * safe at any crop.
 */
function scrimGradient(scrim: Scrim): string {
  const peak = Math.max(scrim.opacity, SCRIM_FLOOR)
  const mid = (peak + SCRIM_FLOOR) / 2
  const ink = (alpha: number) => `rgb(16 30 51 / ${alpha.toFixed(3)})`

  switch (scrim.direction) {
    case 'left':
      return `linear-gradient(to right, ${ink(peak)} 0%, ${ink(mid)} 45%, ${ink(SCRIM_FLOOR)} 100%)`
    case 'bottom':
      return `linear-gradient(to top, ${ink(peak)} 0%, ${ink(mid)} 50%, ${ink(SCRIM_FLOOR)} 100%)`
    case 'full':
      return `linear-gradient(${ink(peak)}, ${ink(peak)})`
  }
}

/* -------------------------------------------- type A -- standalone image */

export function ImageSlot({
  name,
  className = '',
  priority = false,
}: {
  name: StandaloneSlotName
  className?: string
  priority?: boolean
}) {
  const slot = imageSlots[name]
  const resolved = resolveSlot(name)
  const ratio = { aspectRatio: `${slot.width} / ${slot.height}` }

  // Nothing supplied: the neutral reserved-space treatment.
  if (!resolved.src) {
    return (
      <div
        // A stand-in for a photo: there is nothing here to describe, so it
        // stays out of the accessibility tree entirely.
        aria-hidden="true"
        data-image-slot={name}
        data-slot-type="standalone"
        data-slot-state="empty"
        data-slot-filled="false"
        style={ratio}
        className={`w-full overflow-hidden rounded-2xl border border-dashed border-line bg-gold-wash ${className}`}
      >
        <PlaceholderBody name={name} />
      </div>
    )
  }

  const isSample = resolved.state === 'sample'

  const image = (
    <Image
      src={resolved.src}
      alt={resolved.alt}
      width={slot.width}
      height={slot.height}
      priority={priority}
      // A sample is scaffolding, not content -- keep it out of the
      // accessibility tree entirely. `resolved.alt` is already forced empty.
      aria-hidden={isSample || resolved.alt === '' ? true : undefined}
      style={{ objectPosition: `${slot.focalPoint.x}% ${slot.focalPoint.y}%` }}
      className="h-full w-full rounded-2xl object-cover"
    />
  )

  if (!isSample) {
    return (
      <div
        data-image-slot={name}
        data-slot-type="standalone"
        data-slot-state="real"
        data-slot-filled="true"
        style={ratio}
        className={`w-full overflow-hidden rounded-2xl border border-line ${className}`}
      >
        {image}
      </div>
    )
  }

  return (
    <div
      data-image-slot={name}
      data-slot-type="standalone"
      data-slot-state="sample"
      // A sample is NOT a filled slot. Nothing downstream may read it as done.
      data-slot-filled="false"
      style={ratio}
      className={`relative w-full overflow-hidden rounded-2xl border-2 border-dashed border-[#B5179E] ${className}`}
    >
      {image}
      <SampleTag name={name} />
    </div>
  )
}

/**
 * The persistent needs-replacing marker.
 *
 * The generated SVG already prints SAMPLE - REPLACE across its middle, but the
 * overlay slots run it under a scrim at 0.70 or heavier, so the in-image label
 * alone cannot be relied on. This sits above everything.
 */
function SampleTag({ name }: { name: ImageSlotName }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute bottom-2 right-2 z-20 flex items-center gap-2 rounded-md bg-[#B5179E] px-2 py-1"
    >
      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-white">
        {SAMPLE_LABEL}
      </span>
      <span className="font-mono text-[10px] text-white/85">{name}</span>
    </div>
  )
}

/* ------------------------------------------ type B -- overlay background */

/**
 * A wide background with content over it. Renders the scrim whether or not a
 * photograph exists yet, so overlay text is contrast-testable from day one
 * rather than the day the photos land.
 *
 * Children are rendered inside `.on-dark`, which flips the focus ring to its
 * light variant for anything focusable on top.
 */
export function OverlayImage({
  name,
  children,
  className = '',
  priority = false,
}: {
  name: OverlaySlotName
  children: React.ReactNode
  className?: string
  priority?: boolean
}) {
  const slot = imageSlots[name]
  if (slot.type !== 'overlay') throw new Error(`Slot ${name} is not an overlay slot`)

  const resolved = resolveSlot(name)
  const isSample = resolved.state === 'sample'
  const gradient = scrimGradient(slot.scrim)

  return (
    <section
      data-image-slot={name}
      data-slot-type="overlay"
      data-slot-state={resolved.state}
      // Only a real photograph counts as filled. A sample is scaffolding.
      data-slot-filled={resolved.isReal ? 'true' : 'false'}
      className={`relative isolate overflow-hidden bg-ink ${className}`}
    >
      {resolved.src ? (
        <Image
          src={resolved.src}
          alt={resolved.alt}
          fill
          priority={priority}
          sizes="100vw"
          aria-hidden={resolved.alt === '' ? true : undefined}
          style={{ objectPosition: `${slot.focalPoint.x}% ${slot.focalPoint.y}%` }}
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
      ) : (
        // The ground sits UNDER the scrim, exactly where a photo would, so
        // what you contrast-test now is what ships later.
        <OverlayPlaceholderGround />
      )}

      {/* The scrim. One layer, floor-clamped at its lightest point. It renders
          over a sample exactly as it will over a photograph -- which is the
          whole reason the samples are banded light-to-dark. */}
      <div
        aria-hidden="true"
        data-scrim={name}
        data-scrim-floor={SCRIM_FLOOR}
        className="absolute inset-0 -z-10"
        style={{ backgroundImage: gradient }}
      />

      <div className="on-dark relative">{children}</div>

      {resolved.state === 'empty' && <OverlayPlaceholderTag name={name} />}
      {isSample && <SampleTag name={name} />}
    </section>
  )
}
