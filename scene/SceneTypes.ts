import type {
  GeometryAxisId,
  GeometryChainId,
} from "../geometry/Sigil1GeometryGoldMaster_v1_0";

export type SceneId = string;

export interface SceneNode {
  id: SceneId;
  kind: "node" | "ring";
  label?: string;
  x: number;
  y: number;
  radius?: number;
}

export interface SceneAxisView {
  id: SceneId;
  axisId: GeometryAxisId;
  nodes: SceneNode[];
}

export interface SceneChainView {
  id: SceneId;
  chainId: GeometryChainId;
  nodes: SceneNode[];
}

export interface SceneLayout {
  nodes: SceneNode[];
  rings: SceneNode[];
  axes: SceneAxisView[];
  chains: SceneChainView[];
}

export interface SceneConfig {
  scale: number;
  originX: number;
  originY: number;
}
