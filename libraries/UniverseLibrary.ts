/**
 * UniverseLibrary.ts
 *
 * Data library only.
 * No classes.
 * No functions.
 * No calculations.
 * No engine logic.
 * No renderer logic.
 * No physics simulation. No procedural generation. No
 * rendering instructions. No AI mappings. No user presets.
 *
 * Every export is Object.freeze()'d. Values are hardcoded
 * literals — nothing here is derived or computed.
 *
 * Descriptions explain each universe's role within Sigil1's
 * own architecture (per UniverseTypes.ts / UniverseInterfaces.ts),
 * not claims about the physical universe.
 */

import type { UniverseState } from "../UniverseTypes";

export type UniverseLibraryCategory =
    | "PRIMARY"
    | "PARALLEL"
    | "REFLECTION"
    | "HARMONIC"
    | "BRIDGE";

interface UniverseDefinition {

    readonly id: string;

    readonly name: string;

    readonly category: UniverseLibraryCategory;

    readonly harmonicIndex: number;

    readonly defaultState: UniverseState;

    readonly description: string;

}

/* ---------- Primary Universe ---------- */

export const PRIMARY_UNIVERSE: UniverseDefinition = Object.freeze({
    id: "universe-primary",
    name: "Primary Universe",
    category: "PRIMARY",
    harmonicIndex: 0,
    defaultState: "ACTIVE",
    description: "The base universe from which the Axis and all parallel universes originate."
});

/* ---------- Reflection Universe ---------- */

export const REFLECTION_UNIVERSE: UniverseDefinition = Object.freeze({
    id: "universe-reflection",
    name: "Reflection Universe",
    category: "REFLECTION",
    harmonicIndex: 1,
    defaultState: "DORMANT",
    description: "A universe whose structure mirrors the Primary Universe across the Axis."
});

/* ---------- Harmonic Universe ---------- */

export const HARMONIC_UNIVERSE: UniverseDefinition = Object.freeze({
    id: "universe-harmonic",
    name: "Harmonic Universe",
    category: "HARMONIC",
    harmonicIndex: 2,
    defaultState: "DORMANT",
    description: "A universe positioned at a harmonic offset from the Primary Universe along the Axis."
});

/* ---------- Parallel Universe ---------- */

export const PARALLEL_UNIVERSE: UniverseDefinition = Object.freeze({
    id: "universe-parallel",
    name: "Parallel Universe",
    category: "PARALLEL",
    harmonicIndex: 3,
    defaultState: "DORMANT",
    description: "A universe branching from the Axis independently of the Primary Universe."
});

/* ---------- Bridge Universe ---------- */

export const BRIDGE_UNIVERSE: UniverseDefinition = Object.freeze({
    id: "universe-bridge",
    name: "Bridge Universe",
    category: "BRIDGE",
    harmonicIndex: 4,
    defaultState: "STABILIZING",
    description: "A universe representing a stabilized connection between two other universes."
});

/* ---------- Collection ---------- */

export const UNIVERSES: Readonly<Record<string, UniverseDefinition>> = Object.freeze({
    PRIMARY: PRIMARY_UNIVERSE,
    REFLECTION: REFLECTION_UNIVERSE,
    HARMONIC: HARMONIC_UNIVERSE,
    PARALLEL: PARALLEL_UNIVERSE,
    BRIDGE: BRIDGE_UNIVERSE
});

export const UNIVERSE_LIST: readonly UniverseDefinition[] = Object.freeze([
    PRIMARY_UNIVERSE,
    REFLECTION_UNIVERSE,
    HARMONIC_UNIVERSE,
    PARALLEL_UNIVERSE,
    BRIDGE_UNIVERSE
]);
