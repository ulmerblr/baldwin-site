/**
 * Copy for the pages added in the multi-page expansion.
 *
 * The home page's own copy stays in `site.ts` -- that file is the client's
 * approved language and is not edited here. Where a new page reuses approved
 * copy (the About story, the recruiting pitch, the six product blurbs) it
 * reads it out of `site` rather than restating it.
 *
 * A TK placeholder marks a real-world fact nobody has supplied yet -- license
 * numbers, credentials, testimonials. These render as a visible placeholder
 * chip and MUST NOT be guessed at or quietly dropped. `npm run check:tk`
 * fails while any remain; see README "Placeholders".
 */

export const about = {
  meta: {
    title: 'Meet Chris Baldwin | Baldwin Life Insurance',
    description:
      'Chris Baldwin has spent more than 25 years helping families protect their financial futures with life insurance and annuity solutions.',
  },
  eyebrow: 'Led by Chris Baldwin',
  heading: 'Meet Chris Baldwin',
  /**
   * The bio, in one piece.
   *
   * It used to be two sections with two headings: an opening one, and this
   * one. The client cut the opening down over four passes until it was a
   * heading over a single sentence, which reads as something that got
   * truncated rather than something written short. That sentence is now the
   * first line here and the spare heading is gone -- no wording changed, it
   * only moved.
   *
   * Split into `professional` and `personal` because the page renders them
   * as two bands and the split is the point: the studio portrait sits with
   * the working half, the family snapshot with the home half, and the
   * change of ground between them is what makes the change of register look
   * deliberate. The second band deliberately carries no heading of its own
   * -- it is a continuation, and inventing a title for it would be adding
   * words nobody asked for.
   *
   * Reordered earlier at the client's request to run in the order it
   * happened -- Fort Wayne, Purdue, a decade in construction management,
   * then the brokerage. The decade and the fact that he owns the brokerage
   * came with that instruction and are theirs. The closing paragraph is
   * their own text, supplied whole and reproduced verbatim: the pets, the
   * exclamation mark and the serial commas are all as written.
   *
   * Sentences cut along the way and not to be restored: "He is a proud
   * father of four and has been married for years", the Midwest-upbringing
   * line, "That belief shapes how Baldwin Life Insurance works" with its
   * four questions, and "In that time he's learned that the conversation
   * that matters starts with what you're trying to protect, and why."
   * Still no dates, job titles or employer names beyond what the client has
   * supplied; this is a regulated industry and an invented detail is worse
   * than a missing one.
   */
  bio: {
    heading: 'From Fort Wayne to Carlsbad',
    professional: [
      'Chris Baldwin has spent more than 25 years helping families make confident decisions about their financial futures.',
      'Chris Baldwin grew up in Fort Wayne, Indiana, and earned his degree from Purdue University. He spent his early professional years on the East Coast and the first decade of his career in construction management, on job sites where the work rewarded an analytical approach and left no room for guessing.',
      'After completing his scope on the Petco Park project in San Diego, he stayed in California and found his passion owning an insurance and financial services brokerage. He brought that same analytical approach with him when he changed fields, and it still shapes how he works today.',
    ],
    personal: [
      'Outside of his professional life, he enjoys spending time with his wife and their four grown children. Their home in Carlsbad is also shared with a lively collection of pets, including a dog, cat, a giant tortoise, and chickens! An avid outdoor enthusiast and adventurer, he enjoys hiking, skiing, scuba diving, and exploring destinations around the world. Whether spending time with family, enjoying the outdoors, or traveling internationally, he embraces life to the fullest.',
    ],
  },
  licensing: {
    heading: 'Licensed and Credentialed',
    body: "Licensing and product availability vary by state. Here's where we're licensed and what we hold.",
    /**
     * Resident licence only. Other states' numbers came out at the agency's
     * instruction -- the site says they are available on request instead of
     * listing them, which is also what the Contact page says.
     *
     * The Agency License and Certifications rows were deleted rather than
     * left as placeholders: the agency has not supplied either, and a row
     * whose value is a visible [[TK]] chip tells a visitor less than no row
     * at all. If those values ever arrive, add the rows back -- do not
     * reintroduce them empty in the meantime.
     */
    items: [
      { label: 'California Resident License', value: '0C97369' },
      { label: 'Licensed in', value: 'All 50 states' },
      { label: 'Other states', value: 'License numbers available on request' },
    ],
  },
  secondaryCta: 'Call (858) 729-0003',
} as const

export const productsIndex = {
  meta: {
    title: 'Life Insurance & Annuity Products | Baldwin Life Insurance',
    description:
      'Explore life insurance, annuity, and retirement solutions from Baldwin Life Insurance.',
  },
  heading: 'Coverage Built Around Your Family',
  intro:
    "Every family's situation is different, so every recommendation should be too. Below are the solutions we work with most. If you're not sure which fits, that's normal — start a conversation and we'll work it out together.",
  ctaLead: 'Not sure where to start?',
  ctaCall: 'or call (858) 729-0003.',
} as const

export const agentOpportunityPage = {
  meta: {
    title: 'Insurance Agent Careers | Baldwin Life Insurance',
    description:
      'Join a team that invests in your success. Training, mentorship, and AI-powered lead tools for new and experienced agents.',
  },
  theWork: {
    heading: 'What the Work Actually Looks Like',
    body: "Insurance sales is a relationship business. You'll spend your time talking with families about what they're trying to protect, explaining options in plain language, and helping people make decisions they feel good about. The agents who do well here are curious, patient, and comfortable with the fact that not every conversation ends in a sale.",
  },
  whereYouCanBuild: {
    heading: 'Where You Can Build',
    body: "Our agents work with families across the country. If you're licensed, we'll help you put that license to work. If you're not yet, we'll help you get there and show you which states make sense to add as you grow.",
  },
  whoWereLookingFor: {
    heading: "Who We're Looking For",
    items: [
      'People new to insurance who want real training rather than a script',
      'Licensed agents looking for better support and better leads',
      'Career changers from teaching, service, or sales backgrounds',
      'Anyone willing to learn the business properly',
    ],
    closing:
      "You don't need a license to start the conversation. If you're serious and coachable, we'll help you get there.",
  },
  howToApply: {
    heading: 'How to Apply',
    body: "Send us your details and we'll be in touch. If it looks like a fit, we'll set up a conversation — no pressure, no obligation.",
  },
} as const

export const contact = {
  meta: {
    title: 'Contact Baldwin Life Insurance',
    description:
      'Get in touch with Baldwin Life Insurance. Call (858) 729-0003 or request your free quote online.',
  },
  heading: "Let's Talk",
  intro:
    "Whether you're comparing coverage, reviewing a policy you already have, or exploring a career with us, we'd like to hear from you. No pressure and no obligation.",
  licensedInLabel: 'Licensed in',
  officeLabel: 'Office',
} as const

/** Two new bands on the home page. Everything already there stays. */
export const homeAdditions = {
  /**
   * Real client testimonials, supplied by the agency and used verbatim.
   * These are regulated advertising on an insurance site: do not edit,
   * tighten, paraphrase or add to them, and do not invent more.
   */
  testimonials: {
    heading: 'What Our Clients Say',
    items: [
      {
        line: 'Mortgage protection',
        name: 'Patty C.',
        state: 'California',
        quote:
          'Thank you, Chris, for finding a great fit for my life insurance needs. Affordable and will protect my family in case something happens to me.',
      },
      {
        line: 'Annuities',
        name: 'Lawrence W.',
        state: 'Arizona',
        quote:
          'Having a lifetime income stream that takes care of budgeting for my retirement has put my mind at ease. Thank you, Chris.',
      },
      {
        line: 'Final expense',
        name: 'Elizabeth F.',
        state: 'Washington',
        quote:
          "Chris provided me a policy that was affordable and puts my mind at ease, knowing my family won't have to generate funds to take care of my final expense and funeral costs.",
      },
    ],
  },
} as const

/**
 * Sitewide footer compliance line.
 *
 * Deliberately carries NO licence number. It renders at text-xs, and the
 * telephone number a few centimetres above it in the same footer renders at
 * text-sm -- California wants the licence number no smaller than the phone
 * number it appears with, so a copy of it down here would be the one place on
 * the site that breaks the rule. The number is shown at the right size in the
 * contact column instead, by `LicenseLine`. Say licensing *status* here; put
 * the number next to a phone number.
 */
export const compliance =
  'Baldwin Life Insurance. Licensed in all 50 states; license numbers for states other than California are available on request. Products and availability vary by state. This site is for general information and is not an offer of coverage.'

/**
 * Carriers the agency places business with.
 *
 * Names exactly as supplied by the client. These stay the authoritative
 * version of this list: live text, searchable, read correctly aloud, and
 * readable at every width.
 *
 * This list was originally names ONLY, on the grounds that the agency held
 * no usage rights to the carrier marks and an insurance site showing them
 * without permission is a trademark problem rather than a design choice.
 * The client has since supplied a logo directory sheet and asked for it on
 * the page, so it is rendered under the names on /products. That is the
 * client's call to make and it has been made -- but the original reasoning
 * has not stopped being true, so whoever maintains this should know that the
 * permission question was never answered, only overtaken. The sheet carries
 * its own "names and marks are the property of their respective owners"
 * line, which is the usual disclaimer and not the same thing as a licence.
 */
export const carriers = {
  heading: 'Carriers We Represent',
  intro:
    'Baldwin Life Insurance is independent. We place coverage with a wide range of carriers, which means the recommendation fits your situation rather than a single company\'s product shelf.',
  footnote: 'Carrier availability varies by state and by product.',
  names: [
    'AIG/Corebridge Financial',
    'Aflac',
    'Allianz',
    'American Amicable/Occidental',
    'American Equity',
    'Americo',
    'Ameritas',
    'Annexus',
    'Assurity',
    'Athene',
    'Baltimore Life',
    'Citizens/CICA Life',
    'Clear Spring Life & Annuity',
    'Columbian Life Group (CFG)',
    'Columbus Life',
    'F&G Life',
    'Foresters Financial',
    'Guarantee Trust Life',
    'Guaranty Income Life (GILICO)',
    'Liberty Bankers',
    'Lincoln Financial',
    'Mutual of Omaha',
    'Nassau Re',
    'National Life Group',
    'North American',
    'Ohio State Life',
    'Royal Neighbors',
    'SILAC Insurance Company',
    'Sagicor',
    'TransAmerica',
    'Washington National',
  ],
} as const
