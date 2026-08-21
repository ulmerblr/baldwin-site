'use client'

import { useSyncExternalStore } from 'react'

/** The year never changes under us while the tab is open; nothing to subscribe to. */
const subscribe = () => () => {}

/**
 * The page is statically rendered, so a build-time year would go stale if the
 * site sat un-redeployed across New Year. Serve the build year in the static
 * HTML and read the real clock in the browser -- `useSyncExternalStore` is the
 * supported way to differ between server and client without a cascading render.
 */
export function CurrentYear({ buildYear }: { buildYear: number }) {
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => buildYear,
  )
  return <>{year}</>
}
