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
  /**
   * Stable reference number. Rendered on the placeholder and printed by
   * `npm run check:images`, so a photograph can be handed over as "this is
   * photo 07" with no ambiguity about where it lands.
   *
   * Assigned in site-journey order -- the order you meet them walking the
   * site. NEVER renumber or reuse one once it has been published: the number
   * is how people outside this repo refer to the slot, and a photo filed
   * against an old number would land in the wrong place.
   */
  ref: number
  /** Where it appears, in plain words. Printed alongside the number. */
  where: string
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
    ref: 2,
    where: 'Home page About section, and the top of the About page',
    type: 'standalone',
    state: 'real',
    src: '/images/chris-baldwin-desk.jpg',
    alt: 'Chris Baldwin at his desk in the Baldwin Life Insurance office.',
    // Reboxed from the original 900x1100 guess. That portrait ratio was set
    // before any photograph existed; the real asset is 640x427 landscape
    // (1.4988), so a portrait box would have cropped 45% of the width -- the
    // branded sign and most of the desk -- and upscaled it 2.06x at 768px.
    // 1200x800 is 1.5, which the file fills essentially exactly.
    width: 1200,
    height: 800,
    // The ratios match to within 0.08%, so nothing meaningful is cropped.
    // Biased left-of-centre onto his face anyway, so any rounding crop at an
    // odd viewport width takes it off the empty right side of the frame.
    focalPoint: { x: 40, y: 40 },
  },
  'about-secondary': {
    ref: 5,
    where: 'About page, supporting photo lower down',
    type: 'standalone',
    state: 'sample',
    src: null,
    alt: '',
    width: 1200,
    height: 800,
    focalPoint: CENTER,
  },
  'product-indexed-universal-life': {
    ref: 7,
    where: 'Indexed Universal Life product page',
    type: 'standalone', state: 'sample', src: null, alt: '', width: 1200, height: 800, focalPoint: CENTER,
  },
  'product-mortgage-protection': {
    ref: 8,
    where: 'Mortgage Protection product page',
    type: 'standalone', state: 'sample', src: null, alt: '', width: 1200, height: 800, focalPoint: CENTER,
  },
  'product-final-expense': {
    ref: 9,
    where: 'Final Expense product page',
    type: 'standalone', state: 'sample', src: null, alt: '', width: 1200, height: 800, focalPoint: CENTER,
  },
  'product-annuities': {
    ref: 10,
    where: 'Annuities product page',
    type: 'standalone', state: 'sample', src: null, alt: '', width: 1200, height: 800, focalPoint: CENTER,
  },
  'product-retirement-rollovers': {
    ref: 11,
    where: 'Retirement Rollovers product page',
    type: 'standalone', state: 'sample', src: null, alt: '', width: 1200, height: 800, focalPoint: CENTER,
  },
  'product-estate-planning': {
    ref: 12,
    where: 'Estate Planning product page',
    type: 'standalone', state: 'sample', src: null, alt: '', width: 1200, height: 800, focalPoint: CENTER,
  },
  'agent-team': {
    ref: 14,
    where: 'Agent Opportunity page, beside the benefits',
    type: 'standalone', state: 'sample', src: null, alt: '', width: 1200, height: 800, focalPoint: CENTER,
  },
  family: {
    ref: 3,
    where: 'Home page, beside "Wherever You Are"',
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
    ref: 1,
    where: 'Home page, the wide banner behind the headline',
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
    ref: 4,
    where: 'About page, the wide banner across the top',
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
    ref: 6,
    where: 'Products overview page, the wide banner across the top',
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
    ref: 13,
    where: 'Agent Opportunity page, the wide banner across the top',
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
    ref: 15,
    where: 'Contact page, the wide banner across the top',
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

/**
 * The reference number as it is shown to people: zero-padded, so the list
 * sorts correctly and "07" is unmistakably a slot id rather than a count.
 */
export function photoRef(ref: number): string {
  return String(ref).padStart(2, '0')
}

/**
 * Every slot in reference order. This is the photo list -- what
 * `npm run check:images` prints and what the README documents.
 */
export function photoList(): ResolvedSlot[] {
  return (Object.keys(imageSlots) as ImageSlotName[])
    .map(resolveSlot)
    .sort((a, b) => a.config.ref - b.config.ref)
}

/**
 * Guard: reference numbers must be unique and contiguous from 1.
 *
 * A duplicate would send two photographs to the same place and a gap would
 * make the printed list lie, and both are silent failures -- nothing renders
 * differently. `check:images` calls this so the build surfaces it instead.
 */
export function refProblems(): string[] {
  const problems: string[] = []
  const seen = new Map<number, ImageSlotName[]>()
  for (const name of Object.keys(imageSlots) as ImageSlotName[]) {
    const { ref } = imageSlots[name]
    if (!Number.isInteger(ref) || ref < 1) problems.push(`${name}: ref ${ref} is not a positive integer`)
    seen.set(ref, [...(seen.get(ref) ?? []), name])
  }
  for (const [ref, names] of seen) {
    if (names.length > 1) problems.push(`ref ${photoRef(ref)} is used by ${names.join(' and ')}`)
  }
  const total = Object.keys(imageSlots).length
  for (let i = 1; i <= total; i += 1) {
    if (!seen.has(i)) problems.push(`ref ${photoRef(i)} is missing -- numbers must run 1..${total} with no gaps`)
  }
  return problems
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
