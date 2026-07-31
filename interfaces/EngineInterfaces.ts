/**
 * EngineInterfaces.ts
 *
 * Shared engine contracts for Sigil1.
 * Interfaces only.
 * No types, enums, classes, or functions.
 * No implementation.
 */

import type { UniverseCollection } from "./UniverseTypes";
import type { AudioState } from "./AudioTypes";
import type { Session } from "./SessionTypes";

/* ---------- Identifiable ---------- */

export interface Identifiable {

    id: string;

}

/* ---------- Initializable ---------- */

export interface Initializable {

    initialize(): void;

}

/* ---------- Updatable ---------- */

export interface Updatable {

    update(delta: number): void;

}

/* ---------- Disposable ---------- */

export interface Disposable {

    dispose(): void;

}

/* ---------- Serializable ---------- */

export interface Serializable {

    serialize(): string;

}

/* ---------- Validatable ---------- */

export interface Validatable {

    validate(): boolean;

}

/* ---------- Configurable ---------- */

export interface Configurable {

    configure(config: Record<string, unknown>): void;

}

/* ---------- Engine Component ---------- */

export interface EngineComponent
    extends Identifiable, Initializable, Updatable, Disposable {

    enabled: boolean;

}

/* ---------- Engine Module ---------- */

export interface EngineModule
    extends EngineComponent, Configurable, Validatable {

    name: string;

    version: string;

}

/* ---------- Engine ---------- */

export interface Engine
    extends Identifiable, Initializable, Updatable, Disposable {

    running: boolean;

    modules: EngineModule[];

    universe: UniverseCollection;

    audio: AudioState;

    session: Session;

}
