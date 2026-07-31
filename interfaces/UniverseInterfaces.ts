/**
 * UniverseInterfaces.ts
 *
 * Shared universe contracts for Sigil1.
 * Interfaces only.
 * No types, enums, classes, or implementation.
 * No universe logic.
 *
 * The Axis is the origin of all parallel universes.
 * The universe subsystem must not depend on the renderer.
 */

import type {
    Identifiable,
    Initializable,
    Updatable,
    Disposable,
    Engine
} from "./EngineInterfaces";

/* ---------- Source ---------- */

export interface Source extends Identifiable {

    active: boolean;

    intensity: number;

    setIntensity(intensity: number): void;

    activate(): void;

    deactivate(): void;

}

/* ---------- Receiver ---------- */

export interface Receiver extends Identifiable {

    active: boolean;

    sensitivity: number;

    setSensitivity(sensitivity: number): void;

    activate(): void;

    deactivate(): void;

}

/* ---------- Axis ---------- */

export interface Axis extends Identifiable, Initializable {

    stable: boolean;

    universes: ParallelUniverse[];

    spawnParallelUniverse(): ParallelUniverse;

    removeParallelUniverse(universeId: string): void;

}

/* ---------- Universe ---------- */

export interface Universe extends Identifiable, Initializable, Updatable {

    active: boolean;

    activate(): void;

    deactivate(): void;

    stabilize(): void;

}

/* ---------- Parallel Universe ---------- */

export interface ParallelUniverse extends Universe {

    axisId: string;

    index: number;

    harmonicOffset: number;

    setHarmonicOffset(offset: number): void;

}

/* ---------- Universe Collection ---------- */

export interface UniverseCollection extends Identifiable, Updatable {

    universes: ParallelUniverse[];

    addUniverse(universe: ParallelUniverse): void;

    removeUniverse(universeId: string): void;

    getUniverse(universeId: string): ParallelUniverse | null;

}

/* ---------- Universe Field ---------- */

export interface UniverseField extends Identifiable, Updatable {

    strength: number;

    falloff: number;

    setStrength(strength: number): void;

    setFalloff(falloff: number): void;

}

/* ---------- Universe Connection ---------- */

export interface UniverseConnection extends Identifiable {

    active: boolean;

    strength: number;

    connect(): void;

    disconnect(): void;

    setStrength(strength: number): void;

}

/* ---------- Universe Bridge ---------- */

export interface UniverseBridge extends Identifiable, Updatable {

    connection: UniverseConnection;

    field: UniverseField;

    stability: number;

    stabilize(): void;

}

/* ---------- Universe Manager ---------- */

export interface UniverseManager extends Identifiable, Initializable, Updatable {

    axis: Axis;

    collection: UniverseCollection;

    bridges: UniverseBridge[];

    addBridge(bridge: UniverseBridge): void;

    removeBridge(bridgeId: string): void;

}

/* ---------- Universe Engine ---------- */

export interface UniverseEngine
    extends Identifiable, Initializable, Updatable, Disposable {

    engine: Engine;

    axis: Axis;

    manager: UniverseManager;

    source: Source;

    receiver: Receiver;

}
