/**
 * Single source of truth for every user-facing string on the site.
 *
 * To change site copy, edit this file only -- no component contains hardcoded
 * marketing text. See README "Changing site copy".
 *
 * NOTE: The live baldwinlifeinsurance.com site was unreachable from the build
 * environment (blocked by network egress policy), so the copy below was
 * reconstructed from the section inventory rather than lifted verbatim.
 * Section order, structure and contact details match the original; the prose
 * should be reviewed against the live site before the domain is cut over.
 */

export const site = {
  name: 'Baldwin Insurance Agency',
  legalName: 'Baldwin Insurance Agency',
  domain: 'baldwinlifeinsurance.com',
  tagline: 'Life insurance and retirement strategies built around your family.',

  contact: {
    phone: '(858) 729-0003',
    phoneHref: 'tel:+18587290003',
    email: 'chris@baldwinlifeinsurance.com',
    emailHref: 'mailto:chris@baldwinlifeinsurance.com',
    hours: 'Mon-Fri 9am-5pm',
  },

  hero: {
    eyebrow: 'Licensed in California & Texas',
    headline: 'Protect What You Have Built.',
    subhead:
      'Independent life insurance and retirement planning from an agency that has spent 25 years putting families first. Straight answers, no pressure, and coverage that actually fits your situation.',
    primaryCta: 'Start Quote',
    secondaryCta: 'Join Our Team',
  },

  products: {
    heading: 'What We Offer',
    intro:
      'Independent means we shop the whole market for you. Here is where we spend most of our time.',
    items: [
      {
        title: 'Indexed Universal Life',
        description:
          'Permanent coverage with cash value tied to market index performance, with a floor that protects you in down years. Tax-advantaged growth you can borrow against later.',
      },
      {
        title: 'Mortgage Protection',
        description:
          'Coverage sized to your mortgage balance and term, so your family keeps the house if the primary earner is gone. Often the simplest place to start.',
      },
      {
        title: 'Final Expense',
        description:
          'Smaller whole-life policies designed to cover funeral costs, medical bills and outstanding debts, so those expenses never land on your children.',
      },
      {
        title: 'Annuities',
        description:
          'Guaranteed income streams for retirement, structured for the payout and timeline you need. A predictable floor underneath the rest of your plan.',
      },
      {
        title: 'Retirement Rollovers',
        description:
          'Move an old 401(k) or IRA into a vehicle with clearer terms and downside protection, without triggering a taxable event.',
      },
      {
        title: 'Estate Planning',
        description:
          'Strategies that pass wealth to the next generation efficiently, keeping your estate out of probate and reducing what the tax bill takes.',
      },
    ],
  },

  about: {
    heading: 'Meet Chris Baldwin',
    body: [
      'Chris Baldwin has spent more than 25 years helping families and business owners make sense of life insurance and retirement income. He founded Baldwin Insurance Agency on a straightforward idea: people make good decisions when someone takes the time to explain the trade-offs honestly.',
      'As an independent agency, we are not tied to a single carrier. That means the recommendation you get is the one that fits your situation, not the one that fits a sales quota.',
    ],
    valueProps: [
      {
        title: '25+ Years of Experience',
        description:
          'Two and a half decades of writing policies, handling claims and sitting with families at the worst moments. That experience shapes every recommendation.',
      },
      {
        title: 'Independent & Objective',
        description:
          'We represent you, not a carrier. We compare offers across multiple A-rated insurers and tell you plainly which one wins and why.',
      },
      {
        title: 'No-Pressure Guidance',
        description:
          'A real conversation about what you need and what it costs. If the answer is that you already have enough coverage, we will tell you that too.',
      },
    ],
  },

  recruiting: {
    heading: 'Build a Career With Baldwin',
    intro:
      'We are hiring licensed agents and people willing to get licensed. If you want ownership of your schedule and your income, we should talk.',
    cta: 'Join Our Team',
    benefits: [
      {
        title: 'Uncapped Commission',
        description:
          'Straightforward, competitive contracts with clear advancement. What you earn is a function of what you write, not office politics.',
      },
      {
        title: 'Warm Leads Provided',
        description:
          'No cold calling strangers from a phone book. You work with people who have already raised their hand and asked about coverage.',
      },
      {
        title: 'Training & Mentorship',
        description:
          'Direct coaching from Chris and the senior team. New agents are not handed a script and left alone with it.',
      },
      {
        title: 'Work On Your Own Terms',
        description:
          'Set your own hours and work remotely. We care about the outcomes you produce, not the chair you produce them in.',
      },
    ],
  },

  howItWorks: {
    heading: 'How It Works',
    intro: 'Three steps, no obligation, and nobody shows up at your door.',
    steps: [
      {
        number: '01',
        title: 'Request Your Quote',
        description:
          'Send us your name, phone and email. It takes about thirty seconds and commits you to nothing.',
      },
      {
        number: '02',
        title: 'Talk It Through',
        description:
          'We call at a time that works for you, learn what you are trying to protect, and walk you through the realistic options.',
      },
      {
        number: '03',
        title: 'Get Covered',
        description:
          'We handle the application and the carrier paperwork, then stay reachable for as long as you hold the policy.',
      },
    ],
  },

  forms: {
    quote: {
      title: 'Start Your Quote',
      description:
        'Tell us how to reach you and we will follow up shortly. No obligation, and we never sell your information.',
      submit: 'Request My Quote',
      submitting: 'Sending...',
      successTitle: 'Request received.',
      successBody:
        'Thanks -- we have your request and will be in touch shortly during business hours.',
    },
    apply: {
      title: 'Join Our Team',
      description:
        'Tell us how to reach you and we will follow up about opportunities with the agency.',
      submit: 'Submit Application',
      submitting: 'Sending...',
      successTitle: 'Application received.',
      successBody:
        'Thanks -- we have your details and someone from the team will reach out shortly.',
    },
    fields: {
      name: 'Full name',
      phone: 'Phone number',
      email: 'Email address',
    },
    genericError:
      'Something went wrong on our end and your request was not sent. Please try again, or reach us directly at (858) 729-0003.',
  },

  footer: {
    blurb:
      'Independent life insurance and retirement planning, serving families across California and Texas.',
    hoursLabel: 'Hours',
    contactLabel: 'Contact',
    legalLabel: 'Legal',
    disclaimer:
      'Baldwin Insurance Agency is an independent insurance agency. Policy availability, rates and benefits vary by state, carrier and individual underwriting. This site is for informational purposes and is not an offer of coverage.',
  },

  legal: {
    pendingNotice:
      'This policy is being finalized. For questions in the meantime, or to request information about how we handle your data, contact us and we will respond directly.',
  },
} as const

export type Site = typeof site
