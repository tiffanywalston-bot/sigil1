/**
 * UniverseTypes.ts
 *
 * Shared universe data types for Sigil1.
 * No logic.
 * No classes.
 * No functions.
 * Types only.
 */

import type { Vector3, Bounds, Transform } from "./GeometryTypes";

/* ---------- Source ---------- */

export interface Source {

    id: string;

    position: Vector3;

    radius: number;

    intensity: number;

    active: boolean;

}

/* ---------- Receiver (Milky Way) ---------- */

export interface Receiver {

    id: string;

    position: Vector3;

    radius: number;

    sensitivity: number;

    active: boolean;

}

/* ---------- Universe State ---------- */

export type UniverseState =
    | "DORMANT"
    | "STABILIZING"
    | "ACTIVE"
    | "EXPANDING"
    | "COLLAPSING";

/* ---------- Universe ---------- */

export interface Universe {

    id: string;

    name: string;

    state: UniverseState;

    bounds: UniverseBounds;

    transform: Transform;

}

/* ---------- Parallel Universe ---------- */

export interface ParallelUniverse extends Universe {

    axisId: string;

    index: number;

    harmonicOffset: number;

}

/* ---------- Universe Collection ---------- */

export interface UniverseCollection {

    id: string;

    universes: ParallelUniverse[];

    count: number;

}

/* ---------- Universe Bounds ---------- */

export interface UniverseBounds {

    center: Vector3;

    radius: number;

    bounds: Bounds;

}

/* ---------- Universe Field ---------- */

export interface UniverseField {

    id: string;

    center: Vector3;

    radius: number;

    strength: number;

    falloff: number;

}

/* ---------- Universe Connection ---------- */

export interface UniverseConnection {

    id: string;

    originUniverseId: string;

    destinationUniverseId: string;

    strength: number;

    active: boolean;

}

/* ---------- Universe Bridge ---------- */

export interface UniverseBridge {

    id: string;

    connection: UniverseConnection;

    stability: number;

    field: UniverseField;

}
