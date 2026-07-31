/**
 * GeometryConstants.ts
 *
 * Immutable geometric values used throughout Sigil1.
 * No engine logic.
 * No rendering logic.
 */

export const GEOMETRY = Object.freeze({

    DIMENSIONS: 3,

    ORIGIN: Object.freeze({
        X: 0,
        Y: 0,
        Z: 0
    }),

    UNIT_SCALE: 1.0,

    AXIS: Object.freeze({
        MIN_LENGTH: 1,
        DEFAULT_LENGTH: 100,
        MAX_LENGTH: 10000,
        THICKNESS: 0.02
    }),

    SOURCE: Object.freeze({
        DEFAULT_RADIUS: 2,
        MIN_RADIUS: 0.5,
        MAX_RADIUS: 100
    }),

    RECEIVER: Object.freeze({
        DEFAULT_RADIUS: 2,
        MIN_RADIUS: 0.5,
        MAX_RADIUS: 100
    }),

    UNIVERSE: Object.freeze({
        DEFAULT_RADIUS: 100,
        MIN_RADIUS: 10,
        MAX_RADIUS: 100000
    }),

    STRUCTURAL_RINGS: Object.freeze({
        COUNT: 3,
        MIN_RADIUS: 5,
        DEFAULT_RADIUS: 15,
        MAX_RADIUS: 100
    }),

    HARMONIC_RINGS: Object.freeze({
        COUNT: 3,
        MIN_RADIUS: 6,
        DEFAULT_RADIUS: 18,
        MAX_RADIUS: 120
    }),

    PARALLEL_UNIVERSES: Object.freeze({
        DEFAULT_COUNT: 9,
        MIN_COUNT: 1,
        MAX_COUNT: 64
    }),

    CLOUDS: Object.freeze({
        MIN_COUNT: 10,
        DEFAULT_COUNT: 50,
        MAX_COUNT: 250
    }),

    STARS: Object.freeze({
        MIN_COUNT: 100,
        DEFAULT_COUNT: 5000,
        MAX_COUNT: 50000
    })

} as const);