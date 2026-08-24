# Baldwin Insurance Agency — marketing site

Next.js App Router site for [baldwinlifeinsurance.com](https://www.baldwinlifeinsurance.com/),
deployed on Vercel. Everything is statically rendered except two API routes, which
exist to take a form submission and turn it into an email.

**The one job of this site is to submit two forms and have them actually arrive.**
If you change anything here, that is the thing not to break.

---

## Local development

```bash
npm install
cp .env.example .env.local   # then fill in the two required values
npm run dev                  # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build; must finish with no warnings
npm run start      # serve the production build locally
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npm run check:tk   # fails while any [[TK:]] placeholder is unfilled
```

Node 22 or newer.

---

## Environment variables

Set in **Vercel → Project → Settings → Environment Variables**. Locally they go in
`.env.local`, which is gitignored. Never commit real values.

| Variable | Required | Where it comes from |
| --- | --- | --- |
| `RESEND_API_KEY` | yes | [resend.com](https://resend.com) → API Keys. Already set in Vercel. |
| `NOTIFY_EMAIL` | yes | The inbox that receives form notifications. Already set in Vercel. |
| `NOTIFY_FROM` | no | A verified Resend sender, e.g. `Baldwin Site <no-reply@baldwinlifeinsurance.com>`. Defaults to Resend's shared `onboarding@resend.dev`, which works before the domain is verified. |
| `ATS_INTAKE_URL` | no | Unset today. Setting it turns on application forwarding — see [Seams](#seams-built-but-not-wired). |
| `ATS_SHARED_SECRET` | no | Auth for the above. |

> **Env vars are read at build time.** Changing one in Vercel does not affect the
> running site until you redeploy. Change the value, then trigger a redeploy.

If `RESEND_API_KEY` or `NOTIFY_EMAIL` is missing, submissions **fail loudly** with an
error the user can see. They are never silently accepted and dropped.

---

## Changing site copy

**All user-facing text lives in [`src/content/`](src/content).** No component contains
hardcoded marketing copy. Edit the right file and push; the change is live on the next
deploy.

| File | What is in it |
| --- | --- |
| [`site.ts`](src/content/site.ts) | The home page, in the client's approved words: `meta`, `contact`, `hero`, `services`, `about`, `agentOpportunity`, `howItWorks`, `forms`, `footer`, `legal`. |
| [`pages.ts`](src/content/pages.ts) | The pages added later: About, the products overview, Agent Opportunity, Contact, the two new home page bands, and the footer compliance line. |
| [`products.ts`](src/content/products.ts) | The six product pages. Each one's lead paragraph is read out of `site.services.items`, so a card and its page cannot drift apart. |
| [`nav.ts`](src/content/nav.ts) | Header and footer navigation, including the Products dropdown. |
| [`images.ts`](src/content/images.ts) | Photography slots — see [Images](#images). |

> ⚠️ **The copy is the client's approved marketing language, transcribed verbatim
> from the live site.** This is a regulated industry: do not reword, tighten, or
> "fix" its grammar. Change it only when the client asks for a change.

**Still missing: `image-3.jpg`.** The live site's one photograph could not be
downloaded — the build environment blocks `baldwinlifeinsurance.com`. The About
section image and the OG/Twitter image tags are omitted rather than shipped
broken. See [`public/images/README.md`](public/images/README.md) for the
two-line fix once the file is added.

---

## Placeholders

Some facts nobody has supplied yet — license numbers, professional designations,
client testimonials, the office address — are written in the content files as
`[[TK: ...]]` tokens. They render on the page as a visible muted chip carrying the
token text.

**That is deliberate and it is not a bug.** These are regulated advertising claims on
an insurance site: a plausible-looking invented license number is materially worse
than an obvious blank. Nothing guesses at them, and nothing quietly drops the sentence
around them.

```bash
npm run check:tk     # exits 1 and lists every unfilled token, with file:line
```

Run it before go-live. A clean pass means every supplied-later fact has a real value.

`prebuild` runs the same check in `--warn` mode: it prints the same list in a banner on
every build but exits 0, so the site still deploys while it is pre-launch. Move it to
the hard check (drop `--warn`) once the values land, if you want the build itself to
guard them.

The tokens live in [`src/content/pages.ts`](src/content/pages.ts). Replace the token
with the real value — no other edit is needed.

> `[[TK: states licensed in]]` is load-bearing. The site deliberately names no state
> in any title, description, heading or body: where the agency is licensed is stated
> **only** in the licensing disclosures, from that one list. Do not substitute
> "nationwide" or "all 50 states" for it — if it is unfilled, the placeholder ships.
> Two related claims are left out of the machine-readable layer for the same reason
> and should be restored from the real list once it exists: `areaServed` in the
> home page's structured data, and the `geo.*` meta tags in the root layout.

---

## Design system

Light theme. Navy is structure and text; gold is the accent. Tokens live in
[`src/app/globals.css`](src/app/globals.css) and every colour below is
machine-checked against WCAG AA.

| Token | Hex | Use |
| --- | --- | --- |
| `--color-paper` | `#FAF9F6` | page ground — warm off-white, deliberately not `#FFF` |
| `--color-surface` | `#FFFFFF` | cards and raised panels only, to read against paper |
| `--color-line` | `#E5E2DA` | hairline rules, which do most of the separating |
| `--color-ink` | `#101E33` | headings; the existing brand navy |
| `--color-body` | `#3D4757` | body text |
| `--color-muted` | `#68707E` | secondary text and labels |
| `--color-gold-deep` | `#8B6816` | **small text and links** — 4.88:1 on paper |
| `--color-gold` | `#A67C1A` | large text (≥24px), borders, rules — 3.61:1 |
| `--color-gold-bright` | `#C9A227` | brand gold: **fills and large elements only** |
| `--color-gold-wash` | `#FBF6E8` | subtle accent bands |

> **Three golds, on purpose.** The brand gold is 2.30:1 on paper — a fill, never a
> text colour. The mid gold clears the 3:1 that large text and non-text UI need, but
> not the 4.5:1 that normal-size text needs. So anything small and textual uses
> `--color-gold-deep`. Buttons are a gold fill with `--color-ink` text, never white.

**Type — two families, no third.** Display is **Source Serif 4**: a transitional
serif drawn for screen, carrying the "established agency" signal. Body is **Inter**,
a neutral grotesque that holds up at the small sizes where most of this site's words
live; tracking is tightened at display sizes so it never reads as a default stack.
Both are self-hosted through `next/font` — no runtime request to Google.

**Surfaces.** Hairline rules in `--color-line` do the separating. There is exactly
one elevation level (`.raised`), used sparingly. Body copy is constrained to ~68
characters with `.measure`.

**Focus.** Re-derived for light: a 2px ink ring with a paper halo, so it stays
visible on gold fills and on photography alike. `.on-dark` inverts it for anything
sitting on an overlay scrim. It is never removed.

---

## Images

Every photograph on the site resolves through a **named slot** in
[`src/content/images.ts`](src/content/images.ts). Components render
`<ImageSlot name="chris-portrait" />` or `<OverlayImage name="home-hero">…</OverlayImage>`
and never mention a file path.

No real photography has been supplied yet, so each slot draws a neutral placeholder
at that slot's exact aspect ratio — so nothing on the page moves when a real file
lands. **There is no stock photography and no generated imagery in this repo, and
nothing has been copied from any other site.**

To drop a real photo in:

1. Save the file under `public/images/`.
2. In `src/content/images.ts`, set that slot's `src` (and its `alt`, where the image
   is not decorative).

That is the whole change — no component is touched.

### Two slot types

|  | Type A — `standalone` | Type B — `overlay` |
| --- | --- | --- |
| What it is | A contained image; nothing sits on top | A wide background with text and buttons over it |
| Renders with | `<ImageSlot>` | `<OverlayImage>` |
| Extra config | — | `scrim` |

The distinction is structural, not cosmetic: a Type B slot has to carry a scrim, a
focal point, and text contrast that survives whatever photograph lands in it later.

**Type A (10):** `chris-portrait`, `about-secondary`, `product-<slug>` ×6,
`agent-team`, `family`.

**Type B (5):** `home-hero`, `about-header`, `products-header`, `agent-header`,
`contact-header`.

Every slot also carries a `focalPoint` (`{x, y}` percentages, straight onto
`object-position`) so the subject stays framed as the crop narrows — a portrait with
the face high in frame keeps the face, rather than centring on a collar.

### The scrim, and why it has a floor

Text over photography is where sites fail accessibility silently: a photo that is
dark on one side and bright on the other breaks contrast on half the viewports, and
nothing warns you.

So every Type B slot renders a scrim **whether or not a photograph exists yet** —
overlay text is contrast-testable today rather than the day the photos arrive. The
scrim is a single gradient running from the slot's requested `opacity` down to
`SCRIM_FLOOR` (0.70), never below it:

- 0.70 ink over a *pure white* photo — the worst case a real photograph can approach
  — composites to `#586270`, carrying `--color-overlay-text` at **5.87:1**, clear of
  the 4.5:1 AA floor.
- Because the floor applies to the whole frame rather than just the gradient's dark
  end, a crop that shifts at 360px cannot move text onto a bright patch.

Do not lower `SCRIM_FLOOR` without re-running the contrast check. And note the
tempting mistake it avoids: a flat base tint *plus* a directional gradient
double-composites (0.70 under 0.82 is an effective 0.95) and would bury the
photograph entirely.

Overlay text colour is `--color-overlay-text` (`#FAF9F6`) — warm white rather than
pure white, so it belongs to the same palette as the paper ground.

## How deploys work

Vercel is Git-connected to this repo. **Push to `main` and it deploys.** There is no
build step to run by hand and no deploy button to click.

```bash
git add -A
git commit -m "your message"
git push -u origin main
```

Two things to know:

- **Commit author email must be `billulmer@majiktool.com`.** Vercel blocks deploys from
  other authors. Check with `git config user.email` before your first commit on a new
  machine.
- Branch protection is deliberately off to keep this loop one step.

---

## Architecture

```
src/
  app/
    page.tsx              home page — composes the sections
    layout.tsx            sitewide metadata and OG defaults
    about/                Meet Chris Baldwin
    products/             overview + [slug]/ for the six product pages
    agent-opportunity/    recruiting
    contact/              contact details and both CTAs
    privacy/, terms/      real legal routes (no dead links anywhere)
    sitemap.ts            built from nav.ts + products.ts, so it cannot go stale
    api/quote/route.ts    POST — quote form
    api/apply/route.ts    POST — application form
  components/
    site-shell.tsx        header + footer + dialog provider, used by every page
    site-header.tsx       nav, incl. the keyboard-navigable Products dropdown
    sections.tsx          the home page bands
    page-sections.tsx     shared furniture for the interior pages
    image-slot.tsx        named photography slots (see Images)
    tk.tsx                renders unfilled [[TK:]] facts as visible chips
    modal.tsx, lead-*.tsx the modal/form client island
  content/                ← all copy lives here (see Changing site copy)
  lib/
    seo.ts                canonical URLs and per-page title/description
    validate.ts           server-side validation and sanitization
    rate-limit.ts         in-memory per-IP limiter
    notify.ts             the notification seam (email today, ATS later)
    handle-submission.ts  shared pipeline for both endpoints
scripts/
  check-placeholders.mjs  the [[TK:]] gate — see Placeholders
```

### Routes

All eleven marketing routes are statically rendered at build time.

```
/                                   /agent-opportunity
/about                              /contact
/products                           /privacy    (noindex)
/products/indexed-universal-life    /terms      (noindex)
/products/mortgage-protection
/products/final-expense
/products/annuities
/products/retirement-rollovers
/products/estate-planning
```

Both endpoints always answer with JSON in one of exactly two shapes:

```json
{ "ok": true }
{ "ok": false, "error": "human-readable message" }
```

Internal errors are logged server-side and never returned to the browser.

### Abuse protection

- **Honeypot** — a hidden `company_website` field, removed from the accessibility tree
  and out of the tab order. Filled in ⇒ rejected server-side.
- **Rate limit** — 5 submissions per IP per 10 minutes, in-memory. Chosen over Redis
  because this site takes a handful of submissions a day and a shared store would add a
  network dependency and another failure mode to the one thing that has to work. The
  honest limit: serverless instances are ephemeral and can scale out, so this is a speed
  bump for casual abuse, not a security control. Swap the body of `rateLimit()` if volume
  ever justifies it — the call signature is all the handlers depend on.
- **Server-side validation** — every field is re-parsed from the raw body. Phone is
  stripped to digits and must be 10+. Email must pass a format check that also rejects
  header-injection attempts, since the value becomes an email `replyTo`.

---

## Seams (built, but not wired)

Two features are coming. Each should be a small additive change, not a rewrite.

**Resume upload** — will use Vercel Blob with client-side upload and signed URLs.
`Submission` in [`src/lib/notify.ts`](src/lib/notify.ts) already carries an optional
`resumeUrl`, and the email body renders it when present. The application form's submit
handler builds its payload as an object, so an extra field drops in.
*There is no upload in this build, and no CTA anywhere claims otherwise.*

**ATS forwarding** — a separate PHP/MariaDB ATS will eventually receive applications.
All notification logic sits behind `notify()`. `forwardToAts()` reads `ATS_INTAKE_URL`
and returns immediately when it is unset — the state we ship in. The commented block
inside it marks exactly where the forwarding POST goes. The payload shape is
deliberately not designed yet.

---

## Pointing the domain at this site

> **Documentation only — do not execute any of this as part of a code change.**
> `baldwinlifeinsurance.com` currently serves live traffic from GoDaddy shared hosting.
> No custom domain is configured in Vercel and no DNS record has been touched. Cutover
> is a separate, human-approved step.

When someone decides to cut over, the sequence is:

1. **Verify the Vercel deployment first.** Submit both forms on the `*.vercel.app` URL
   and confirm the emails arrive. Do not touch DNS before this passes.
2. **Add the domain in Vercel** — Project → Settings → Domains → add
   `baldwinlifeinsurance.com` and `www.baldwinlifeinsurance.com`. Vercel will show the
   exact records it wants; those override the table below if they differ.
3. **Lower the TTL at GoDaddy** to 600 seconds a day ahead, so a rollback is fast.
4. **Update the records** in GoDaddy → Domain → DNS:

   | Type | Name | Value | TTL |
   | --- | --- | --- | --- |
   | `A` | `@` | `76.76.21.21` | 600 |
   | `CNAME` | `www` | `cname.vercel-dns.com` | 600 |

   Remove the old GoDaddy hosting `A`/`CNAME` records for `@` and `www`. Leave `MX`,
   `TXT` (SPF/DKIM/verification) and any other subdomain records **alone** — touching
   `MX` will break email.
5. **Wait for propagation**, then confirm HTTPS resolves and both forms still submit.
6. **Raise the TTL back** to 1 hour once it is stable.

Rollback is putting the original GoDaddy records back; the old host keeps serving until
its records are removed.

### Also worth doing at cutover

- Add `public/images/image-3.jpg` and restore the two commented blocks that reference
  it, so the About section and the social share card are complete.
- Verify the domain in Resend and set `NOTIFY_FROM` to an address at it. Notifications
  currently send from Resend's shared `onboarding@resend.dev`, which is fine for
  delivery to your own inbox but is not a good long-term sender.
- `/privacy` and `/terms` are `noindex` while they hold placeholder text. Remove the
  `robots` block in each page's `metadata` once real policies are written.
