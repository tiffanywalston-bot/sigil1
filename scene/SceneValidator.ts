import type { SceneLayout } from "./SceneTypes";

export interface SceneValidationReport {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

function addError(r: SceneValidationReport, msg: string) {
  r.errors.push(msg);
}

function addWarning(r: SceneValidationReport, msg: string) {
  r.warnings.push(msg);
}

export function validateSceneLayout(layout: SceneLayout): SceneValidationReport {
  const report: SceneValidationReport = { valid: true, errors: [], warnings: [] };

  const nodeIds = new Set<string>();
  const ringIds = new Set<string>();
  const axisIds = new Set<string>();
  const chainIds = new Set<string>();

  // Nodes
  layout.nodes.forEach(n => {
    if (nodeIds.has(n.id)) addError(report, `Duplicate Scene node id: ${n.id}`);
    nodeIds.add(n.id);
  });

  // Rings
  layout.rings.forEach(r => {
    if (ringIds.has(r.id)) addError(report, `Duplicate Scene ring id: ${r.id}`);
    ringIds.add(r.id);

    if (typeof r.radius !== "number" || r.radius < 0) {
      addError(report, `Invalid ring radius for ${r.id}`);
    }
  });

  // Axes
  layout.axes.forEach(a => {
    if (axisIds.has(a.id)) addError(report, `Duplicate Scene axis id: ${a.id}`);
    axisIds.add(a.id);

    a.nodes.forEach(n => {
      if (!nodeIds.has(n.id)) {
        addWarning(report, `Axis ${a.id} references unknown node ${n.id}`);
      }
    });
  });

  // Chains
  layout.chains.forEach(c => {
    if (chainIds.has(c.id)) addError(report, `Duplicate Scene chain id: ${c.id}`);
    chainIds.add(c.id);

    c.nodes.forEach(n => {
      if (!nodeIds.has(n.id)) {
        addWarning(report, `Chain ${c.id} references unknown node ${n.id}`);
      }
    });
  });

  report.valid = report.errors.length === 0;
  return report;
}
