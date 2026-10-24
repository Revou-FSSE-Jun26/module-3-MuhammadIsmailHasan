"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { ApiError } from "@/lib/api";

export type QueryState<T> =
  { status: "loading" } | { status: "error"; message: string } | { status: "ready"; data: T };

/**
 * Fetch data that needs the signed-in user's token.
 * Runs again when `key` changes (e.g. the page number) or when reload() is called.
 */
export function useAuthedQuery<T>(key: string, fetcher: (token: string) => Promise<T>) {
  const { authed, status } = useAuth();
  const [state, setState] = useState<QueryState<T>>({ status: "loading" });
  const [tick, setTick] = useState(0);
  const fetcherRef = useRef(fetcher);

  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  useEffect(() => {
    if (status !== "ready") return;
    let cancelled = false;
    authed((token) => fetcherRef.current(token))
      .then((data) => {
        if (!cancelled) setState({ status: "ready", data });
      })
      .catch((error) => {
        if (cancelled) return;
        const message =
          error instanceof ApiError ? error.message : "Could not reach the server. Try again.";
        setState({ status: "error", message });
      });
    return () => {
      cancelled = true;
    };
  }, [status, authed, key, tick]);

  const reload = useCallback(() => {
    setState({ status: "loading" });
    setTick((t) => t + 1);
  }, []);

  return { state, reload };
}
