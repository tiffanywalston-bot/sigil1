// GeometryConstants.ts
// Immutable constants for Sigil1 structural geometry.
// No logic, no math, no rendering, no engine behavior.

import type { GeometryNodeId } from "./Sigil1GeometryGoldMaster_v1_0";

// ───────────────────────────────────────────────
// 1. Axis Defaults
// ───────────────────────────────────────────────

export const IDENTITY_AXIS_DEFAULTS = {
  verticalOrderStart: 0,
  verticalStep: 1,
} as const;

export const INTENTION_AXIS_DEFAULTS = {
  horizontalCenter: 0,
  horizontalLeft: -1,
  horizontalRight: 1,
} as const;

export const HARMONIC_AXIS_DEFAULTS = {
  count: 3, // Gold Master default
} as const;

// ───────────────────────────────────────────────
// 2. Ring Counts
// ───────────────────────────────────────────────

export const STRUCTURAL_RING_COUNT = 3;
export const HARMONIC_RING_COUNT = 3;
export const UNIVERSE_BOUNDARY_COUNT = 1;

// ───────────────────────────────────────────────
// 3. Ring Spacing (Topology Only)
// ───────────────────────────────────────────────

export const STRUCTURAL_RING_SPACING = {
  step: 1,
} as const;

export const HARMONIC_RING_SPACING = {
  step: 1,
} as const;

// ───────────────────────────────────────────────
// 4. Universe Boundary Defaults
// ───────────────────────────────────────────────

export const UNIVERSE_BOUNDARY_DEFAULTS = {
  index: 0,
  kind: "boundary",
} as const;

// ───────────────────────────────────────────────
// 5. Topology Defaults (Type‑safe)
// ───────────────────────────────────────────────

export const TOPOLOGY_DEFAULTS = {
  verticalChain: [
    "Source",
    "Identity",
    "Manifestation",
    "Pregnancy",
  ] as readonly GeometryNodeId[],

  horizontalChain: [
    "Intention",
    "Identity",
    "Reinforcement",
  ] as readonly GeometryNodeId[],

  chainStep: 1,
} as const;

// ───────────────────────────────────────────────
// END — GeometryConstants.ts (Immutable)
// ───────────────────────────────────────────────
