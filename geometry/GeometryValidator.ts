// GeometryValidator.ts
// Geometry-only validation.
// No math, no rendering, no engine logic, no auto-fix (LAW 017).

import {
  GEOMETRY_NODES,
  GEOMETRY_AXES,
  GEOMETRY_RING_DEFINITIONS,
  GEOMETRY_RING_INSTANCES,
  GEOMETRY_RELATIONSHIPS,
  GEOMETRY_CHAINS,
} from "./Sigil1GeometryGoldMaster_v1_0";

export interface GeometryValidationReport {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// ───────────────────────────────────────────────
// Helpers
// ───────────────────────────────────────────────

function addError(report: GeometryValidationReport, msg: string) {
  report.errors.push(msg);
}

function addWarning(report: GeometryValidationReport, msg: string) {
  report.warnings.push(msg);
}

function idSet<T extends string>(items: readonly { id: T }[]) {
  return new Set(items.map(i => i.id));
}

// ───────────────────────────────────────────────
// Validation
// ───────────────────────────────────────────────

export function validateGeometry(): GeometryValidationReport {
  const report: GeometryValidationReport = {
    valid: true,
    errors: [],
    warnings: [],
  };

  // Collect ID sets
  const nodeIds = idSet(GEOMETRY_NODES);
  const axisIds = idSet(GEOMETRY_AXES);
  const ringDefIds = idSet(GEOMETRY_RING_DEFINITIONS);
  const chainIds = idSet(GEOMETRY_CHAINS);

  // ───────────────────────────────────────────────
  // 0. Duplicate ID validation
  // ───────────────────────────────────────────────

  if (GEOMETRY_NODES.length !== nodeIds.size) {
    addError(report, "Duplicate node IDs detected.");
  }

  if (GEOMETRY_AXES.length !== axisIds.size) {
    addError(report, "Duplicate axis IDs detected.");
  }

  if (GEOMETRY_RING_DEFINITIONS.length !== ringDefIds.size) {
    addError(report, "Duplicate ring definition IDs detected.");
  }

  if (GEOMETRY_CHAINS.length !== chainIds.size) {
    addError(report, "Duplicate chain IDs detected.");
  }

  // ───────────────────────────────────────────────
  // 1. Node validation
  // ───────────────────────────────────────────────

  GEOMETRY_NODES.forEach(n => {
    // Axis membership must reference valid axes
    n.axisMembership.forEach(axis => {
      if (!axisIds.has(axis)) {
        addError(report, `Node ${n.id} references unknown axis ${axis}`);
      }
    });

    // Parent must exist if defined
    if (n.parent && !nodeIds.has(n.parent)) {
      addError(report, `Node ${n.id} has unknown parent ${n.parent}`);
    }
  });

  // ───────────────────────────────────────────────
  // 2. Axis validation
  // ───────────────────────────────────────────────

  GEOMETRY_AXES.forEach(a => {
    if (!axisIds.has(a.id)) {
      addError(report, `Axis ${a.id} is missing from axis set`);
    }
  });

  // ───────────────────────────────────────────────
  // 3. Ring definition validation
  // ───────────────────────────────────────────────

  GEOMETRY_RING_DEFINITIONS.forEach(r => {
    if (!ringDefIds.has(r.id)) {
      addError(report, `Ring definition ${r.id} missing from ringDefIds`);
    }
  });

  // ───────────────────────────────────────────────
  // 4. Ring instance validation
  // ───────────────────────────────────────────────

  GEOMETRY_RING_INSTANCES.forEach(r => {
    if (!ringDefIds.has(r.definitionId)) {
      addError(report, `Ring instance references unknown definition ${r.definitionId}`);
    }
  });

  // ───────────────────────────────────────────────
  // 5. Relationship validation
  // ───────────────────────────────────────────────

  GEOMETRY_RELATIONSHIPS.forEach(rel => {
    if (!nodeIds.has(rel.from)) {
      addError(report, `Relationship from unknown node ${rel.from}`);
    }
    if (!nodeIds.has(rel.to)) {
      addError(report, `Relationship to unknown node ${rel.to}`);
    }
    if (!axisIds.has(rel.axis)) {
      addError(report, `Relationship uses unknown axis ${rel.axis}`);
    }
  });

  // ───────────────────────────────────────────────
  // 6. Chain validation
  // ───────────────────────────────────────────────

  GEOMETRY_CHAINS.forEach(chain => {
    if (!chainIds.has(chain.id)) {
      addError(report, `Chain ${chain.id} missing from chainIds`);
    }

    chain.nodes.forEach(n => {
      if (!nodeIds.has(n)) {
        addError(report, `Chain ${chain.id} references unknown node ${n}`);
      }
    });
  });

  // ───────────────────────────────────────────────
  // Finalize
  // ───────────────────────────────────────────────

  report.valid = report.errors.length === 0;
  return report;
}

// END — GeometryValidator.ts
