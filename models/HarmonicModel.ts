// HarmonicModel.ts
/**
 * HarmonicModel.ts
 *
 * Data model only.
 * No classes.
 * No functions.
 * No calculations.
 * No engine logic.
 * No renderer logic.
 * No behavior.
 *
 * Represents stored harmonic data only.
 *
 * Reuses Frequency, Amplitude, Phase, and Resonance from
 * HarmonicTypes.ts, which has been verified to export all
 * four as { value: number } (Frequency additionally carries
 * a unit: "Hz" field). waveform remains a small local union
 * covering only the waveforms WaveMath.ts actually implements
 * today. harmonicFamily is an id reference (e.g. into
 * FrequencyLibrary.ts's HARMONIC_FAMILY), not an embedded
 * list — consistent with this model layer's other files
 * (AudioModel.ts, UniverseModel.ts) storing ids rather than
 * embedded objects.
 */

import type { Frequency, Amplitude, Phase, Resonance } from "../HarmonicTypes";

export type HarmonicWaveform =
    | "SINE"
    | "COSINE";

export interface HarmonicModel {

    readonly id: string;

    readonly frequency: Frequency;

    readonly harmonicFamily: string | null;

    readonly resonance: Resonance;

    readonly phase: Phase;

    readonly amplitude: Amplitude;

    readonly waveform: HarmonicWaveform;

}
