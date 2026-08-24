/**
 * Image slot configuration -- the single place photography is wired up.
 *
 * Every photo on the site resolves through a named slot. Components render
 * `<ImageSlot name="..." />` or `<OverlayImage name="...">...</OverlayImage>`
 * and never reference a file path, so dropping real photography in is a change
 * to THIS FILE ONLY: save the file under `public/images/`, set `src`, and set
 * `alt` where the image is not decorative.
 *
 * EVERY SLOT IS IN EXACTLY ONE OF THREE STATES, and `state` below is the only
 * thing that says which. Nothing else in the codebase decides it:
 *
 *   'empty'   nothing supplied yet -- the neutral "photograph to come"
 *             treatment renders.
 *   'sample'  a generated stand-in renders, loudly marked SAMPLE - REPLACE.
 *             Scaffolding for reviewing layout, crops and overlay contrast.
 *             A sample is NOT a filled slot and never counts as done.
 *   'real'    an actual photograph. The only state that means finished.
 *
 * Both 'empty' and 'sample' reserve the slot's exact aspect ratio, so nothing
 * on the page moves when the real file lands.
 *
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
 * The single source of truth for whether a slot is done.
 *
 * Read it through `resolveSlot()` rather than comparing it in call sites --
 * that is what keeps "is this slot finished?" answerable in one place.
 */
export type SlotState = 'empty' | 'sample' | 'real'

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
  state: SlotState
  /**
   * Path under /public to the REAL photograph, e.g. '/images/chris.jpg'.
   * Only consulted when `state` is 'real'; the sample's path is derived from
   * the slot name, so a sample can never be mistaken for supplied artwork.
   */
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
    state: 'sample',
    src: null,
    alt: 'Chris Baldwin, founder of Baldwin Insurance Agency',
    width: 900,
    height: 1100,
    // Faces sit high in a portrait crop.
    focalPoint: { x: 50, y: 35 },
  },
  'about-secondary': {
    type: 'standalone',
    state: 'sample',
    src: null,
    alt: '',
    width: 1200,
    height: 800,
    focalPoint: CENTER,
  },
  'product-indexed-universal-life': {
    type: 'standalone', state: 'sample', src: null, alt: '', width: 1200, height: 800, focalPoint: CENTER,
  },
  'product-mortgage-protection': {
    type: 'standalone', state: 'sample', src: null, alt: '', width: 1200, height: 800, focalPoint: CENTER,
  },
  'product-final-expense': {
    type: 'standalone', state: 'sample', src: null, alt: '', width: 1200, height: 800, focalPoint: CENTER,
  },
  'product-annuities': {
    type: 'standalone', state: 'sample', src: null, alt: '', width: 1200, height: 800, focalPoint: CENTER,
  },
  'product-retirement-rollovers': {
    type: 'standalone', state: 'sample', src: null, alt: '', width: 1200, height: 800, focalPoint: CENTER,
  },
  'product-estate-planning': {
    type: 'standalone', state: 'sample', src: null, alt: '', width: 1200, height: 800, focalPoint: CENTER,
  },
  'agent-team': {
    type: 'standalone', state: 'sample', src: null, alt: '', width: 1200, height: 800, focalPoint: CENTER,
  },
  family: {
    type: 'standalone',
    state: 'sample',
    src: null,
    alt: '',
    width: 1200,
    height: 900,
    focalPoint: CENTER,
  },

  /* --------------------------------------------------- type B -- overlay */

  'home-hero': {
    type: 'overlay',
    state: 'sample',
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
    state: 'sample',
    src: null,
    alt: '',
    width: 2400,
    height: 1000,
    focalPoint: { x: 60, y: 40 },
    scrim: { direction: 'left', opacity: 0.78 },
  },
  'products-header': {
    type: 'overlay',
    state: 'sample',
    src: null,
    alt: '',
    width: 2400,
    height: 1000,
    focalPoint: CENTER,
    scrim: { direction: 'left', opacity: 0.78 },
  },
  'agent-header': {
    type: 'overlay',
    state: 'sample',
    src: null,
    alt: '',
    width: 2400,
    height: 1000,
    focalPoint: { x: 55, y: 40 },
    scrim: { direction: 'left', opacity: 0.78 },
  },
  'contact-header': {
    type: 'overlay',
    state: 'sample',
    src: null,
    alt: '',
    width: 2400,
    height: 1000,
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

/**
 * Sample files are generated by `npm run images:samples` and land here. The
 * path is DERIVED from the slot name rather than configured, so no sample can
 * ever be typed into `src` and quietly pass as supplied artwork.
 */
export function sampleSrc(name: ImageSlotName): string {
  return `/images/samples/${name}.svg`
}

export type ResolvedSlot = {
  name: ImageSlotName
  config: ImageSlotConfig
  state: SlotState
  /** The file to render now, or null when nothing should be. */
  src: string | null
  /**
   * The alt text to use NOW.
   *
   * Forced empty while a slot holds a sample: `chris-portrait` is configured
   * as "Chris Baldwin, founder of Baldwin Insurance Agency", and announcing
   * that over a magenta test card tells a screen reader user a photograph of a
   * real person is present when it is not. The configured value stays in the
   * config, ready for the day the real photo lands.
   */
  alt: string
  /** The ONLY thing that means this slot is finished. */
  isReal: boolean
}

/**
 * Resolve a slot to what should render right now.
 *
 * Every consumer -- the components, the build banner, `check:images` -- goes
 * through here, so "is this slot done?" has exactly one answer in exactly one
 * place.
 */
export function resolveSlot(name: ImageSlotName): ResolvedSlot {
  const config = imageSlots[name]
  const isReal = config.state === 'real' && Boolean(config.src)

  if (isReal) {
    return { name, config, state: 'real', src: config.src, alt: config.alt, isReal: true }
  }
  if (config.state === 'sample') {
    return { name, config, state: 'sample', src: sampleSrc(name), alt: '', isReal: false }
  }
  return { name, config, state: 'empty', src: null, alt: '', isReal: false }
}

/** Every slot not yet carrying a real photograph. Drives the gate and banner. */
export function unfinishedSlots(): ResolvedSlot[] {
  return (Object.keys(imageSlots) as ImageSlotName[])
    .map(resolveSlot)
    .filter((slot) => !slot.isReal)
}

/** Type guard, so callers get the scrim field narrowed. */
export function isOverlaySlot(slot: ImageSlotConfig): slot is OverlaySlot {
  return slot.type === 'overlay'
}
