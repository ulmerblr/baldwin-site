import Image from 'next/image'

/**
 * The Baldwin Life Insurance logo: angel wings flanking the wordmark, with
 * EST. 1999 above and LOVE MY LIFE INSURANCE below.
 *
 * Distinct from `BrandMark`, which is the Baldwin Insurance Agency shield that
 * identifies the header. Both appear on the interior pages -- the shield on
 * the left as the site's identity, this mark reduced on the right.
 *
 * TRANSPARENCY. The supplied artwork is navy line art flat on pure white with
 * no alpha channel, so dropped onto any ground that is not pure white it shows
 * as a white card -- and this site's ground is #FAF9F6, which is not pure
 * white. The committed file is un-composited: the white is gone and the ink
 * carries its own coverage in an alpha channel, so the mark sits on the page
 * ground rather than on a tile of its own. The build does not do this; the
 * asset is already correct. Do not replace it with a flattened export.
 *
 * SIZE. It is a detailed illustrative mark -- hatched feathers and three
 * separate lines of type -- so it does not survive being made small. The
 * header instance is deliberately as large as a sticky header can carry, and
 * the home page gets a band of its own instead.
 */

const LOGO_SRC = '/images/baldwin-life-insurance-logo.webp'
/** Intrinsic size of the committed asset, after trimming its white margin. */
const LOGO_W = 1000
const LOGO_H = 785

export const BRAND_LOGO_ALT = 'Baldwin Life Insurance'

/**
 * The reduced header instance. Sized by height, because what has to stay
 * constant across the header is the row, not the mark's width.
 */
export function BrandLogoMini({ className = '' }: { className?: string }) {
  return (
    <Image
      src={LOGO_SRC}
      alt={BRAND_LOGO_ALT}
      width={LOGO_W}
      height={LOGO_H}
      // Rendered at roughly 60px wide; ask for twice that so it stays crisp
      // on a 2x screen without shipping the full-size file to a phone.
      sizes="70px"
      className={`w-auto ${className}`}
    />
  )
}

/**
 * The home page instance. Large enough that the smallest printed line --
 * LOVE MY LIFE INSURANCE -- still reads, which is what sets the floor here.
 */
export function BrandLogoFull({ className = '' }: { className?: string }) {
  return (
    <Image
      src={LOGO_SRC}
      alt={BRAND_LOGO_ALT}
      width={LOGO_W}
      height={LOGO_H}
      sizes="(min-width: 640px) 448px, 100vw"
      className={`h-auto w-full ${className}`}
    />
  )
}
