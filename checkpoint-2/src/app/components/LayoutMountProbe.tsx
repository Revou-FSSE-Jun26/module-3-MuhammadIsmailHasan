"use client";

import { useState } from "react";

/**
 * Proof that a layout survives navigation: the lazy initialiser runs once, when
 * the component first mounts. If this timestamp changes while moving between
 * routes under the same layout, the layout remounted.
 */
export default function LayoutMountProbe({ label }: { label: string }) {
  const [mountedAt] = useState(() => new Date().toLocaleTimeString("id-ID"));

  return (
    <p className="text-xs text-neutral-400">
      {label} mounted at {mountedAt}
    </p>
  );
}
