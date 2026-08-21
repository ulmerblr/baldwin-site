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

**All user-facing text lives in [`src/content/site.ts`](src/content/site.ts).** No
component contains hardcoded marketing copy. To reword the hero, rename a product,
change the phone number, or edit a form's success message, edit that one file and
push. The change is live on the next deploy.

The file is a plain object grouped by section: `meta`, `nav`, `contact`, `hero`,
`services`, `about`, `agentOpportunity`, `howItWorks`, `forms`, `footer`, `legal`.

> ⚠️ **The copy is the client's approved marketing language, transcribed verbatim
> from the live site.** This is a regulated industry: do not reword, tighten, or
> "fix" its grammar. Change it only when the client asks for a change.

**Still missing: `image-3.jpg`.** The live site's one photograph could not be
downloaded — the build environment blocks `baldwinlifeinsurance.com`. The About
section image and the OG/Twitter image tags are omitted rather than shipped
broken. See [`public/images/README.md`](public/images/README.md) for the
two-line fix once the file is added.

---

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
    layout.tsx            metadata, OG tags, CA/TX geo targeting
    privacy/, terms/      real legal routes (no dead links anywhere)
    api/quote/route.ts    POST — quote form
    api/apply/route.ts    POST — application form
  components/             presentation + the modal/form client island
  content/site.ts         ← all copy lives here
  lib/
    validate.ts           server-side validation and sanitization
    rate-limit.ts         in-memory per-IP limiter
    notify.ts             the notification seam (email today, ATS later)
    handle-submission.ts  shared pipeline for both endpoints
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
