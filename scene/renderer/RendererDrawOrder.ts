// RendererDrawOrder.ts
// Reserved draw-order contract for future expansion.
// RendererAdapter currently draws rings → nodes → labels,
// but this file defines the canonical order for v2+.

export const DRAW_ORDER = [
  "background",
  "universe-boundary",
  "clouds",
  "stars",
  "rings",
  "chains",
  "nodes",
  "labels",
  "effects",
] as const;
