/**
 * AudioConstants.ts
 *
 * Immutable audio configuration.
 * Shared by the WAV, Binaural, Subliminal,
 * and Harmonic systems.
 * No engine logic.
 */

export const AUDIO = Object.freeze({

    SAMPLE_RATE: 44100,

    BIT_DEPTH: 16,

    CHANNELS: 2,

    MASTER_GAIN: 1.0,

    MIN_GAIN: 0.0,

    MAX_GAIN: 1.0,

    FADE_IN_SECONDS: 2,

    FADE_OUT_SECONDS: 2,

    NORMALIZATION: true,

    WAV: Object.freeze({

        FORMAT: "PCM",

        EXTENSION: ".wav"

    }),

    BINAURAL: Object.freeze({

        ENABLED: true,

        LEFT_CHANNEL: 0,

        RIGHT_CHANNEL: 1,

        MIN_BEAT_FREQUENCY: 0.1,

        DEFAULT_BEAT_FREQUENCY: 7.83,

        MAX_BEAT_FREQUENCY: 40

    }),

    SUBLIMINAL: Object.freeze({

        ENABLED: true,

        DEFAULT_GAIN: 0.15,

        MIN_GAIN: 0.00,

        MAX_GAIN: 0.50

    }),

    PLAYBACK: Object.freeze({

        LOOP: false,

        AUTOPLAY: false

    }),

    EXPORT: Object.freeze({

        DEFAULT_FILENAME: "sigil1-session",

        MIME_TYPE: "audio/wav"

    })

} as const);