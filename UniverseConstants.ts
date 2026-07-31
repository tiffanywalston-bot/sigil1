/**
 * UniverseConstants.ts
 *
 * Immutable universe configuration.
 * Defines the conceptual structure of the Sigil1 universe.
 * No engine logic.
 */

export const UNIVERSE = Object.freeze({

    SOURCE: Object.freeze({

        ENABLED: true,

        COUNT: 1

    }),

    RECEIVER: Object.freeze({

        ENABLED: true,

        COUNT: 1

    }),

    AXIS: Object.freeze({

        COUNT: 1,

        SINGULAR: true

    }),

    PARALLEL_UNIVERSES: Object.freeze({

        ENABLED: true,

        DEFAULT_COUNT: 9,

        MIN_COUNT: 1,

        MAX_COUNT: 64

    }),

    STRUCTURAL_RINGS: Object.freeze({

        COUNT: 3

    }),

    HARMONIC_RINGS: Object.freeze({

        COUNT: 3

    }),

    CLOUDS: Object.freeze({

        ENABLED: true,

        DEFAULT_COUNT: 50

    }),

    STARS: Object.freeze({

        ENABLED: true,

        DEFAULT_COUNT: 5000

    }),

    MATERIALS: Object.freeze({

        ENABLED: true

    }),

    LIGHTING: Object.freeze({

        ENABLED: true

    }),

    SIGILS: Object.freeze({

        ENABLED: true

    }),

    WAV: Object.freeze({

        ENABLED: true

    }),

    BINAURAL: Object.freeze({

        ENABLED: true

    }),

    SUBLIMINAL: Object.freeze({

        ENABLED: true

    })

} as const);