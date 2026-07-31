/**
 * EngineConstants.ts
 *
 * Global constants used throughout Sigil1.
 * This file must remain free of engine logic.
 */

export const ENGINE = Object.freeze({

    NAME: "Sigil1",

    VERSION: "1.0.0",

    AUTHOR: "JEWELS",

    BUILD: "FOUNDATION",

    MAX_PARALLEL_UNIVERSES: 64,

    DEFAULT_PARALLEL_UNIVERSES: 9,

    MAX_STRUCTURAL_RINGS: 3,

    MAX_HARMONIC_RINGS: 3,

    MAX_SIGILS: 1024,

    MAX_STARS: 50000,

    MAX_CLOUDS: 250,

    MAX_MATERIALS: 128,

    MAX_LIGHTS: 32,

    MAX_CAMERAS: 4,

    TARGET_FPS: 60,

    FIXED_TIMESTEP: 1 / 60,

    AUDIO_SAMPLE_RATE: 44100,

    AUDIO_CHANNELS: 2,

    DEFAULT_SESSION_MINUTES: 15,

    DEFAULT_AXIS_LENGTH: 1.0,

    DEFAULT_UNIVERSE_RADIUS: 100,

    DEFAULT_SOURCE_RADIUS: 2,

    DEFAULT_RECEIVER_RADIUS: 2

} as const);