/**
 * Renders copy that may contain unfilled TK placeholders.
 *
 * A placeholder is shown, visibly and deliberately, as a muted chip carrying
 * the token text. It is never guessed at, never filled from anywhere, and
 * never silently dropped: these are license numbers and credentials on a
 * regulated insurance site, where a plausible invented value is far worse
 * than an obvious blank.
 *
 * `npm run check:tk` fails while any token is still in the source.
 */

/** Split pattern -- the capture group keeps the tokens in the output array. */
const SPLIT = /(\[\[TK:[^\]]*\]\])/g
/** Non-global twin, so `.test()` has no lastIndex to carry between calls. */
const IS_TOKEN = /^\[\[TK:[^\]]*\]\]$/

/** One unfilled fact. `data-tk` makes it greppable in rendered HTML too. */
export function TkChip({ token }: { token: string }) {
  return (
    <span
      data-tk=""
      title="Placeholder — a real value is required before launch"
      className="mx-0.5 inline-flex items-center rounded-md border border-dashed border-gold/60 bg-gold-wash px-1.5 py-0.5 align-baseline font-mono text-[0.8em] font-medium text-gold-deep"
    >
      <span className="sr-only">Placeholder, value pending: </span>
      {token}
    </span>
  )
}

/**
 * Inline text with any placeholders rendered as chips. Use anywhere a copy
 * string might contain a token -- passing plain text through is a no-op.
 */
export function Copy({ text }: { text: string }) {
  const parts = text.split(SPLIT)
  return (
    <>
      {parts.map((part, index) =>
        IS_TOKEN.test(part) ? <TkChip key={index} token={part} /> : part,
      )}
    </>
  )
}
