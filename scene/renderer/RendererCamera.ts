// RendererCamera.ts
// Owns camera transforms only. No rendering logic. No Scene mutation.

import type { CameraState } from "./RendererTypes";
import { DEFAULT_CAMERA } from "./RendererConfig";

/**
 * Apply camera transform (zoom + pan) to a point.
 */
export function applyCamera(
  x: number,
  y: number,
  camera: CameraState = DEFAULT_CAMERA
): { x: number; y: number } {
  return {
    x: x * camera.zoom + camera.panX,
    y: y * camera.zoom + camera.panY,
  };
}
