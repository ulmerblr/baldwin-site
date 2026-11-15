import { site } from '@/content/site'

/**
 * The licence number, rendered beside a telephone number.
 *
 * WHY THIS IS A COMPONENT AND NOT A STRING. California requires a licensee to
 * show the licence number in type no smaller than the telephone number it is
 * displayed with. That is a relationship between two elements, and a
 * relationship is the kind of thing that rots quietly: someone changes the
 * phone number's size in one place six months from now and nothing visibly
 * breaks. So the pairing is made structural instead.
 *
 * THE RULE THIS COMPONENT KEEPS: it sets no font size of its own. It inherits
 * one. Place it inside the same sized context as the telephone number it
 * accompanies -- a sibling of the phone link, or the next item in the same
 * list -- and the two sizes cannot drift apart, because there is only one
 * size. Do not add a `text-*` size class here or to the element you put it in
 * unless the phone number carries the identical class.
 *
 * Every place a telephone number appears has one of these next to it: the
 * header, the footer, the contact page, the closing call-to-action band, the
 * legal pages, and the lead form. If you add a seventh, add one here too.
 */
export function LicenseLine({ className = '' }: { className?: string }) {
  return (
    <span data-license="" className={`whitespace-nowrap ${className}`}>
      {site.contact.licenseInline}
    </span>
  )
}
