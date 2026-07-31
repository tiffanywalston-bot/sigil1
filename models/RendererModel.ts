// RendererModel.ts
/**
 * RendererModel.ts
 *
 * Data model only.
 * No classes.
 * No functions.
 * No calculations.
 * No engine logic.
 * No renderer behavior.
 * No rendering implementation.
 *
 * Represents renderer state only — id references into other
 * stored records (scene, camera, lights, materials), not
 * embedded objects, except for renderSettings/renderState
 * which are themselves plain data (no behavior) in
 * RendererTypes.ts.
 *
 * Reuses RenderSettings and RenderState from RendererTypes.ts
 * rather than redefining them.
 */

import type { RenderSettings, RenderState } from "./RendererTypes";

export interface RendererModel {

    readonly id: string;

    readonly sceneId: string | null;

    readonly activeCameraId: string | null;

    readonly lightIds: string[];

    readonly materialIds: string[];

    readonly renderSettings: RenderSettings;

    readonly renderState: RenderState;

}
