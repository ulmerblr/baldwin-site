# Images

## Missing: `image-3.jpg`

The live site uses one photograph — an advisor meeting with a couple — at
`https://baldwinlifeinsurance.com/images/image-3.jpg`. It is the hero of the
About section and the OG/Twitter share image.

**That file is not in this repo.** It could not be downloaded: the build
environment's network egress policy blocks `baldwinlifeinsurance.com`. No
substitute was used and no image was generated.

Until it is added, two things are deliberately omitted rather than shipped
broken:

- the `<img>` in the About section (`src/components/sections.tsx`)
- the `openGraph.images` / `twitter.images` tags (`src/app/layout.tsx`)

Both places have a comment showing exactly what to restore.

### To add it

1. Download `image-3.jpg` from the live site and save it here as
   `public/images/image-3.jpg`.
2. Uncomment the two blocks named above.
3. `npm run build` and confirm the About section renders it and the OG tag
   resolves.

The path and alt text are already in `src/content/site.ts`
(`about.image` and `meta.socialImage`), so nothing else needs editing.

## Photography slots

The pages added in the multi-page expansion each have a photo slot, and none of
them has a photograph yet. They are declared in
[`src/content/images.ts`](../../src/content/images.ts):

| Slot | Where it appears | Alt text |
| --- | --- | --- |
| `chris-portrait` | `/about`, beside the story | supplied — Chris Baldwin, founder |
| `about-secondary` | `/about`, supporting photo | ships with the photo |
| `product-<slug>` (six) | each product page | decorative |
| `agent-team` | `/agent-opportunity` | decorative |

Until a slot has a `src`, it draws a neutral branded panel in the site palette.
**No stock photography, no generated imagery, and nothing copied from any other
site** — including the reference site, which asserts copyright over its images
and its copy.

### To fill a slot

1. Save the file in this folder, e.g. `public/images/chris-portrait.jpg`.
2. Set that slot's `src` in `src/content/images.ts` (and its `alt`, for the two
   slots that are not decorative).

No component changes. That config file is the only edit.

## Everything else

The brand mark is inline SVG and the hero ground is a CSS gradient, so there
are no other image files to serve. `images.unoptimized` is set in
`next.config.ts`; remove that flag if you add photography you want Next to
optimize.
