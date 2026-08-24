/**
 * Image slot configuration -- the single place photography is wired up.
 *
 * Every photo on the site resolves through a named slot. Components render
 * `<ImageSlot name="..." />` and never reference a file path, so dropping real
 * photography in is a change to THIS FILE ONLY: save the file under
 * `public/images/`, set `src`, and (for the non-decorative slots) set `alt`.
 *
 * Until a slot has a `src`, a neutral branded placeholder renders in its place.
 * No stock photography, no generated imagery. See public/images/README.md.
 */

export type ImageSlotName =
  | 'chris-portrait'
  | 'about-secondary'
  | 'product-indexed-universal-life'
  | 'product-mortgage-protection'
  | 'product-final-expense'
  | 'product-annuities'
  | 'product-retirement-rollovers'
  | 'product-estate-planning'
  | 'agent-team'

export type ImageSlot = {
  /** Path under /public once the photo exists, e.g. '/images/chris-portrait.jpg'. */
  src: string | null
  /**
   * Alt text. Empty string means decorative -- the image is hidden from
   * assistive tech, which is correct for the supporting product photos.
   */
  alt: string
  /** Intrinsic size. Drives the placeholder's aspect ratio too. */
  width: number
  height: number
}

export const imageSlots: Record<ImageSlotName, ImageSlot> = {
  'chris-portrait': {
    src: null,
    alt: 'Chris Baldwin, founder of Baldwin Insurance Agency',
    width: 900,
    height: 1100,
  },
  'about-secondary': {
    // Optional supporting photo. Alt text ships with the photograph.
    src: null,
    alt: '',
    width: 1200,
    height: 800,
  },
  'product-indexed-universal-life': { src: null, alt: '', width: 1200, height: 800 },
  'product-mortgage-protection': { src: null, alt: '', width: 1200, height: 800 },
  'product-final-expense': { src: null, alt: '', width: 1200, height: 800 },
  'product-annuities': { src: null, alt: '', width: 1200, height: 800 },
  'product-retirement-rollovers': { src: null, alt: '', width: 1200, height: 800 },
  'product-estate-planning': { src: null, alt: '', width: 1200, height: 800 },
  'agent-team': { src: null, alt: '', width: 1200, height: 800 },
}

/** Shown inside an unfilled slot. Chrome, not marketing copy. */
export const imagePlaceholderLabel = 'Photograph to come'
