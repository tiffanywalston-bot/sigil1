// Renderer.ts
// Renderer subsystem entry point. No canvas, DOM, or animation loop.

import type { SceneLayout } from "../Scene/SceneTypes";
import type { RenderOutput } from "./RendererTypes";
import { validateSceneForRendering } from "./RendererValidator";
import { sceneToDrawCommands } from "./RendererAdapter";

/**
 * Render a SceneLayout into draw commands.
 * - Validates SceneLayout
 * - Converts SceneLayout → DrawCommand[]
 * - Returns RenderOutput
 */
export function renderScene(scene: SceneLayout): RenderOutput {
  const validation = validateSceneForRendering(scene);

  if (!validation.valid) {
    throw new Error(
      "Renderer rejected invalid SceneLayout: " + validation.errors.join("; ")
    );
  }

  const commands = sceneToDrawCommands(scene);

  return { commands };
}
