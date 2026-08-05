// UniverseModel.ts
/**
 * UniverseModel.ts
 *
 * Data model only.
 * No classes.
 * No functions.
 * No calculations.
 * No engine logic.
 * No renderer logic.
 * No behavior.
 *
 * Reuses UniverseState, UniverseBounds, UniverseConnection,
 * and UniverseField from UniverseTypes.ts, and Transform from
 * math/Transform.ts, rather than redefining any of them.
 *
 * Note: `fields` (plural of UniverseField) is a slightly
 * unusual property name — it reads like a generic "struct
 * fields" term, not just a data field. Kept exactly as
 * specified rather than renaming it (e.g. to
 * `universeFields`) unilaterally.
 */

import type {
    UniverseState,
    UniverseBounds,
    UniverseConnection,
    UniverseField
} from "../UniverseTypes";

import type { Transform } from "../math/Transform";

export interface UniverseModel {

    readonly id: string;

    readonly name: string;

    readonly axisId: string;

    readonly harmonicIndex: number;

    readonly state: UniverseState;

    readonly bounds: UniverseBounds;

    readonly transform: Transform;

    readonly connections: UniverseConnection[];

    readonly fields: UniverseField[];

}
