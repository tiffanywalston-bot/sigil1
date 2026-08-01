// Sigil1GeometryGoldMaster_v1_0.ts
// FINAL — Geometry Only
// Implements the structural geometry exactly as defined in the Gold Master.
// No rendering, no engine logic, no occupancy, no behavior.

// ───────────────────────────────────────────────
// 0. Governance (Geometry-only)
// ───────────────────────────────────────────────

export const GEOMETRY_GOVERNANCE = {
  LAW_013_GEOMETRY_NEVER_KNOWS_APPEARANCE: true,
  LAW_014_ONE_OWNER_PER_NODE: true,
  LAW_015_RELATIONSHIPS_IMMUTABLE: true,
  LAW_016_GEOMETRY_READ_ONLY: true,
} as const;

// ───────────────────────────────────────────────
// 1. Core IDs
// ───────────────────────────────────────────────

export type GeometryNodeId =
  | "Source"
  | "Identity"
  | "Intention"
  | "Reinforcement"
  | "Manifestation"
  | "Pregnancy";

export type GeometryAxisId =
  | "IdentityAxis"
  | "IntentionAxis"
  | "HarmonicAxis";

export type GeometryRingDefinitionId =
  | "StructuralRing"
  | "HarmonicRing"
  | "UniverseBoundary";

export type GeometryChainId =
  | "SourceIdentityChain"
  | "IdentityLeftChain"
  | "IdentityRightChain"
  | "IdentityManifestChain"
  | "ManifestPregnancyChain";

// ───────────────────────────────────────────────
// 2. Nodes (owned by Geometry)
// ───────────────────────────────────────────────

export interface GeometryNode {
  id: GeometryNodeId;
  owner: "Geometry";

  axisMembership: GeometryAxisId[];
  verticalOrder?: number;
  horizontalOrder?: number;

  parent?: GeometryNodeId | null;
}

export const GEOMETRY_NODES: readonly GeometryNode[] = [
  {
    id: "Source",
    owner: "Geometry",
    axisMembership: ["IdentityAxis"],
    verticalOrder: 0,
    parent: null,
  },
  {
    id: "Identity",
    owner: "Geometry",
    axisMembership: ["IdentityAxis", "IntentionAxis"],
    verticalOrder: 1,
    horizontalOrder: 0,
    parent: "Source",
  },
  {
    id: "Intention",
    owner: "Geometry",
    axisMembership: ["IntentionAxis"],
    horizontalOrder: -1,
    parent: "Identity",
  },
  {
    id: "Reinforcement",
    owner: "Geometry",
    axisMembership: ["IntentionAxis"],
    horizontalOrder: 1,
    parent: "Identity",
  },
  {
    id: "Manifestation",
    owner: "Geometry",
    axisMembership: ["IdentityAxis"],
    verticalOrder: 2,
    parent: "Identity",
  },
  {
    id: "Pregnancy",
    owner: "Geometry",
    axisMembership: ["IdentityAxis"],
    verticalOrder: 3,
    parent: "Manifestation",
  },
] as const;

// ───────────────────────────────────────────────
// 3. Axes (owned by Geometry)
// ───────────────────────────────────────────────

export interface GeometryAxis {
  id: GeometryAxisId;
  owner: "Geometry";
  kind: "vertical" | "horizontal" | "derived";
}

export const GEOMETRY_AXES: readonly GeometryAxis[] = [
  { id: "IdentityAxis", owner: "Geometry", kind: "vertical" },
  { id: "IntentionAxis", owner: "Geometry", kind: "horizontal" },
  { id: "HarmonicAxis", owner: "Geometry", kind: "derived" },
] as const;

// ───────────────────────────────────────────────
// 4. Rings (definition + instances)
// ───────────────────────────────────────────────

export interface GeometryRingDefinition {
  id: GeometryRingDefinitionId;
  owner: "Geometry";
  kind: "structural" | "harmonic" | "boundary";
}

export const GEOMETRY_RING_DEFINITIONS: readonly GeometryRingDefinition[] = [
  { id: "StructuralRing", owner: "Geometry", kind: "structural" },
  { id: "HarmonicRing", owner: "Geometry", kind: "harmonic" },
  { id: "UniverseBoundary", owner: "Geometry", kind: "boundary" },
] as const;

export interface GeometryRingInstance {
  definitionId: GeometryRingDefinitionId;
  index?: number;
}

export const GEOMETRY_RING_INSTANCES: readonly GeometryRingInstance[] = [
  { definitionId: "StructuralRing", index: 1 },
  { definitionId: "StructuralRing", index: 2 },
  { definitionId: "StructuralRing", index: 3 },

  { definitionId: "HarmonicRing", index: 1 },
  { definitionId: "HarmonicRing", index: 2 },
  { definitionId: "HarmonicRing", index: 3 },

  { definitionId: "UniverseBoundary" },
] as const;

// ───────────────────────────────────────────────
// 5. Relationships (immutable)
// ───────────────────────────────────────────────

export interface GeometryRelationship {
  from: GeometryNodeId;
  to: GeometryNodeId;
  axis: GeometryAxisId;
  direction: "up" | "down" | "left" | "right";
  immutable: true;
}

export const GEOMETRY_RELATIONSHIPS: readonly GeometryRelationship[] = [
  { from: "Source", to: "Identity", axis: "IdentityAxis", direction: "down", immutable: true },
  { from: "Identity", to: "Manifestation", axis: "IdentityAxis", direction: "down", immutable: true },
  { from: "Manifestation", to: "Pregnancy", axis: "IdentityAxis", direction: "down", immutable: true },

  { from: "Intention", to: "Identity", axis: "IntentionAxis", direction: "right", immutable: true },
  { from: "Identity", to: "Intention", axis: "IntentionAxis", direction: "left", immutable: true },
  { from: "Identity", to: "Reinforcement", axis: "IntentionAxis", direction: "right", immutable: true },
  { from: "Reinforcement", to: "Identity", axis: "IntentionAxis", direction: "left", immutable: true },
] as const;

// ───────────────────────────────────────────────
// 6. Structural Chains (explicit)
// ───────────────────────────────────────────────

export interface GeometryChain {
  id: GeometryChainId;
  owner: "Geometry";
  nodes: GeometryNodeId[];
}

export const GEOMETRY_CHAINS: readonly GeometryChain[] = [
  { id: "SourceIdentityChain", owner: "Geometry", nodes: ["Source", "Identity"] },
  { id: "IdentityLeftChain", owner: "Geometry", nodes: ["Identity", "Intention"] },
  { id: "IdentityRightChain", owner: "Geometry", nodes: ["Identity", "Reinforcement"] },
  { id: "IdentityManifestChain", owner: "Geometry", nodes: ["Identity", "Manifestation"] },
  { id: "ManifestPregnancyChain", owner: "Geometry", nodes: ["Manifestation", "Pregnancy"] },
] as const;

// ───────────────────────────────────────────────
// END — Geometry Only
// ───────────────────────────────────────────────
