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

## Everything else

The brand mark is inline SVG and the hero ground is a CSS gradient, so there
are no other image files to serve. `images.unoptimized` is set in
`next.config.ts`; remove that flag if you add photography you want Next to
optimize.
