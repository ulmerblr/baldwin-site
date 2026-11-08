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
  | 'baldwin-family'
  | 'chris-card'
  | 'about-secondary'
  | 'agent-team'

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
    where: 'About page, the portrait at the top',
    type: 'standalone',
    state: 'real',
    src: '/images/chris-baldwin-headshot.webp',
    alt: 'Chris Baldwin, founder of Baldwin Insurance Agency.',
    // Reboxed a second time, and for the same reason as the first: the box
    // follows the file, never the other way round. It was 1200x800 for the
    // landscape desk photograph; the studio headshot is 1024x1536 portrait
    // (0.667), so holding the landscape box would have cropped 55% of the
    // frame's height and taken the top of his head with it.
    width: 1024,
    height: 1536,
    // The box matches the file, so nothing is cropped at any breakpoint.
    // Still biased up onto his face, so a rounding crop at an odd viewport
    // width comes off the jacket at the bottom rather than the forehead.
    focalPoint: { x: 50, y: 30 },
  },
  'baldwin-family': {
    ref: 17,
    where: 'About page, with the personal background',
    type: 'standalone',
    state: 'real',
    src: '/images/baldwin-family.webp',
    alt: 'Chris Baldwin with his wife and four children.',
    // 3:2, matching the file, so the group is never cropped at the edges --
    // losing a person off the end of a family photograph is not a crop you
    // can make safely at any breakpoint.
    width: 1600,
    height: 1066,
    // Six people standing: the faces sit in the upper third.
    focalPoint: { x: 50, y: 38 },
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
  'agent-team': {
    ref: 14,
    where: 'Agent Opportunity page, beside the benefits',
    type: 'standalone',
    state: 'real',
    src: '/images/chris-baldwin-alaska.webp',
    alt: 'Chris Baldwin and his wife holding up Alaska-branded merchandise.',
    // Reboxed from a 1200x800 landscape guess to the file's own 604x895.
    // This is the placement where the whole photograph survives: the header
    // band above crops to a horizontal slice and loses the merchandise, which
    // is the part of the picture a recruiting page is actually using.
    width: 604,
    height: 895,
    focalPoint: CENTER,
  },

  'chris-card': {
    ref: 16,
    where: 'Home page, the promotional card between the hero and the products',
    type: 'standalone',
    state: 'real',
    src: '/images/chris-baldwin-card.webp',
    alt: 'Chris Baldwin, licensed life insurance agent at Baldwin Insurance Agency, with contact details.',
    // Square, and the artwork already carries its own text and layout, so it
    // is never cropped: the reserved box matches the file exactly.
    width: 1254,
    height: 1254,
    focalPoint: CENTER,
  },

  /* --------------------------------------------------- type B -- overlay */

  'home-hero': {
    ref: 1,
    where: 'Home page, the wide banner behind the headline',
    type: 'overlay',
    state: 'real',
    src: '/images/family-outdoors.jpg',
    // Decorative: the headline over it says everything this image would.
    alt: '',
    width: 2400,
    height: 1400,
    // A group shot, not a single subject: the six of them span almost the
    // whole frame and the faces cluster in the upper middle. Centred rather
    // than the old right-of-centre guess, and lifted so the narrow crop at
    // phone widths keeps faces instead of grass.
    focalPoint: { x: 52, y: 32 },
    scrim: { direction: 'left', opacity: 0.82 },
  },
  'about-header': {
    ref: 4,
    where: 'About page, the wide banner across the top',
    type: 'overlay',
    state: 'real',
    src: '/images/baldwin-family-airport.webp',
    // Decorative: the headline over it says everything this image would, and
    // the same family is described properly in slot 17 further down the page.
    alt: '',
    // The file's own size. An overlay slot renders with `fill`, so these are
    // metadata rather than layout -- the band's height comes from the words
    // on top of it, and the crop follows from that.
    width: 2000,
    height: 1329,
    // Six people in a row, and the band gets very shallow on a wide screen:
    // at 2560 it shows under a fifth of the frame's height, which is the
    // difference between six faces and six foreheads. Picked by sweeping the
    // value against the real page at 1280, 1920 and 2560 and looking -- at 32
    // the two tallest heads lose their crowns at 2560; 26 clears everyone.
    focalPoint: { x: 50, y: 26 },
    scrim: { direction: 'left', opacity: 0.78 },
  },
  'products-header': {
    ref: 6,
    where: 'Products page, the wide banner across the top',
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
    state: 'real',
    // The same photograph as slot 14 below, by request. Up here it is a
    // scrimmed background cropped to the two faces; down there it is the
    // whole picture including the merchandise. Worth knowing before this is
    // changed: the file is 604px wide and this band runs the full viewport,
    // so on a large screen the browser is upscaling it about 3x. The scrim
    // hides most of that. A wider original would be a straight improvement
    // here and would need no code change -- only `src`, `width`, `height`.
    src: '/images/chris-baldwin-alaska.webp',
    // Decorative: the headline over it says everything this image would, and
    // slot 14 carries the describing alt text for the same photograph.
    alt: '',
    width: 604,
    height: 895,
    // A portrait file in a band that gets as wide as 4:1 shows roughly a
    // sixth of its height on a desktop, so this is the difference between
    // two faces and two foreheads. Picked by sweeping the value at 1280 and
    // 1920 and 2560 and looking: by 18 his scalp is cut at 2560, and by 5 her face
    // drops out of the band on a wide screen. 12 clears both with margin.
    focalPoint: { x: 50, y: 15 },
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
 * Guard: reference numbers must be unique positive integers.
 *
 * A duplicate would send two photographs to the same place, and it is a
 * silent failure -- nothing renders differently. `check:images` calls this so
 * the build surfaces it instead. Gaps are allowed: see the note below.
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
  // Deliberately NOT a contiguity check. When a slot is retired its number
  // retires with it and the rest keep theirs: 03 was the "Wherever You Are"
  // band, and 07 to 12 were the six per-product photographs, dropped when
  // the product sections lost their image column. A gap is the correct
  // outcome; renumbering to close it would send a photograph filed against
  // an old number to the wrong place.
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
