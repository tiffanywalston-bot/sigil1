// GeometryMath.ts
// Structural geometry math only.
// No rendering, no animation, no audio, no engine logic.

import type {
  GeometryNodeId,
  GeometryAxisId,
  GeometryRingDefinitionId,
  GeometryChainId,
} from "./Sigil1GeometryGoldMaster_v1_0";

import {
  GEOMETRY_NODES,
  GEOMETRY_AXES,
  GEOMETRY_RING_INSTANCES,
  GEOMETRY_RELATIONSHIPS,
  GEOMETRY_CHAINS,
} from "./Sigil1GeometryGoldMaster_v1_0";

import {
  IDENTITY_AXIS_DEFAULTS,
  INTENTION_AXIS_DEFAULTS,
  STRUCTURAL_RING_SPACING,
  HARMONIC_RING_SPACING,
  UNIVERSE_BOUNDARY_DEFAULTS,
} from "./GeometryConstants";

// ───────────────────────────────────────────────
// Types
// ───────────────────────────────────────────────

export interface NodePosition {
  node: GeometryNodeId;
  x: number;
  y: number;
}

export interface RingPosition {
  definitionId: GeometryRingDefinitionId;
  index?: number;
  radius: number;
}

export interface AxisLayout {
  axis: GeometryAxisId;
  nodes: NodePosition[];
}

export interface ChainLayout {
  chainId: GeometryChainId;
  nodes: NodePosition[];
}

export interface GeometryLayout {
  nodes: NodePosition[];
  rings: RingPosition[];
  axes: AxisLayout[];
  chains: ChainLayout[];
}

// ───────────────────────────────────────────────
// Node Position
// ───────────────────────────────────────────────

export function getNodePosition(nodeId: GeometryNodeId): NodePosition {
  const node = GEOMETRY_NODES.find(n => n.id === nodeId);
  if (!node) throw new Error(`Unknown node: ${nodeId}`);

  const x =
    typeof node.horizontalOrder === "number"
      ? node.horizontalOrder
      : INTENTION_AXIS_DEFAULTS.horizontalCenter;

  const y =
    typeof node.verticalOrder === "number"
      ? node.verticalOrder
      : IDENTITY_AXIS_DEFAULTS.verticalOrderStart;

  return { node: nodeId, x, y };
}

// ───────────────────────────────────────────────
// Ring Position
// ───────────────────────────────────────────────

export function getRingPosition(
  definitionId: GeometryRingDefinitionId,
  index?: number
): RingPosition {
  let radius = 0;

  if (definitionId === "StructuralRing") {
    radius = (index ?? 1) * STRUCTURAL_RING_SPACING.step;
  }

  if (definitionId === "HarmonicRing") {
    radius = (index ?? 1) * HARMONIC_RING_SPACING.step;
  }

  if (definitionId === "UniverseBoundary") {
    radius = UNIVERSE_BOUNDARY_DEFAULTS.index;
  }

  return { definitionId, index, radius };
}

// ───────────────────────────────────────────────
// Axis Layout
// ───────────────────────────────────────────────

export function getAxisLayout(axisId: GeometryAxisId): AxisLayout {
  const nodes = GEOMETRY_NODES
    .filter(n => n.axisMembership.includes(axisId))
    .map(n => getNodePosition(n.id));

  return { axis: axisId, nodes };
}

// ───────────────────────────────────────────────
// Chain Layout
// ───────────────────────────────────────────────

export function getChainLayout(chainId: GeometryChainId): ChainLayout {
  const chain = GEOMETRY_CHAINS.find(c => c.id === chainId);
  if (!chain) throw new Error(`Unknown chain: ${chainId}`);

  const nodes = chain.nodes.map(n => getNodePosition(n));

  return { chainId, nodes };
}

// ───────────────────────────────────────────────
// Full Geometry Layout
// ───────────────────────────────────────────────

export function buildGeometryLayout(): GeometryLayout {
  const nodes = GEOMETRY_NODES.map(n => getNodePosition(n.id));

  const rings = GEOMETRY_RING_INSTANCES.map(r =>
    getRingPosition(r.definitionId, r.index)
  );

  const axes = GEOMETRY_AXES.map(a => getAxisLayout(a.id));

  const chains = GEOMETRY_CHAINS.map(c => getChainLayout(c.id));

  return { nodes, rings, axes, chains };
}

// END — GeometryMath.ts
