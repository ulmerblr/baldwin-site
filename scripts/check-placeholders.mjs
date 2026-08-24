#!/usr/bin/env node
/**
 * Placeholder gate.
 *
 * The site ships with deliberate blanks -- license numbers, credentials,
 * testimonials, the office address -- written as `[[TK: ...]]` tokens. They
 * render as visible chips rather than being guessed at, because an invented
 * license number on a regulated insurance site is far worse than an obvious
 * gap.
 *
 *   npm run check:tk     fails (exit 1) while any token remains. Run this
 *                        before go-live: a clean pass means every fact has a
 *                        real value.
 *   npm run check:tk -- --warn
 *                        lists them and exits 0. This is what `prebuild`
 *                        runs, so a deploy still succeeds while the site is
 *                        pre-launch -- but nobody can miss the banner.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const SCAN = ['src']
const EXTENSIONS = ['.ts', '.tsx', '.mdx', '.md', '.json']
const TOKEN = /\[\[TK:[^\]]*\]\]/g

const warnOnly = process.argv.includes('--warn')

function walk(dir) {
  const out = []
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry.startsWith('.')) continue
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) out.push(...walk(full))
    else if (EXTENSIONS.some((ext) => entry.endsWith(ext))) out.push(full)
  }
  return out
}

const findings = []
for (const base of SCAN) {
  for (const file of walk(join(ROOT, base))) {
    const lines = readFileSync(file, 'utf8').split('\n')
    lines.forEach((line, index) => {
      for (const match of line.matchAll(TOKEN)) {
        findings.push({ file: relative(ROOT, file), line: index + 1, token: match[0] })
      }
    })
  }
}

if (findings.length === 0) {
  console.log('✓ No [[TK:]] placeholders remain. Every supplied-later fact has a real value.')
  process.exit(0)
}

const files = new Set(findings.map((finding) => finding.file))
const heading = `${findings.length} placeholder${findings.length === 1 ? '' : 's'} still unfilled in ${files.size} file${files.size === 1 ? '' : 's'}`

const bar = '='.repeat(Math.max(heading.length, 46))
console[warnOnly ? 'warn' : 'error'](
  `\n${bar}\n${warnOnly ? 'WARNING: ' : 'FAILED: '}${heading}\n${bar}`,
)
for (const finding of findings) {
  console[warnOnly ? 'warn' : 'error'](`  ${finding.file}:${finding.line}  ${finding.token}`)
}
console[warnOnly ? 'warn' : 'error'](
  '\nThese render as visible placeholder chips on the site. Supply the real\n' +
    'values in src/content/ before launch -- never guess them.\n',
)

process.exit(warnOnly ? 0 : 1)
