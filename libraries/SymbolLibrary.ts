// SymbolLibrary.ts
/**
 * SymbolLibrary.ts
 *
 * Data library only.
 * No classes.
 * No functions.
 * No calculations.
 * No engine logic.
 * No renderer logic.
 * No geometry. No rendering instructions. No AI mappings.
 * No user customization.
 *
 * Every export is Object.freeze()'d. Values are hardcoded
 * literals — nothing here is derived or computed.
 *
 * "meaning" describes each symbol's role within Sigil1's own
 * architecture (what it stands for in the engine's layer
 * system), not a claim about real-world or esoteric effect.
 */

export type SymbolCategory =
    | "ORIGIN"
    | "GEOMETRIC"
    | "DYNAMIC"
    | "MATERIAL"
    | "CONNECTIVE";

interface SymbolDefinition {

    readonly id: string;

    readonly name: string;

    readonly category: SymbolCategory;

    readonly description: string;

    readonly meaning: string;

}

/* ---------- Source ---------- */

export const SOURCE_SYMBOL: SymbolDefinition = Object.freeze({
    id: "symbol-source",
    name: "Source",
    category: "ORIGIN",
    description: "A single point positioned above all other layers.",
    meaning: "Represents the originating point from which the engine's structure extends."
});

/* ---------- Axis ---------- */

export const AXIS_SYMBOL: SymbolDefinition = Object.freeze({
    id: "symbol-axis",
    name: "Axis",
    category: "ORIGIN",
    description: "A single line running through the vertical center of the structure.",
    meaning: "Represents the connective spine that links every layer to the Source."
});

/* ---------- Circle ---------- */

export const CIRCLE_SYMBOL: SymbolDefinition = Object.freeze({
    id: "symbol-circle",
    name: "Circle",
    category: "GEOMETRIC",
    description: "A closed curve equidistant from a central point.",
    meaning: "Represents a bounded, self-contained layer or field."
});

/* ---------- Triangle ---------- */

export const TRIANGLE_SYMBOL: SymbolDefinition = Object.freeze({
    id: "symbol-triangle",
    name: "Triangle",
    category: "GEOMETRIC",
    description: "A three-sided closed shape, the simplest rigid polygon.",
    meaning: "Represents a minimal stable structural relationship between three elements."
});

/* ---------- Square ---------- */

export const SQUARE_SYMBOL: SymbolDefinition = Object.freeze({
    id: "symbol-square",
    name: "Square",
    category: "GEOMETRIC",
    description: "A four-sided closed shape with equal sides and right angles.",
    meaning: "Represents a balanced, evenly-distributed structural layer."
});

/* ---------- Hexagon ---------- */

export const HEXAGON_SYMBOL: SymbolDefinition = Object.freeze({
    id: "symbol-hexagon",
    name: "Hexagon",
    category: "GEOMETRIC",
    description: "A six-sided closed shape with six-fold rotational symmetry.",
    meaning: "Represents a densely interconnected layer, as seen in the engine's harmonic and crystal geometry."
});

/* ---------- Spiral ---------- */

export const SPIRAL_SYMBOL: SymbolDefinition = Object.freeze({
    id: "symbol-spiral",
    name: "Spiral",
    category: "DYNAMIC",
    description: "A curve that winds around a fixed center while continuously moving outward or inward.",
    meaning: "Represents ongoing expansion or contraction of a layer over time."
});

/* ---------- Crystal ---------- */

export const CRYSTAL_SYMBOL: SymbolDefinition = Object.freeze({
    id: "symbol-crystal",
    name: "Crystal",
    category: "MATERIAL",
    description: "A faceted solid with a table, crown, girdle, and pavilion.",
    meaning: "Represents a structural node that gives form to a layer's identity."
});

/* ---------- Star ---------- */

export const STAR_SYMBOL: SymbolDefinition = Object.freeze({
    id: "symbol-star",
    name: "Star",
    category: "MATERIAL",
    description: "A small point of light with radiating points.",
    meaning: "Represents a fixed reference point within the engine's background field."
});

/* ---------- Ring ---------- */

export const RING_SYMBOL: SymbolDefinition = Object.freeze({
    id: "symbol-ring",
    name: "Ring",
    category: "MATERIAL",
    description: "A circular band with a hollow center.",
    meaning: "Represents a boundary that encloses and stabilizes an inner layer."
});

/* ---------- Wave ---------- */

export const WAVE_SYMBOL: SymbolDefinition = Object.freeze({
    id: "symbol-wave",
    name: "Wave",
    category: "DYNAMIC",
    description: "A periodic oscillation that repeats over a fixed interval.",
    meaning: "Represents rhythmic variation propagating through a layer."
});

/* ---------- Bridge ---------- */

export const BRIDGE_SYMBOL: SymbolDefinition = Object.freeze({
    id: "symbol-bridge",
    name: "Bridge",
    category: "CONNECTIVE",
    description: "A connecting span between two otherwise separate points.",
    meaning: "Represents a stabilized connection between two distinct layers or universes."
});

/* ---------- Parallel Universe ---------- */

export const PARALLEL_UNIVERSE_SYMBOL: SymbolDefinition = Object.freeze({
    id: "symbol-parallel-universe",
    name: "Parallel Universe",
    category: "CONNECTIVE",
    description: "A branch diverging from the central axis at a fixed offset.",
    meaning: "Represents an alternate structural path originating from the same Axis."
});

/* ---------- Collection ---------- */

export const SYMBOLS: Readonly<Record<string, SymbolDefinition>> = Object.freeze({
    SOURCE: SOURCE_SYMBOL,
    AXIS: AXIS_SYMBOL,
    CIRCLE: CIRCLE_SYMBOL,
    TRIANGLE: TRIANGLE_SYMBOL,
    SQUARE: SQUARE_SYMBOL,
    HEXAGON: HEXAGON_SYMBOL,
    SPIRAL: SPIRAL_SYMBOL,
    CRYSTAL: CRYSTAL_SYMBOL,
    STAR: STAR_SYMBOL,
    RING: RING_SYMBOL,
    WAVE: WAVE_SYMBOL,
    BRIDGE: BRIDGE_SYMBOL,
    PARALLEL_UNIVERSE: PARALLEL_UNIVERSE_SYMBOL
});

export const SYMBOL_LIST: readonly SymbolDefinition[] = Object.freeze([
    SOURCE_SYMBOL,
    AXIS_SYMBOL,
    CIRCLE_SYMBOL,
    TRIANGLE_SYMBOL,
    SQUARE_SYMBOL,
    HEXAGON_SYMBOL,
    SPIRAL_SYMBOL,
    CRYSTAL_SYMBOL,
    STAR_SYMBOL,
    RING_SYMBOL,
    WAVE_SYMBOL,
    BRIDGE_SYMBOL,
    PARALLEL_UNIVERSE_SYMBOL
]);
