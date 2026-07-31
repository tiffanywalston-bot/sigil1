/**
 * RenderConstants.ts
 *
 * Immutable rendering configuration.
 * Controls renderer defaults only.
 * No engine logic.
 * No harmonic logic.
 */

export const RENDER = Object.freeze({

    BACKGROUND_COLOR: 0x000000,

    CLEAR_ALPHA: 1.0,

    ANTIALIAS: true,

    ALPHA: false,

    SHADOWS: true,

    PHYSICALLY_CORRECT_LIGHTS: true,

    COLOR_SPACE: "srgb",

    TONE_MAPPING: "ACESFilmic",

    EXPOSURE: 1.0,

    CAMERA: Object.freeze({

        FOV: 45,

        NEAR: 0.1,

        FAR: 100000,

        DEFAULT_DISTANCE: 250

    }),

    LIGHTING: Object.freeze({

        AMBIENT_INTENSITY: 0.5,

        DIRECTIONAL_INTENSITY: 2.0,

        POINT_INTENSITY: 1.0

    }),

    GRID: Object.freeze({

        ENABLED: false

    }),

    AXES: Object.freeze({

        ENABLED: false

    }),

    STATS: Object.freeze({

        ENABLED: false

    }),

    DEBUG: Object.freeze({

        ENABLED: false

    }),

    LABELS: Object.freeze({

        ENABLED: true

    }),

    ANIMATION: Object.freeze({

        ENABLED: true,

        TARGET_FPS: 60

    })

} as const);