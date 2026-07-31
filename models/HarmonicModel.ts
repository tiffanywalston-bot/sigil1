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
 * Reuses Frequency from HarmonicTypes.ts. See the flag below
 * on the other fields: I could only confirm Frequency (and,
 * in earlier locked files, HarmonicWave) as actual exports of
 * HarmonicTypes.ts from how prior files used it — I have not
 * seen HarmonicTypes.ts's full contents directly. Rather than
 * guess at type names (Resonance, Phase, Amplitude, Waveform)
 * that may or may not exist there and risk a broken import,
 * amplitude/phase/resonance are plain numbers here (matching
 * how WaveMath.ts and HarmonicMath.ts already treat them),
 * and waveform is a small local union covering only the
 * waveforms WaveMath.ts actually implements today.
 * harmonicFamily is an id reference (e.g. into
 * FrequencyLibrary.ts's HARMONIC_FAMILY), not an embedded
 * list — consistent with this model layer's other files
 * (AudioModel.ts, UniverseModel.ts) storing ids rather than
 * embedded objects.
 */

import type { Frequency } from "./HarmonicTypes";

export type HarmonicWaveform =
    | "SINE"
    | "COSINE";

export interface HarmonicModel {

    readonly id: string;

    readonly frequency: Frequency;

    readonly harmonicFamily: string | null;

    readonly resonance: number;

    readonly phase: number;

    readonly amplitude: number;

    readonly waveform: HarmonicWaveform;

}
