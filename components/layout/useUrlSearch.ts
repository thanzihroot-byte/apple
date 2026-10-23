'use client';

import { useEffect, useState } from 'react';

/**
 * Returns the current query string (e.g. `?category=mac`).
 *
 * `useSearchParams()` from `next/navigation` opts a whole route out of static
 * rendering unless every consumer sits behind a Suspense boundary. The header
 * lives in the root layout, so using it there would force every page of the
 * site to be client-rendered. Reading the query string straight from the
 * History API keeps all pages statically rendered while still letting the
 * header react to in-app navigation.
 */
export function useUrlSearch(): string {
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Defer the update with queueMicrotask: Next.js dev tooling (the Segment
    // Explorer) calls history.replaceState from inside a React insertion
    // effect, and scheduling a state update synchronously there trips React's
    // "useInsertionEffect must not schedule updates" invariant in dev.
    const sync = () => {
      queueMicrotask(() =>
        setSearch((current) => {
          const next = window.location.search;
          return current === next ? current : next;
        }),
      );
    };

    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function patchedPushState(
      this: History,
      ...args: Parameters<History['pushState']>
    ) {
      const result = originalPushState.apply(this, args);
      sync();
      return result;
    };

    window.history.replaceState = function patchedReplaceState(
      this: History,
      ...args: Parameters<History['replaceState']>
    ) {
      const result = originalReplaceState.apply(this, args);
      sync();
      return result;
    };

    window.addEventListener('popstate', sync);
    sync();

    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      window.removeEventListener('popstate', sync);
    };
  }, []);

  return search;
}
