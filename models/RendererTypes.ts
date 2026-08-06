// RendererTypes.ts
/**
 * RendererTypes.ts
 *
 * Shared renderer types for the models layer.
 * Types only.
 * No logic.
 */

/* ---------- Render Status ---------- */

export type RenderStatus =
    | "IDLE"
    | "RENDERING"
    | "PAUSED"
    | "ERROR";

/* ---------- Render Settings ---------- */

export interface RenderSettings {

    readonly width?: number;

    readonly height?: number;

    readonly antialias?: boolean;

    readonly shadowMapEnabled?: boolean;

}

/* ---------- Render State ---------- */

export interface RenderState {

    readonly status: RenderStatus;

    readonly fps?: number;

    readonly totalFrames?: number;

    readonly elapsedTime?: number;

}
