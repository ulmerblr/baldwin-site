/**
 * Single source of truth for every user-facing string on the site.
 *
 * To change site copy, edit this file only -- no component contains hardcoded
 * marketing text. See README "Changing site copy".
 *
 * The copy below is the client's approved language, transcribed verbatim from
 * the live site. It is marketing copy for a regulated industry: do not reword,
 * tighten, or "fix" it. Change it only when the client asks for a change.
 */

export const site = {
  name: 'Baldwin Life Insurance',
  legalName: 'Baldwin Life Insurance',
  domain: 'baldwinlifeinsurance.com',
  canonical: 'https://www.baldwinlifeinsurance.com/',

  meta: {
    title: 'Baldwin Life Insurance — Life Insurance & Annuities',
    description:
      'Life insurance, annuity, and retirement solutions built around your family. Personal guidance from a licensed agency with more than 25 years of experience.',
    author: 'Baldwin Life Insurance',
    keywords: [
      'life insurance agent',
      'term life insurance',
      'whole life insurance',
      'final expense insurance',
      'retirement annuity',
      'Baldwin Life Insurance',
    ],
    socialTitle: 'Baldwin Life Insurance – Life Insurance & Annuities',
    socialDescription:
      "Protect your family's financial future with life insurance and annuity solutions from Baldwin Life Insurance.",
    /**
     * The live site's OG image. NOT YET PRESENT in /public/images -- the file
     * could not be retrieved (see public/images/README.md). The OG/Twitter
     * image tags are deliberately omitted until it lands, rather than shipping
     * a tag that points at a 404.
     */
    socialImage: '/images/image-3.jpg',
  },

  contact: {
    phone: '(858) 729-0003',
    phoneHref: 'tel:+18587290003',
    email: 'chris@baldwinlifeinsurance.com',
    emailHref: 'mailto:chris@baldwinlifeinsurance.com',
    hours: 'Mon–Fri: 9am–5pm',
    phoneLabel: 'Call Us:',
    emailLabel: 'Email Us:',
    hoursLabel: 'Business Hours:',

    /**
     * Resident licence, and the only licence number the site shows.
     *
     * California is the resident state. Other states' numbers are not listed
     * -- the agency's instruction -- and the site says they can be had on
     * request instead.
     *
     * `licenseInline` is the form that sits beside a telephone number. It has
     * to, everywhere: California requires a licensee's number to appear in
     * type no smaller than the telephone number it is shown with, so the two
     * are rendered together by `LicenseLine` and never sized apart. See
     * src/components/license-line.tsx before moving either of them.
     */
    license: '0C97369',
    licenseLabel: 'CA Resident License:',
    licenseInline: 'CA Lic. #0C97369',
    licensedIn: 'All 50 states',
    otherStatesNote: 'License numbers for other states are available on request.',

    /** Public business address. Shown in the footer of every page. */
    address: '276 Carlsbad Village Drive, Unit A, Carlsbad, California 92008',
    addressLabel: 'Office:',
  },

  hero: {
    eyebrow: 'Family-Focused Protection Since Day One',
    headline: "Protect Your Family's Financial Future Without the Stress",
    subhead:
      'Get affordable life insurance, mortgage protection life insurance, and retirement solutions designed for families like yours. Led by Chris Baldwin, we put integrity and your peace of mind first.',
    primaryCta: 'Start Quote →',
    secondaryCta: 'Join Our Team',
    trustStrip: ['Free quotes in minutes', 'Licensed & trusted', 'Family-first approach'],
  },

  services: {
    heading: 'Comprehensive Protection for Every Stage of Life',
    intro:
      "From safeguarding your mortgage to securing your retirement, we offer solutions tailored to your family's unique needs.",
    items: [
      {
        title: 'Indexed Universal Life',
        description:
          'Build cash value while protecting your family. IUL policies offer growth potential tied to market indexes with downside protection and tax advantages.',
      },
      {
        title: 'Term Life / Mortgage Protection',
        description:
          "Keep your family in their home even if you can't make the payments. Protect your most valuable asset with term life coverage.",
      },
      {
        title: 'Final Expense',
        description:
          "Don't leave your family with the burden of funeral costs. Plan ahead with affordable final expense coverage.",
      },
      {
        title: 'Annuities',
        description:
          'Build a reliable income stream for retirement. Grow your savings with guaranteed, tax-deferred options.',
      },
      {
        title: 'IRA and 401(k) Rollovers',
        description:
          'Consolidate old 401(k)s and IRAs into one secure account. Simplify your retirement planning today.',
      },
      {
        title: 'Estate Planning',
        description:
          "Protect your legacy and ensure your assets are distributed according to your wishes. Plan for your family's financial future beyond your lifetime.",
      },
    ],
  },

  about: {
    eyebrow: 'Led by Chris Baldwin – 25+ Years Experience',
    heading: 'Family & Integrity Come First',
    body: "At Baldwin Life Insurance, we're not just selling policies—we're protecting families and securing financial futures. With over 25 years of experience and a commitment to putting your needs first, Chris Baldwin and our team provide personalized guidance you can trust.",
    /** Not yet present in /public/images -- see meta.socialImage above. */
    image: { src: '/images/image-3.jpg', alt: 'Advisor meeting with couple' },
    valueProps: [
      {
        title: 'Personalized Approach',
        description:
          'We take time to understand your unique situation and financial goals',
      },
      {
        title: 'Proven Results',
        description:
          'Navigate complex insurance and retirement decisions with battle-tested guidance',
      },
      {
        title: 'Family-First Values',
        description: "We treat your family's financial future like it's our own",
      },
    ],
  },

  agentOpportunity: {
    eyebrow: 'Build Your Career',
    heading: 'Join a Team That Invests in Your Success',
    intro:
      "Whether you're new to insurance or an experienced agent, Baldwin Life Insurance offers comprehensive training, mentorship, and cutting-edge AI-powered lead tools to help you thrive.",
    // The live site reads "Upload Your Resume →". There is no upload in this
    // build, so the control does not claim one.
    cta: 'Join Our Team →',
    footnote: 'Join agents who are building successful, sustainable careers',
    benefits: [
      {
        title: 'Top Producer Mentorship',
        description: 'Learn from proven, high-performing professionals',
      },
      { title: 'AI Lead Tools', description: 'Modern technology to find clients' },
      { title: 'Proven Systems', description: 'Follow our success framework' },
      { title: 'Supportive Culture', description: 'We win together as a team' },
    ],
  },

  howItWorks: {
    heading: 'How It Works',
    intro:
      'Getting the right coverage for your family is simple and stress-free with Baldwin Life Insurance',
    cta: 'Start Quote →',
    footnote: 'Takes less than 5 minutes • No obligation',
    steps: [
      {
        number: '01',
        title: 'Get Your Free Quote',
        description:
          "Fill out a quick form or give us a call. We'll gather basic information to understand your needs and budget.",
      },
      {
        number: '02',
        title: 'Review Your Options',
        description:
          "We'll present you with personalized coverage options that fit your family's situation and financial goals.",
      },
      {
        number: '03',
        title: 'Get Protected',
        description:
          "Choose your plan and we'll handle the paperwork. Your family's financial future is secured—peace of mind achieved.",
      },
    ],
  },

  forms: {
    quote: {
      title: 'Get Your Free Quote',
      description: 'An agent will contact you directly — no obligation.',
      submit: 'Submit →',
      submitting: 'Sending...',
      successTitle: "You're all set!",
      successBody: 'Thank you! One of our agents will be in touch with you shortly.',
    },
    apply: {
      title: 'Join Our Team',
      description: 'An agent will contact you directly — no obligation.',
      submit: 'Submit Application →',
      submitting: 'Sending...',
      successTitle: 'Application Received!',
      successBody: 'Thank you! One of our team members will be in touch with you shortly.',
    },
    fields: {
      name: 'Full Name',
      phone: 'Cell Phone',
      email: 'Email Address',
    },
    genericError:
      'Something went wrong on our end and your request was not sent. Please try again, or reach us directly at (858) 729-0003.',
  },

  footer: {
    blurb: 'Protecting families and building careers with integrity since day one.',
    contactLabel: 'Get In Touch',
    legalLabel: 'Legal',
  },

  legal: {
    // Placeholder text for the two legal routes, required by the build brief
    // until real policies are written. Not marketing copy.
    pendingNotice:
      'This policy is being finalized. For questions in the meantime, or to request information about how we handle your data, contact us and we will respond directly.',
  },
} as const

export type Site = typeof site
