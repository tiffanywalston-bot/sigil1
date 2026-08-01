// RendererValidator.ts
// Validates SceneLayout before rendering. Never repairs data.

import type { SceneLayout } from "../Scene/SceneTypes";

export interface RendererValidationReport {
  valid: boolean;
  errors: string[];
}

function addError(report: RendererValidationReport, msg: string) {
  report.errors.push(msg);
}

/**
 * Validate SceneLayout for rendering.
 * - Required collections exist
 * - Node coordinates are numeric
 * - Ring radii are valid
 */
export function validateSceneForRendering(scene: SceneLayout): RendererValidationReport {
  const report: RendererValidationReport = {
    valid: true,
    errors: [],
  };

  if (!scene.nodes || !scene.rings || !scene.axes || !scene.chains) {
    addError(report, "SceneLayout missing one or more required collections (nodes, rings, axes, chains).");
  }

  scene.nodes.forEach(node => {
    if (typeof node.x !== "number" || typeof node.y !== "number") {
      addError(report, `Invalid node coordinates for ${node.id}.`);
    }
  });

  scene.rings.forEach(ring => {
    if (typeof ring.radius !== "number" || ring.radius < 0) {
      addError(report, `Invalid ring radius for ${ring.id}.`);
    }
  });

  report.valid = report.errors.length === 0;
  return report;
}
