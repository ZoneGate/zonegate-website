"use client";

import { useSyncExternalStore } from "react";

/**
 * Reads a query-string parameter without suspending the route.
 *
 * `useSearchParams` puts the whole page behind a Suspense boundary that never
 * resolves for these statically prerendered routes, so the value is read from
 * `location` instead. The server snapshot is empty, which matches the
 * prerendered HTML; the client fills in the real value on hydration.
 */
export const QUERY_CHANGE_EVENT = "zonegate:querychange";

function subscribe(onChange: () => void) {
    window.addEventListener("popstate", onChange);
    window.addEventListener(QUERY_CHANGE_EVENT, onChange);

    return () => {
        window.removeEventListener("popstate", onChange);
        window.removeEventListener(QUERY_CHANGE_EVENT, onChange);
    };
}

export function useQueryParam(name: string) {
    return useSyncExternalStore(
        subscribe,
        () => new URLSearchParams(window.location.search).get(name) ?? "",
        () => ""
    );
}
