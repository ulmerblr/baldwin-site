# Images

This build ships without raster imagery. The brand mark is inline SVG
(`src/components/sections.tsx`) and the hero ground is a CSS gradient, so there
are no image files to download, optimize, or serve.

The original site's photography could not be retrieved when this was built --
`baldwinlifeinsurance.com` was unreachable from the build environment (blocked
by network egress policy), so nothing could be copied across.

If you want the original photography back, drop the files here and reference
them with `next/image`. Note that `images.unoptimized` is set in
`next.config.ts`; remove that flag if you want Next to optimize them.
