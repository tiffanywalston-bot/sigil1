/**
 * RendererTypes.ts
 *
 * Shared renderer data types for Sigil1.
 * No logic.
 * No classes.
 * No functions.
 * No rendering implementation.
 * Types only.
 */

import type { Vector3, Transform } from "./GeometryTypes";

/* ---------- Render Status ---------- */

export type RenderStatus =
    | "IDLE"
    | "RENDERING"
    | "PAUSED"
    | "ERROR";

/* ---------- Animation State (types only) ---------- */

export interface AnimationState {

    playing: boolean;

    time: number;

    speed: number;

    loop: boolean;

}

/* ---------- Material ---------- */

export interface Material {

    id: string;

    name: string;

    color: string;

    opacity: number;

    glow: string | null;

    emissiveIntensity: number;

}

/* ---------- Light ---------- */

export type LightType =
    | "AMBIENT"
    | "DIRECTIONAL"
    | "POINT";

export interface Light {

    id: string;

    type: LightType;

    color: string;

    intensity: number;

    position: Vector3 | null;

    direction: Vector3 | null;

    enabled: boolean;

}

/* ---------- Camera ---------- */

export type CameraProjection =
    | "PERSPECTIVE"
    | "ORTHOGRAPHIC";

export interface Camera {

    id: string;

    name: string;

    projection: CameraProjection;

    transform: Transform;

    fov: number;

    near: number;

    far: number;

    active: boolean;

}

/* ---------- Render Object ---------- */

export interface RenderObject {

    id: string;

    name: string;

    transform: Transform;

    materialId: string | null;

    visible: boolean;

    renderOrder: number;

    animation: AnimationState;

}

/* ---------- Render Group ---------- */

export interface RenderGroup {

    id: string;

    name: string;

    objects: RenderObject[];

    visible: boolean;

    renderOrder: number;

}

/* ---------- Scene Layer ---------- */

export interface SceneLayer {

    id: string;

    name: string;

    order: number;

    visible: boolean;

    groups: RenderGroup[];

}

/* ---------- Scene ---------- */

export interface Scene {

    id: string;

    name: string;

    layers: SceneLayer[];

    cameras: Camera[];

    lights: Light[];

    materials: Material[];

    activeCameraId: string | null;

}

/* ---------- Render Settings ---------- */

export interface RenderSettings {

    backgroundColor: string;

    antialias: boolean;

    shadows: boolean;

    exposure: number;

    targetFps: number;

}

/* ---------- Render State ---------- */

export interface RenderState {

    status: RenderStatus;

    activeSceneId: string | null;

    frameCount: number;

    fps: number;

}

/* ---------- Renderer ---------- */

export interface Renderer {

    id: string;

    scenes: Scene[];

    activeSceneId: string | null;

    settings: RenderSettings;

    state: RenderState;

}
