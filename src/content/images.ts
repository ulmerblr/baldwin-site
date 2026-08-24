/**
 * Image slot configuration -- the single place photography is wired up.
 *
 * Every photo on the site resolves through a named slot. Components render
 * `<ImageSlot name="..." />` or `<OverlayImage name="...">...</OverlayImage>`
 * and never reference a file path, so dropping real photography in is a change
 * to THIS FILE ONLY: save the file under `public/images/`, set `src`, and set
 * `alt` where the image is not decorative.
 *
 * Until a slot has a `src`, a neutral placeholder renders in its place, at the
 * slot's exact aspect ratio so nothing shifts when the real file arrives.
 * No stock photography, no generated imagery. See public/images/README.md.
 *
 * TWO SLOT TYPES, and the difference is structural rather than cosmetic:
 *
 *   'standalone' -- a contained image. Nothing sits on top of it.
 *   'overlay'    -- a wide/full-bleed background with text and sometimes
 *                   buttons over it. Needs a scrim, a defined focal point,
 *                   and contrast that holds up against any photo that lands
 *                   in it later.
 */

export type StandaloneSlotName =
  | 'chris-portrait'
  | 'about-secondary'
  | 'product-indexed-universal-life'
  | 'product-mortgage-protection'
  | 'product-final-expense'
  | 'product-annuities'
  | 'product-retirement-rollovers'
  | 'product-estate-planning'
  | 'agent-team'
  | 'family'

export type OverlaySlotName =
  | 'home-hero'
  | 'about-header'
  | 'products-header'
  | 'agent-header'
  | 'contact-header'

export type ImageSlotName = StandaloneSlotName | OverlaySlotName

/**
 * Where the subject sits, in percent. Maps straight onto `object-position`, so
 * a portrait whose face is high in the frame stays framed as the crop narrows.
 */
export type FocalPoint = { x: number; y: number }

/**
 * How hard the scrim sits between photo and text.
 *
 * `direction` is where the darkest part goes -- put it where the text is.
 * `opacity` is the peak ink opacity there. It is a floor-clamped request, not
 * the last word: the renderer never lets the scrim under text fall below
 * SCRIM_FLOOR, because a scrim that is merely decorative is how sites fail
 * contrast silently once a bright photo lands in the slot.
 */
export type Scrim = {
  direction: 'left' | 'bottom' | 'full'
  opacity: number
}

type BaseSlot = {
  /** Path under /public once the photo exists, e.g. '/images/chris-portrait.jpg'. */
  src: string | null
  /**
   * Alt text. Empty string means decorative -- hidden from assistive tech,
   * which is correct for supporting photos and for every overlay background,
   * where the words on top already carry the meaning.
   */
  alt: string
  /** Intrinsic size. Drives the reserved aspect ratio too. */
  width: number
  height: number
  focalPoint: FocalPoint
}

export type StandaloneSlot = BaseSlot & { type: 'standalone' }
export type OverlaySlot = BaseSlot & { type: 'overlay'; scrim: Scrim }
export type ImageSlotConfig = StandaloneSlot | OverlaySlot

const CENTER: FocalPoint = { x: 50, y: 50 }

export const imageSlots: Record<ImageSlotName, ImageSlotConfig> = {
  /* ------------------------------------------------ type A -- standalone */

  'chris-portrait': {
    type: 'standalone',
    src: null,
    alt: 'Chris Baldwin, founder of Baldwin Insurance Agency',
    width: 900,
    height: 1100,
    // Faces sit high in a portrait crop.
    focalPoint: { x: 50, y: 35 },
  },
  'about-secondary': {
    type: 'standalone',
    src: null,
    alt: '',
    width: 1200,
    height: 800,
    focalPoint: CENTER,
  },
  'product-indexed-universal-life': {
    type: 'standalone', src: null, alt: '', width: 1200, height: 800, focalPoint: CENTER,
  },
  'product-mortgage-protection': {
    type: 'standalone', src: null, alt: '', width: 1200, height: 800, focalPoint: CENTER,
  },
  'product-final-expense': {
    type: 'standalone', src: null, alt: '', width: 1200, height: 800, focalPoint: CENTER,
  },
  'product-annuities': {
    type: 'standalone', src: null, alt: '', width: 1200, height: 800, focalPoint: CENTER,
  },
  'product-retirement-rollovers': {
    type: 'standalone', src: null, alt: '', width: 1200, height: 800, focalPoint: CENTER,
  },
  'product-estate-planning': {
    type: 'standalone', src: null, alt: '', width: 1200, height: 800, focalPoint: CENTER,
  },
  'agent-team': {
    type: 'standalone', src: null, alt: '', width: 1200, height: 800, focalPoint: CENTER,
  },
  family: {
    type: 'standalone',
    src: null,
    alt: '',
    width: 1200,
    height: 900,
    focalPoint: CENTER,
  },

  /* --------------------------------------------------- type B -- overlay */

  'home-hero': {
    type: 'overlay',
    src: null,
    // Decorative: the headline over it says everything this image would.
    alt: '',
    width: 2400,
    height: 1400,
    // Headline and CTAs sit left, so keep the subject right of them.
    focalPoint: { x: 68, y: 45 },
    scrim: { direction: 'left', opacity: 0.82 },
  },
  'about-header': {
    type: 'overlay',
    src: null, alt: '', width: 2400, height: 1000,
    focalPoint: { x: 60, y: 40 },
    scrim: { direction: 'left', opacity: 0.78 },
  },
  'products-header': {
    type: 'overlay',
    src: null, alt: '', width: 2400, height: 1000,
    focalPoint: CENTER,
    scrim: { direction: 'left', opacity: 0.78 },
  },
  'agent-header': {
    type: 'overlay',
    src: null, alt: '', width: 2400, height: 1000,
    focalPoint: { x: 55, y: 40 },
    scrim: { direction: 'left', opacity: 0.78 },
  },
  'contact-header': {
    type: 'overlay',
    src: null, alt: '', width: 2400, height: 1000,
    focalPoint: CENTER,
    scrim: { direction: 'left', opacity: 0.78 },
  },
}

/**
 * Minimum ink opacity anywhere text sits on an overlay slot.
 *
 * 0.70 ink over a pure-white photo composites to #586270, which carries
 * --color-overlay-text at 5.87:1 -- clear of the 4.5:1 AA floor with room to
 * spare. "Pure white photo" is the worst case a real photograph can approach,
 * so anything darker only improves. Do not lower this without re-running the
 * contrast check.
 */
export const SCRIM_FLOOR = 0.7

/** Shown inside an unfilled slot. Chrome, not marketing copy. */
export const imagePlaceholderLabel = 'Photograph to come'

/** Type guard, so callers get the scrim field narrowed. */
export function isOverlaySlot(slot: ImageSlotConfig): slot is OverlaySlot {
  return slot.type === 'overlay'
}
