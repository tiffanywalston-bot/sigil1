// RendererAdapter.ts

import type { SceneLayout, SceneNode } from "../SceneTypes";
import type { DrawCommand, Material } from "./RendererTypes";
import {
  DEFAULT_NODE_MATERIAL,
  DEFAULT_RING_MATERIAL,
  DEFAULT_CHAIN_MATERIAL,
  DEFAULT_LABEL_COLOR,
} from "./RendererConfig";
import { applyCamera } from "./RendererCamera";

// ───────────────────────────────────────────────
// Node
// ───────────────────────────────────────────────

function drawNode(node: SceneNode, material: Material): DrawCommand {
  const { x, y } = applyCamera(node.x, node.y);
  return {
    kind: "circle",
    x,
    y,
    radius: 6,
    color: material.color,
    lineWidth: material.lineWidth,
    opacity: material.opacity,
    glow: material.glow,
  };
}

// ───────────────────────────────────────────────
// Ring
// ───────────────────────────────────────────────

function drawRing(node: SceneNode, material: Material): DrawCommand {
  const { x, y } = applyCamera(node.x, node.y);
  return {
    kind: "circle",
    x,
    y,
    radius: node.radius ?? 0,
    color: material.color,
    lineWidth: material.lineWidth,
    opacity: material.opacity,
    glow: material.glow,
  };
}

// ───────────────────────────────────────────────
// Chain (NEW)
// ───────────────────────────────────────────────

function drawChain(nodes: SceneNode[], material: Material): DrawCommand[] {
  const cmds: DrawCommand[] = [];

  for (let i = 0; i < nodes.length - 1; i++) {
    const a = applyCamera(nodes[i].x, nodes[i].y);
    const b = applyCamera(nodes[i + 1].x, nodes[i + 1].y);

    cmds.push({
      kind: "line",
      x: a.x,
      y: a.y,
      x2: b.x,
      y2: b.y,
      color: material.color,
      lineWidth: material.lineWidth,
      opacity: material.opacity,
      glow: material.glow,
    });
  }

  return cmds;
}

// ───────────────────────────────────────────────
// Label
// ───────────────────────────────────────────────

function drawLabel(node: SceneNode): DrawCommand {
  const { x, y } = applyCamera(node.x, node.y);
  return {
    kind: "text",
    x,
    y,
    text: node.label ?? "",
    color: DEFAULT_LABEL_COLOR,
    opacity: 1.0,
  };
}

// ───────────────────────────────────────────────
// Main adapter
// ───────────────────────────────────────────────

export function sceneToDrawCommands(scene: SceneLayout): DrawCommand[] {
  const commands: DrawCommand[] = [];

  // Rings
  scene.rings.forEach(r => {
    commands.push(drawRing(r, DEFAULT_RING_MATERIAL));
  });

  // Chains (NEW)
  scene.chains.forEach(chain => {
    commands.push(...drawChain(chain.nodes, DEFAULT_CHAIN_MATERIAL));
  });

  // Nodes + Labels
  scene.nodes.forEach(n => {
    commands.push(drawNode(n, DEFAULT_NODE_MATERIAL));
    commands.push(drawLabel(n));
  });

  return commands;
}
