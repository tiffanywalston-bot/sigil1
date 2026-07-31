// SigilLibrary.ts
/**
 * SigilLibrary.ts
 *
 * Data library only.
 * No classes.
 * No functions.
 * No calculations.
 * No engine logic.
 * No renderer logic.
 * No procedural generation. No geometry. No SVG. No
 * coordinates. No rendering instructions. No AI mappings.
 * No user presets.
 *
 * Every export is Object.freeze()'d. Values are hardcoded
 * literals — nothing here is derived or computed.
 *
 * Descriptions are kept structural — what a sigil represents
 * within Sigil1's own layer architecture (Source, Axis,
 * Harmonic, etc., per EngineConstants.ts / scene.js) — not
 * claims about real-world effects.
 */

export type SigilCategory =
    | "SOURCE"
    | "AXIS"
    | "HARMONIC"
    | "STRUCTURAL"
    | "CRYSTAL"
    | "PROTECTION"
    | "CREATION"
    | "REFLECTION"
    | "PARALLEL_UNIVERSE";

interface SigilDefinition {

    readonly id: string;

    readonly name: string;

    readonly category: SigilCategory;

    readonly symmetry: string;

    readonly layerCount: number;

    readonly description: string;

}

/* ---------- Source ---------- */

export const SOURCE_SIGIL: SigilDefinition = Object.freeze({
    id: "sigil-source",
    name: "Source Sigil",
    category: "SOURCE",
    symmetry: "radial",
    layerCount: 1,
    description: "Marks the originating point at the top of the engine's structural hierarchy."
});

/* ---------- Axis ---------- */

export const AXIS_SIGIL: SigilDefinition = Object.freeze({
    id: "sigil-axis",
    name: "Axis Sigil",
    category: "AXIS",
    symmetry: "bilateral",
    layerCount: 1,
    description: "Marks the central vertical line connecting every layer of the engine."
});

/* ---------- Harmonic ---------- */

export const HARMONIC_SIGIL: SigilDefinition = Object.freeze({
    id: "sigil-harmonic",
    name: "Harmonic Sigil",
    category: "HARMONIC",
    symmetry: "6-fold radial",
    layerCount: 3,
    description: "Marks a harmonic ring layer, structured around repeating concentric divisions."
});

/* ---------- Structural ---------- */

export const STRUCTURAL_SIGIL: SigilDefinition = Object.freeze({
    id: "sigil-structural",
    name: "Structural Sigil",
    category: "STRUCTURAL",
    symmetry: "4-fold radial",
    layerCount: 2,
    description: "Marks a structural support layer that stabilizes adjacent layers of the engine."
});

/* ---------- Crystal ---------- */

export const CRYSTAL_SIGIL: SigilDefinition = Object.freeze({
    id: "sigil-crystal",
    name: "Crystal Sigil",
    category: "CRYSTAL",
    symmetry: "6-fold radial",
    layerCount: 4,
    description: "Marks a faceted node layer, structured around a table, crown, girdle, and pavilion."
});

/* ---------- Protection ---------- */

export const PROTECTION_SIGIL: SigilDefinition = Object.freeze({
    id: "sigil-protection",
    name: "Protection Sigil",
    category: "PROTECTION",
    symmetry: "8-fold radial",
    layerCount: 2,
    description: "Marks a boundary layer that encloses and separates an inner layer from outer layers."
});

/* ---------- Creation ---------- */

export const CREATION_SIGIL: SigilDefinition = Object.freeze({
    id: "sigil-creation",
    name: "Creation Sigil",
    category: "CREATION",
    symmetry: "12-fold radial",
    layerCount: 3,
    description: "Marks a generative layer where new structural elements originate within the engine."
});

/* ---------- Reflection ---------- */

export const REFLECTION_SIGIL: SigilDefinition = Object.freeze({
    id: "sigil-reflection",
    name: "Reflection Sigil",
    category: "REFLECTION",
    symmetry: "bilateral",
    layerCount: 2,
    description: "Marks a mirrored layer whose structure repeats an existing layer on the opposite side of the axis."
});

/* ---------- Parallel Universe ---------- */

export const PARALLEL_UNIVERSE_SIGIL: SigilDefinition = Object.freeze({
    id: "sigil-parallel-universe",
    name: "Parallel Universe Sigil",
    category: "PARALLEL_UNIVERSE",
    symmetry: "radial",
    layerCount: 1,
    description: "Marks a branch layer originating from the axis, distinct from the primary structural path."
});

/* ---------- Collection ---------- */

export const SIGILS: Readonly<Record<string, SigilDefinition>> = Object.freeze({
    SOURCE: SOURCE_SIGIL,
    AXIS: AXIS_SIGIL,
    HARMONIC: HARMONIC_SIGIL,
    STRUCTURAL: STRUCTURAL_SIGIL,
    CRYSTAL: CRYSTAL_SIGIL,
    PROTECTION: PROTECTION_SIGIL,
    CREATION: CREATION_SIGIL,
    REFLECTION: REFLECTION_SIGIL,
    PARALLEL_UNIVERSE: PARALLEL_UNIVERSE_SIGIL
});

export const SIGIL_LIST: readonly SigilDefinition[] = Object.freeze([
    SOURCE_SIGIL,
    AXIS_SIGIL,
    HARMONIC_SIGIL,
    STRUCTURAL_SIGIL,
    CRYSTAL_SIGIL,
    PROTECTION_SIGIL,
    CREATION_SIGIL,
    REFLECTION_SIGIL,
    PARALLEL_UNIVERSE_SIGIL
]);
