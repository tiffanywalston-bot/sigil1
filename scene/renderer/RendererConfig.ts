// RendererConfig.ts

import type { Material } from "./RendererTypes";

export const DEFAULT_NODE_MATERIAL: Material = {
  color: "#ffffff",
  lineWidth: 2,
  opacity: 1.0,
  glow: 0.0,
};

export const DEFAULT_RING_MATERIAL: Material = {
  color: "#88ccff",
  lineWidth: 3,
  opacity: 0.8,
  glow: 0.2,
};

export const DEFAULT_CHAIN_MATERIAL: Material = {
  color: "#ffaa44",
  lineWidth: 2,
  opacity: 0.9,
  glow: 0.3,
};

export const DEFAULT_LABEL_COLOR = "#ffffff";

export const DEFAULT_CAMERA = {
  zoom: 1.0,
  panX: 0,
  panY: 0,
  projection: "orthographic" as const,
};
