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
    title: 'Meet Chris Baldwin | Baldwin Insurance Agency',
    description:
      'Chris Baldwin has spent more than 25 years helping families protect their financial futures with life insurance and annuity solutions.',
  },
  eyebrow: 'Led by Chris Baldwin',
  heading: 'Meet Chris Baldwin',
  story: {
    heading: 'Twenty-Five Years of Putting Families First',
    paragraphs: [
      "Chris Baldwin has spent more than 25 years helping families make confident decisions about their financial futures. In that time he's learned that the best insurance conversation isn't a sales pitch — it's a conversation about what you're trying to protect and why.",
      'That belief shapes how Baldwin Insurance Agency works. Every client relationship starts with understanding your situation before anyone talks about a policy. What does your family depend on? What would change if your income stopped? What are you hoping to leave behind? The right coverage falls out of those answers, not out of a product brochure.',
    ],
  },
  approach: {
    heading: 'A Straightforward Approach',
    paragraphs: [
      "Insurance is full of language designed to be confusing. Chris takes the opposite approach — plain explanations, honest tradeoffs, and the reasoning behind every recommendation. You should understand what you're buying and why it fits, and you should never feel rushed.",
      "That's true whether you're comparing term coverage for a young family, considering an indexed universal life policy for its tax advantages, or rolling an old 401(k) into something that produces reliable retirement income.",
    ],
  },
  /**
   * The personal half of his story, supplied by the client and reproduced
   * exactly as written. No dates, job titles or employer names beyond what is
   * here -- anything more would be invented, and this is a regulated industry.
   */
  personal: {
    heading: 'From Fort Wayne to Carlsbad',
    paragraphs: [
      'Chris Baldwin came to financial services from construction management. He earned his degree from Purdue University and built the first part of his career on job sites, where the work rewarded an analytical approach and left no room for guessing. He brought that same approach with him when he changed fields, and it still shapes how he works today.',
      'He grew up in Fort Wayne, Indiana, and spent his early professional years on the East Coast. After completing his scope on the Petco Park project in San Diego, he stayed in California and started his financial services business.',
      'He is a proud father of four and has been married for years. The Midwest upbringing stuck — the straightforward manner, the belief that you tell people the truth about their options and let them decide.',
    ],
  },
  licensing: {
    heading: 'Licensed and Credentialed',
    body: "Licensing and product availability vary by state. Here's where we're licensed and what we hold.",
    items: [
      { label: 'California License', value: '0C97369' },
      { label: 'Texas License', value: '[[TK: TX individual license #]]' },
      { label: 'Agency License', value: '[[TK: agency license #, if separate]]' },
      { label: 'Certifications', value: '[[TK: designations/certifications]]' },
      { label: 'Licensed in', value: '[[TK: states licensed in]]' },
    ],
  },
  secondaryCta: 'Call (858) 729-0003',
} as const

export const productsIndex = {
  meta: {
    title: 'Life Insurance & Annuity Products | Baldwin Insurance Agency',
    description:
      'Explore life insurance, annuity, and retirement solutions from Baldwin Insurance Agency.',
  },
  heading: 'Coverage Built Around Your Family',
  intro:
    "Every family's situation is different, so every recommendation should be too. Below are the solutions we work with most. If you're not sure which fits, that's normal — start a conversation and we'll work it out together.",
  ctaLead: 'Not sure where to start?',
  ctaCall: 'or call (858) 729-0003.',
} as const

export const agentOpportunityPage = {
  meta: {
    title: 'Insurance Agent Careers | Baldwin Insurance Agency',
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
    title: 'Contact Baldwin Insurance Agency',
    description:
      'Get in touch with Baldwin Insurance Agency. Call (858) 729-0003 or request your free quote online.',
  },
  heading: "Let's Talk",
  intro:
    "Whether you're comparing coverage, reviewing a policy you already have, or exploring a career with us, we'd like to hear from you. No pressure and no obligation.",
  licensedInLabel: 'Licensed in',
  licensedIn: '[[TK: states licensed in]]',
  officeLabel: 'Office',
  office: '[[TK: office address, if public]]',
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
 * The licence numbers sit bare in a sentence here, with no labels of the kind
 * the About page's table gives them, so each one carries its state: "CA #..."
 * rather than a lone number nobody can attribute. Keep that when the Texas
 * placeholder is filled.
 */
export const compliance =
  'Baldwin Insurance Agency. Licensed in [[TK: states licensed in]]. CA #0C97369 · [[TK: TX individual license #]]. Products and availability vary by state. This site is for general information and is not an offer of coverage.'

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
    'Baldwin Insurance Agency is independent. We place coverage with a wide range of carriers, which means the recommendation fits your situation rather than a single company\'s product shelf.',
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
