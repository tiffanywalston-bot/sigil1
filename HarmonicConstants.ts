/**
 * HarmonicConstants.ts
 *
 * Immutable harmonic configuration.
 * Contains only universal harmonic values.
 * No engine logic.
 */

export const HARMONICS = Object.freeze({

    BASE_FREQUENCY: 432,

    REFERENCE_FREQUENCY: 440,

    DEFAULT_VOLUME: 0.80,

    MIN_VOLUME: 0.00,

    MAX_VOLUME: 1.00,

    DEFAULT_PHASE: 0,

    DEFAULT_AMPLITUDE: 1.0,

    DEFAULT_RESONANCE: 1.0,

    SAMPLE_RATE: 44100,

    BIT_DEPTH: 16,

    CHANNELS: 2,

    BPM: Object.freeze({
        MIN: 40,
        DEFAULT: 88,
        SECONDARY: 90,
        MAX: 240
    }),

    HARMONIC_FAMILIES: Object.freeze([
        216,
        324,
        432,
        540,
        648,
        864
    ]),

    SOLFEGGIO: Object.freeze([
        174,
        285,
        396,
        417,
        528,
        639,
        741,
        852,
        963
    ]),

    BINAURAL: Object.freeze({

        MIN_BEAT: 0.1,

        DEFAULT_BEAT: 7.83,

        MAX_BEAT: 40

    }),

    WAVES: Object.freeze({

        SINE: "sine",

        SQUARE: "square",

        TRIANGLE: "triangle",

        SAWTOOTH: "sawtooth"

    }),

    DEFAULT_DURATION_MINUTES: 15,

    MIN_DURATION_MINUTES: 1,

    MAX_DURATION_MINUTES: 180

} as const);