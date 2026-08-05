import type {
  SceneLayout,
  SceneNode,
  SceneAxisView,
  SceneChainView,
  SceneConfig,
} from "./SceneTypes";

import type {
  NodePosition,
  RingPosition,
  AxisLayout,
  ChainLayout,
} from "../math/GeometryMath";

import { DEFAULT_SCENE_CONFIG } from "./SceneConfig";
import { buildGeometryLayout } from "../math/GeometryMath";

function adaptNode(pos: NodePosition, cfg: SceneConfig): SceneNode {
  return {
    id: `node:${pos.node}`,
    kind: "node",
    label: pos.node,
    x: pos.x * cfg.scale + cfg.originX,
    y: pos.y * cfg.scale + cfg.originY,
  };
}

function adaptRing(ring: RingPosition, cfg: SceneConfig): SceneNode {
  return {
    id: `ring:${ring.definitionId}:${ring.index ?? 0}`,
    kind: "ring",
    label: ring.definitionId,
    x: cfg.originX,
    y: cfg.originY,
    radius: ring.radius * cfg.scale,
  };
}

export function buildSceneLayout(config: Partial<SceneConfig> = {}): SceneLayout {
  const cfg = { ...DEFAULT_SCENE_CONFIG, ...config };
  const geometry = buildGeometryLayout();

  const nodes = geometry.nodes.map(n => adaptNode(n, cfg));
  const rings = geometry.rings.map(r => adaptRing(r, cfg));

  const axes: SceneAxisView[] = geometry.axes.map((a: AxisLayout) => ({
    id: `axis:${a.axis}`,
    axisId: a.axis,
    nodes: a.nodes.map(n => adaptNode(n, cfg)),
  }));

  const chains: SceneChainView[] = geometry.chains.map((c: ChainLayout) => ({
    id: `chain:${c.chainId}`,
    chainId: c.chainId,
    nodes: c.nodes.map(n => adaptNode(n, cfg)),
  }));

  return { nodes, rings, axes, chains };
}
