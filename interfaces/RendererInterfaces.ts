/**
 * RendererInterfaces.ts
 *
 * Shared renderer contracts for Sigil1.
 * Interfaces only.
 * No types, enums, classes, or implementation.
 * No renderer logic.
 *
 * The renderer depends on the engine.
 * The engine must never depend on the renderer.
 */

import type {
    Identifiable,
    Initializable,
    Updatable,
    Disposable,
    Engine
} from "./EngineInterfaces";

/* ---------- Animation Controller ---------- */

export interface AnimationController extends Updatable {

    playing: boolean;

    speed: number;

    play(): void;

    pause(): void;

    reset(): void;

}

/* ---------- Render Pass ---------- */

export interface RenderPass extends Identifiable {

    name: string;

    enabled: boolean;

    order: number;

    execute(): void;

}

/* ---------- Render Pipeline ---------- */

export interface RenderPipeline extends Identifiable, Updatable {

    passes: RenderPass[];

    addPass(pass: RenderPass): void;

    removePass(passId: string): void;

}

/* ---------- Material ---------- */

export interface Material extends Identifiable, Disposable {

    name: string;

    loaded: boolean;

    load(): void;

}

/* ---------- Light ---------- */

export interface Light extends Identifiable {

    enabled: boolean;

    intensity: number;

    setIntensity(intensity: number): void;

    enable(): void;

    disable(): void;

}

/* ---------- Camera ---------- */

export interface Camera extends Identifiable {

    active: boolean;

    activate(): void;

    deactivate(): void;

}

/* ---------- Render Object ---------- */

export interface RenderObject extends Identifiable, Updatable {

    visible: boolean;

    materialId: string | null;

    show(): void;

    hide(): void;

}

/* ---------- Scene Layer ---------- */

export interface SceneLayer extends Identifiable, Updatable {

    name: string;

    visible: boolean;

    objects: RenderObject[];

    addObject(object: RenderObject): void;

    removeObject(objectId: string): void;

}

/* ---------- Scene ---------- */

export interface Scene extends Identifiable, Initializable, Updatable {

    name: string;

    layers: SceneLayer[];

    cameras: Camera[];

    lights: Light[];

    activeCamera: Camera | null;

    addLayer(layer: SceneLayer): void;

    removeLayer(layerId: string): void;

}

/* ---------- Renderer ---------- */

export interface Renderer
    extends Identifiable, Initializable, Updatable, Disposable {

    engine: Engine;

    scene: Scene | null;

    pipeline: RenderPipeline;

    animation: AnimationController;

    setScene(scene: Scene): void;

    render(): void;

}
