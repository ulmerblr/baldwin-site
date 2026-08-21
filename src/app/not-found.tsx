import Link from 'next/link'

export default function NotFound() {
  return (
    <main id="main" className="mx-auto flex max-w-3xl flex-col items-start px-4 py-24 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-ink-100 sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-4 leading-relaxed text-ink-300">
        That page does not exist. Everything on this site lives on the home page.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-xl bg-gold-500 px-6 py-3 font-semibold text-navy-950 transition-colors hover:bg-gold-400"
      >
        Back to home
      </Link>
    </main>
  )
}
