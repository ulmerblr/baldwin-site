import Link from 'next/link'

export default function NotFound() {
  return (
    <main id="main" className="mx-auto flex max-w-3xl flex-col items-start px-4 py-24 sm:px-6">
      <h1 className="font-display text-3xl font-semibold leading-[1.12] tracking-[-0.015em] text-ink sm:text-4xl lg:text-[2.75rem]">
        Page not found
      </h1>
      <p className="mt-4 leading-relaxed text-body">
        That page does not exist. Head back to the home page to find what you need.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-xl bg-gold-bright px-6 py-3 font-semibold text-ink transition-colors hover:bg-gold"
      >
        Back to home
      </Link>
    </main>
  )
}
