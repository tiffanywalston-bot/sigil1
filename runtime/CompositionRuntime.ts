// runtime/CompositionRuntime.ts

/**
 * runtime/CompositionRuntime.ts
 *
 * Composition layer. Decides WHAT a session's audio should
 * contain — which frequencies, which harmonic layers, relative
 * amplitudes, binaural usage, duration — and hands the decision
 * off to AudioRuntime for generation and the existing WAV
 * pipeline for export. This file contains no DSP: every sample
 * is produced by AudioRuntime; every byte is produced by
 * WavEncoder/AudioExporter. Nothing here duplicates that math.
 *
 * Session contract reuse (SessionTypes.ts — not
 * models/SessionModel.ts, which lacks durationMinutes entirely):
 *   - session.settings.audioMixId  -> composition selector,
 *     looked up in COMPOSITION_PRESETS below. Falls back to
 *     DEFAULT_PRESET_ID if null or unrecognized.
 *   - session.timing.durationMinutes -> composition duration.
 *     Falls back to HARMONICS.DEFAULT_DURATION_MINUTES (15) if
 *     zero, negative, or non-finite.
 *
 * SessionTypes.ts is NOT modified. SessionMode ("SOLO"/"SHARED")
 * is untouched and unrelated to composition selection — the type
 * introduced here is CompositionPreset, a distinct concept keyed
 * by audioMixId, not a session mode.
 *
 * Preset data:
 *   Frequencies are reused directly from
 *   FrequencyLibrary.ts's immutable Frequency objects.
 *   The binaural default beat (7.83 Hz) is
 *   HarmonicConstants.BINAURAL.DEFAULT_BEAT.
 *
 *   Per-layer amplitude ratios and the preset-to-id mapping
 *   itself are NEW authored composition content — no such data
 *   exists anywhere in the repository. They are declared plainly
 *   as constants here, not presented as if sourced from elsewhere.
 *
 * Binaural left/right split:
 *   AudioRuntime.generateBinauralPair requires two explicit
 *   frequencies, not a center+beat pair — no such split
 *   convention exists anywhere in the repository. This file
 *   picks the minimal, stated convention: left = preset's
 *   binauralBaseFrequency, right = left + binauralBeat. That
 *   matches FrequencyMath.beatFrequency's own definition
 *   (|a - b|), so the resulting beat is exactly what the preset
 *   declares — no new math, just a documented choice of which
 *   two frequencies to hand to AudioRuntime.
 */

import type { Frequency } from "../HarmonicTypes";
import type { AudioBuffer as SigilAudioBuffer } from "../AudioTypes";
import type { Session } from "../SessionTypes";

import { AudioRuntime } from "./AudioRuntime";
import { AudioExporter, type EncodedAudioExport } from "./AudioExporter";

import { HARMONICS } from "../HarmonicConstants";
import { AUDIO } from "../AudioConstants";

import {
    HARMONIC_FAMILY,
    SOLFEGGIO_FREQUENCY_LIST
} from "../libraries/FrequencyLibrary";

/* ============================================================
 * Composition Preset — the type this file introduces.
 * Deliberately NOT named SessionMode; unrelated to
 * SessionTypes.SessionMode.
 * ============================================================ */

export interface CompositionLayer {

    readonly frequency: Frequency;

    /** Relative amplitude within this preset's mix, 0..HARMONICS.MAX_VOLUME. */
    readonly amplitude: number;

}

export interface CompositionPreset {

    readonly id: string;

    readonly name: string;

    /** Harmonic layers, generated and mixed via AudioRuntime. */
    readonly layers: readonly CompositionLayer[];

    /** Whether this preset includes a binaural component. */
    readonly binauralEnabled: boolean;

    /** Left-channel anchor frequency for the binaural pair, if enabled. */
    readonly binauralBaseFrequency: Frequency;

    /** Beat frequency in Hz; right = binauralBaseFrequency + this value. */
    readonly binauralBeat: number;

    /** Relative amplitude of the binaural layer within the final mix. */
    readonly binauralAmplitude: number;

}

/* ============================================================
 * Preset Constants
 *
 * Frequencies below reuse immutable Frequency objects from
 * FrequencyLibrary.ts. Amplitude ratios and the
 * id/name/grouping are new composition content authored here.
 * ============================================================ */

export const DEFAULT_PRESET_ID = "harmonic-triad" as const;

export const COMPOSITION_PRESETS: Readonly<Record<string, CompositionPreset>> = Object.freeze({

    "harmonic-triad": Object.freeze({
        id: "harmonic-triad",
        name: "Harmonic Triad",
        layers: Object.freeze([
            Object.freeze({ frequency: HARMONIC_FAMILY[2], amplitude: 1.0 }),
            Object.freeze({ frequency: HARMONIC_FAMILY[4], amplitude: 0.6 }),
            Object.freeze({ frequency: HARMONIC_FAMILY[5], amplitude: 0.3 })
        ]),
        binauralEnabled: true,
        binauralBaseFrequency: HARMONIC_FAMILY[2],
        binauralBeat: HARMONICS.BINAURAL.DEFAULT_BEAT,
        binauralAmplitude: 0.5
    }),

    "solfeggio-single": Object.freeze({
        id: "solfeggio-single",
        name: "Solfeggio 528",
        layers: Object.freeze([
            Object.freeze({ frequency: SOLFEGGIO_FREQUENCY_LIST[4], amplitude: 1.0 })
        ]),
        binauralEnabled: false,
        binauralBaseFrequency: HARMONIC_FAMILY[2],
        binauralBeat: HARMONICS.BINAURAL.DEFAULT_BEAT,
        binauralAmplitude: 0
    })

});

/* ============================================================
 * Composition Result
 * ============================================================ */

export interface CompositionResult {

    readonly presetId: string;

    readonly durationMinutes: number;

    readonly buffer: SigilAudioBuffer;

}

export class CompositionRuntime {

    private constructor() {

        // Static utility class only — never instantiated,
        // matching the convention of AudioRuntime, WavEncoder,
        // and AudioExporter.

    }

    /* ---------- Selection ---------- */

    /**
     * Resolves session.settings.audioMixId to a CompositionPreset.
     * Falls back to DEFAULT_PRESET_ID if null or unrecognized —
     * never throws on a missing/unknown selector.
     */
    static resolvePreset(session: Session): CompositionPreset {

        const selector = session.settings.audioMixId;

        if (selector && COMPOSITION_PRESETS[selector]) {
            return COMPOSITION_PRESETS[selector];
        }

        return COMPOSITION_PRESETS[DEFAULT_PRESET_ID];

    }

    /**
     * Resolves session.timing.durationMinutes. Falls back to
     * HARMONICS.DEFAULT_DURATION_MINUTES if zero, negative, or
     * non-finite.
     */
    static resolveDurationMinutes(session: Session): number {

        const requested = session.timing.durationMinutes;

        if (Number.isFinite(requested) && requested > 0) {
            return requested;
        }

        return HARMONICS.DEFAULT_DURATION_MINUTES;

    }

    /* ---------- Composition ---------- */

    /**
     * Assembles a preset into a final stereo AudioBuffer. Every
     * sample comes from AudioRuntime — this method only decides
     * which AudioRuntime calls to make and how to combine their
     * results (via AudioRuntime.mixBuffers itself, not new
     * summation logic).
     */
    static compose(session: Session): CompositionResult {

        const preset = CompositionRuntime.resolvePreset(session);
        const durationMinutes = CompositionRuntime.resolveDurationMinutes(session);
        const durationSeconds = durationMinutes * 60;

        if (preset.layers.length === 0) {
            throw new Error(
                "CompositionRuntime.compose: preset must contain at least one layer."
            );
        }

        const layerBuffers = preset.layers.map(layer =>
            AudioRuntime.generateSineBuffer(
                layer.frequency,
                layer.amplitude,
                HARMONICS.DEFAULT_PHASE,
                durationSeconds
            )
        );

        const harmonicMix = AudioRuntime.mixBuffers(layerBuffers);

        let left: number[];
        let right: number[];

        if (preset.binauralEnabled) {

            const rightFrequency: Frequency = {
                value: preset.binauralBaseFrequency.value + preset.binauralBeat,
                unit: "Hz"
            };

            const pair = AudioRuntime.generateBinauralPair(
                preset.binauralBaseFrequency,
                rightFrequency,
                preset.binauralAmplitude,
                durationSeconds
            );

            left = AudioRuntime.mixBuffers([harmonicMix, pair.left]);
            right = AudioRuntime.mixBuffers([harmonicMix, pair.right]);

        } else {

            left = [...harmonicMix];
            right = [...harmonicMix];

        }

        const normalizedLeft = AudioRuntime.normalizeBuffer(left, AUDIO.MAX_GAIN);
        const normalizedRight = AudioRuntime.normalizeBuffer(right, AUDIO.MAX_GAIN);

        const buffer = AudioRuntime.assembleAudioBuffer(
            `composition-${preset.id}`,
            normalizedLeft,
            normalizedRight
        );

        return {
            presetId: preset.id,
            durationMinutes,
            buffer
        };

    }

    /* ---------- Composition + Export ---------- */

    /**
     * Composes a session's audio and delegates export to the
     * existing WAV pipeline (runtime/AudioExporter.ts). No
     * encoding logic lives here.
     */
    static composeAndExport(
        session: Session,
        filename?: string
    ): EncodedAudioExport {

        const result = CompositionRuntime.compose(session);

        return AudioExporter.buildExport(
            result.buffer,
            filename ?? `${result.presetId}-${session.id}`
        );

    }

}

    /* ---------- Composition + Export ---------- */

    /**
     * Composes a session's audio and delegates export to the
     * existing WAV pipeline (runtime/AudioExporter.ts). No
     * encoding logic lives here.
     */
    static composeAndExport(
        session: Session,
        filename?: string
    ): EncodedAudioExport {

        const result = CompositionRuntime.compose(session);

        return AudioExporter.buildExport(
            result.buffer,
            filename ?? `${result.presetId}-${session.id}`
        );

    }

}
