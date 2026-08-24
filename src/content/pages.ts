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
  licensing: {
    heading: 'Licensed and Credentialed',
    body: "Licensing and product availability vary by state. Here's where we're licensed and what we hold.",
    items: [
      { label: 'California License', value: '[[TK: CA individual license #]]' },
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
  testimonials: {
    heading: 'What Our Clients Say',
    /**
     * Deliberately unfilled. Invented client praise on an insurance site is a
     * compliance problem, not a placeholder -- the cards below it show the
     * intended shape and carry no text.
     *
     * Sourcing note, kept here rather than in the token because the token text
     * renders on the page: where testimonials come from clients outside
     * California and Texas, prefer those. Geographic spread supports the way
     * the rest of the site reads.
     */
    pending: '[[TK: testimonials — 3–4, first name + last initial]]',
  },
  /**
   * Deliberately names no state, city or region: the absence of a geography
   * list is the point. Where the agency is licensed is stated once, from the
   * real list, in the licensing disclosures.
   */
  serviceAreas: {
    heading: 'Wherever You Are',
    body: "Most of what matters in this conversation has nothing to do with where you live — what you're protecting, who depends on you, and what you want to leave behind are the same questions everywhere. Licensing and product availability do vary by state, so call and we'll tell you exactly what's available where you are.",
  },
} as const

/** Sitewide footer compliance line. Carries two unfilled license numbers. */
export const compliance =
  'Baldwin Insurance Agency. Licensed in [[TK: states licensed in]]. [[TK: CA individual license #]] · [[TK: TX individual license #]]. Products and availability vary by state. This site is for general information and is not an offer of coverage.'
