// RendererTypes.ts
// Clean: no unused imports.

export interface DrawCommand {
  kind: "line" | "circle" | "text";
  x?: number;
  y?: number;
  x2?: number;
  y2?: number;
  radius?: number;
  text?: string;
  color: string;
  lineWidth?: number;
  opacity?: number;
  glow?: number; // now used
}

export interface Material {
  color: string;
  lineWidth: number;
  opacity: number;
  glow?: number;
}

export interface CameraState {
  zoom: number;
  panX: number;
  panY: number;
  projection: "orthographic";
}

export interface RenderOutput {
  commands: DrawCommand[];
}
