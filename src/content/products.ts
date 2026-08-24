/**
 * The six product pages.
 *
 * Each page opens with its approved home-page blurb, verbatim. Rather than
 * copy those strings, `lead` is read out of `site.services.items` at module
 * load, so the card on the home page and the lead paragraph on the product
 * page can never drift apart.
 */

import type { StandaloneSlotName } from './images'
import { site } from './site'

/** Pulls the client-approved blurb for a product out of the home page copy. */
function approvedLead(approvedTitle: string): string {
  const item = site.services.items.find((service) => service.title === approvedTitle)
  if (!item) {
    throw new Error(
      `No approved blurb in site.services.items for "${approvedTitle}". ` +
        'Product leads must reuse the approved home page copy verbatim.',
    )
  }
  return item.description
}

export type Product = {
  slug: string
  href: string
  /** H1 and card title. Matches the approved home page card title. */
  title: string
  /** Shorter label for the nav dropdown. */
  navLabel: string
  /** Always a Type A slot: the product photo is contained, nothing overlays it. */
  imageSlot: StandaloneSlotName
  meta: { title: string; description: string }
  /** Approved home page blurb, verbatim. */
  lead: string
  howItWorks: string
  whoItsFor: readonly string[]
  whatToConsider: string
}

export const products: readonly Product[] = [
  {
    slug: 'indexed-universal-life',
    href: '/products/indexed-universal-life',
    title: 'Indexed Universal Life',
    navLabel: 'Indexed Universal Life',
    imageSlot: 'product-indexed-universal-life',
    meta: {
      title: 'Indexed Universal Life Insurance | Baldwin Insurance Agency',
      description:
        'Indexed universal life insurance offers growth potential tied to market indexes with downside protection.',
    },
    lead: approvedLead('Indexed Universal Life'),
    howItWorks:
      'An IUL is permanent life insurance with a cash value component. Part of your premium funds the death benefit; the rest goes into an account that credits interest based on the performance of a market index. When the index rises, your account is credited up to a cap. When it falls, a floor protects you — typically at zero, so a down year doesn\'t reduce what you\'ve built.',
    whoItsFor: [
      'Families who want permanent coverage rather than a policy that expires',
      'People who\'ve maxed out other tax-advantaged accounts',
      'Anyone who wants market-linked growth without direct market risk',
      'Business owners planning for succession or key-person coverage',
    ],
    whatToConsider:
      'Caps limit your upside in strong years, and the policy has costs that come out of cash value. IUL rewards patience — it works best when funded consistently over a long horizon. It\'s a poor fit if you need maximum death benefit per dollar today; term does that better.',
  },
  {
    slug: 'mortgage-protection',
    href: '/products/mortgage-protection',
    title: 'Mortgage Protection Life Insurance',
    navLabel: 'Mortgage Protection',
    imageSlot: 'product-mortgage-protection',
    meta: {
      title: 'Mortgage Protection Life Insurance | Baldwin Insurance Agency',
      description:
        'Mortgage protection life insurance helps keep your family in their home.',
    },
    lead: approvedLead('Mortgage Protection Life Insurance'),
    howItWorks:
      'This is term life insurance sized to your mortgage. If you die during the term, the benefit gives your family the means to pay off the loan or keep making payments. The money goes to your beneficiary, not the lender — so they decide what to do with it.',
    whoItsFor: [
      'New homeowners with a large balance and years left on the loan',
      'Single-income households where the mortgage depends on one earner',
      'Families whose employer coverage wouldn\'t cover the house',
      'Anyone whose main worry is their family staying in the home',
    ],
    whatToConsider:
      'Coverage ends when the term does, so match the term to your remaining years. It\'s not a separate product category so much as term life with a specific job — if you have other needs too, one larger policy is often simpler and cheaper than several small ones.',
  },
  {
    slug: 'final-expense',
    href: '/products/final-expense',
    title: 'Final Expense',
    navLabel: 'Final Expense',
    imageSlot: 'product-final-expense',
    meta: {
      title: 'Final Expense Insurance | Baldwin Insurance Agency',
      description:
        'Affordable final expense coverage so your family isn\'t left with funeral costs.',
    },
    lead: approvedLead('Final Expense'),
    howItWorks:
      'A small permanent life policy — usually between $5,000 and $25,000 — meant to cover funeral costs, burial or cremation, and the bills that arrive in the weeks after a death. Premiums stay level, coverage doesn\'t expire, and qualifying is typically much easier than for a larger policy. Many are issued with a few health questions and no exam.',
    whoItsFor: [
      'Older adults who no longer need income replacement',
      'Anyone who\'s been declined for larger coverage',
      'People who want funeral costs handled rather than left to their kids',
      'Families without savings set aside for end-of-life expenses',
    ],
    whatToConsider:
      'Cost per dollar of coverage is higher than a fully underwritten policy, which is the tradeoff for easier approval. Some policies have a waiting period before full benefits apply. If you\'re in good health and need meaningful coverage, look at term or whole life first.',
  },
  {
    slug: 'annuities',
    href: '/products/annuities',
    title: 'Annuities',
    navLabel: 'Annuities',
    imageSlot: 'product-annuities',
    meta: {
      title: 'Annuities & Retirement Income | Baldwin Insurance Agency',
      description:
        'Build reliable retirement income with annuity solutions.',
    },
    lead: approvedLead('Annuities'),
    howItWorks:
      'You contribute — in a lump sum or over time — and the money grows tax-deferred. Later you convert it into income, either for a set period or for the rest of your life. That second option is what makes annuities distinctive: an income stream that doesn\'t stop because you lived longer than expected.',
    whoItsFor: [
      'People approaching retirement who want income they can count on',
      'Savers who\'ve filled up their 401(k) and IRA contributions',
      'Anyone worried about outliving their savings',
      'Retirees who want a stable base underneath their other investments',
    ],
    whatToConsider:
      'Annuities are long-term commitments. Most carry surrender charges if you withdraw early, and terms vary widely between products. Guarantees depend on the issuing insurance company\'s financial strength. Read the surrender schedule before you sign anything — this is the product where the fine print matters most.',
  },
  {
    slug: 'retirement-rollovers',
    href: '/products/retirement-rollovers',
    title: 'Retirement Rollovers',
    navLabel: 'Retirement Rollovers',
    imageSlot: 'product-retirement-rollovers',
    meta: {
      title: '401(k) & IRA Rollovers | Baldwin Insurance Agency',
      description:
        'Consolidate old 401(k)s and IRAs into one account.',
    },
    lead: approvedLead('Retirement Rollovers'),
    howItWorks:
      'When you leave a job, the retirement account stays behind. A rollover moves it into an IRA or another qualified account you control. Done as a direct transfer, it isn\'t a taxable event — the money never passes through your hands.',
    whoItsFor: [
      'Anyone with retirement accounts at former employers',
      'People who\'ve changed jobs several times and lost track',
      'Savers who want fewer statements and one clear picture',
      'Anyone whose old plan has limited options or high fees',
    ],
    whatToConsider:
      'Rollovers have rules, and getting them wrong is expensive. A direct trustee-to-trustee transfer avoids withholding and the 60-day deadline that trips people up. Old employer plans sometimes have advantages worth keeping — institutional pricing, or better creditor protection in some states. Compare before you move.',
  },
  {
    slug: 'estate-planning',
    href: '/products/estate-planning',
    title: 'Estate Planning',
    navLabel: 'Estate Planning',
    imageSlot: 'product-estate-planning',
    meta: {
      title: 'Estate Planning & Legacy Protection | Baldwin Insurance Agency',
      description:
        'Protect your legacy and plan for your family\'s future.',
    },
    lead: approvedLead('Estate Planning'),
    howItWorks:
      'Estate planning decides what happens to what you\'ve built. Life insurance does specific jobs inside that plan: it creates liquidity so heirs aren\'t forced to sell property to cover taxes or debts, it equalizes inheritances when the main asset is a house or a business that can\'t be split, and it can fund a trust on your terms.',
    whoItsFor: [
      'Families whose wealth is concentrated in property or a business',
      'Parents who want to leave children equal shares of unequal assets',
      'Anyone supporting a family member with long-term needs',
      'People who want their wishes followed without a court deciding',
    ],
    whatToConsider:
      'This is where insurance meets law and tax, and no one profession covers all of it. We work alongside your attorney and CPA rather than in place of them. Baldwin Insurance Agency does not provide legal or tax advice.',
  },
]

export const productBySlug = new Map(products.map((product) => [product.slug, product]))

/**
 * Home page and overview cards are driven by the approved `site.services.items`
 * list; this maps each of those titles to the page it now links to.
 */
export const productByApprovedTitle = new Map(products.map((product) => [product.title, product]))

/** Section labels and the shared footer line, common to all six pages. */
export const productPage = {
  howItWorksLabel: 'How it works',
  whoItsForLabel: 'Who it\'s for',
  whatToConsiderLabel: 'What to consider',
  learnMore: 'Learn More →',
  disclaimer:
    'Coverage options, availability, and terms vary by state and by individual circumstances. This page is general information, not a recommendation. Talk with a licensed agent about what fits your situation.',
} as const
