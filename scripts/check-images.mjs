#!/usr/bin/env node
/**
 * Image gate.
 *
 * Every photography slot is 'empty', 'sample' or 'real' (see
 * src/content/images.ts). Only 'real' means finished. Samples are scaffolding
 * -- generated stand-ins that make layout and overlay contrast reviewable --
 * and they must never reach the live domain.
 *
 *   npm run check:images     fails (exit 1) while any slot is not 'real'.
 *                            Run this before the DNS cutover.
 *   npm run check:images -- --warn
 *                            lists them and exits 0. This is what `prebuild`
 *                            runs, so a deploy still succeeds pre-launch --
 *                            but nobody can miss the banner.
 *
 * State is read through `resolveSlot()` in the config itself rather than
 * re-derived here, so this script and the components can never disagree about
 * whether a slot is done.
 */

import { existsSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const warnOnly = process.argv.includes('--warn')

const { unfinishedSlots, imageSlots, photoList, photoRef, refProblems } =
  await import(join(ROOT, 'src/content/images.ts'))

const total = Object.keys(imageSlots).length

// Reference numbers are how photographs are filed against slots from outside
// this repo, so a duplicate or a gap is a correctness bug, not cosmetics. It
// fails in --warn mode too: the printed list would otherwise be wrong.
const refIssues = refProblems()
if (refIssues.length > 0) {
  console.error('\nFAILED: photo reference numbers are not sound')
  for (const issue of refIssues) console.error(`  ${issue}`)
  console.error('')
  process.exit(1)
}

const unfinished = unfinishedSlots()

/* A sample that is configured but whose file is missing is its own bug -- the
 * slot would render a broken image rather than a visible placeholder. */
const missingFiles = unfinished
  .filter((slot) => slot.state === 'sample')
  .filter((slot) => !existsSync(join(ROOT, 'public', slot.src)))

if (unfinished.length === 0 && missingFiles.length === 0) {
  console.log(`✓ All ${total} image slots hold real photography. No samples remain.`)
  process.exit(0)
}

const log = (message) => console[warnOnly ? 'warn' : 'error'](message)

const samples = unfinished.filter((slot) => slot.state === 'sample')
const empties = unfinished.filter((slot) => slot.state === 'empty')

const heading =
  `${unfinished.length} of ${total} image slots are not real photography ` +
  `(${samples.length} sample, ${empties.length} empty)`
const bar = '='.repeat(Math.max(heading.length, 46))

log(`\n${bar}\n${warnOnly ? 'WARNING: ' : 'FAILED: '}${heading}\n${bar}`)

log('')
for (const slot of photoList()) {
  const mark = slot.isReal ? 'done  ' : slot.state === 'sample' ? 'SAMPLE' : 'EMPTY '
  log(`  ${photoRef(slot.config.ref)}  ${mark}  ${slot.config.where}`)
  log(`      ${slot.name}  ${slot.config.width}x${slot.config.height}` +
      (slot.isReal ? `  ${slot.src}` : ''))
}

if (missingFiles.length > 0) {
  log(`\n  ${missingFiles.length} sample file(s) MISSING from disk -- run \`npm run images:samples\`:`)
  for (const slot of missingFiles) log(`    ${slot.name}  expected public${slot.src}`)
}

log(
  '\nEach photograph is filed against its number: send "photo 07" and it lands\n' +
    'in exactly one place. Numbers never change once published.\n' +
    '\nSamples are scaffolding and must not reach the live domain. To finish a\n' +
    "slot, set its `state` to 'real', set `src` to the photograph, and write\n" +
    '`alt`, in src/content/images.ts. Nothing else needs to change.\n' +
    '\nThis check and `npm run check:tk` must BOTH pass before the DNS cutover.\n',
)

// A missing sample file is a real defect even in --warn mode: the page would
// render a broken image rather than a placeholder.
process.exit(missingFiles.length > 0 ? 1 : warnOnly ? 0 : 1)
