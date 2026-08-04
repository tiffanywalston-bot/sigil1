// runtime/AudioRuntime.ts

/**
 * runtime/AudioRuntime.ts
 *
 * Shared audio runtime layer.
 *
 * This file implements NOTHING new mathematically. Every
 * operation below is direct composition of methods that
 * already exist in:
 *   - math/WaveMath.ts       (per-sample oscillator + buffer math)
 *   - math/FrequencyMath.ts  (frequency-domain calculations)
 *   - math/HarmonicMath.ts   (harmonic series + interference)
 *   - AudioConstants.ts      (AUDIO — sample rate, gain, WAV/
 *                              binaural/subliminal/export bounds)
 *   - HarmonicConstants.ts   (HARMONICS — base frequency, harmonic
 *                              families, Solfeggio set, waveform
 *                              labels, duration bounds)
 *
 * WaveCapability, BinauralCapability, SubliminalCapability, and
 * ExportCapability are NOT implemented here and are not touched
 * by this file. They are expected to delegate to the functions
 * below once they are implemented, per the directive that
 * created this file.
 *
 * Known gaps, stated rather than filled:
 *
 *   1. HarmonicConstants.WAVES declares four waveform labels
 *      (SINE, SQUARE, TRIANGLE, SAWTOOTH), but WaveMath.ts only
 *      implements sineWave() and cosineWave(). There is no
 *      square/triangle/sawtooth generation anywhere in the
 *      repository. This file therefore only exposes sine/cosine
 *      generation — it does not fabricate the missing three.
 *
 *   2. AudioConstants declares FADE_IN_SECONDS/FADE_OUT_SECONDS,
 *      implying an envelope/fade step is expected somewhere in
 *      the pipeline. No fade-curve math exists in WaveMath.ts or
 *      anywhere else in the repository. Implementing one would
 *      be new algorithmic logic, not reuse — out of scope for
 *      this file. No fade function is provided here.
 *
 *   3. math/WaveMath.ts, math/FrequencyMath.ts, and
 *      math/HarmonicMath.ts each import `Frequency` from
 *      "./HarmonicTypes" (relative to math/), but HarmonicTypes.ts
 *      only exists at the repository root. That import does not
 *      resolve as written in those three files. This file imports
 *      Frequency from its real, root-level location instead — but
 *      the defect in those three files is unchanged and still
 *      needs to be fixed there directly.
 *
 *   4. Like the rest of this repository's architectural layer,
 *      this file is TypeScript with no build step present in the
 *      repo. It is not loaded by index.html/engine.js and will not
 *      run until a compile step exists or it is ported to plain
 *      JS — consistent with every other file in capabilities/,
 *      models/, validation/, etc.
 */

import type { Frequency } from "../HarmonicTypes";
import type { AudioBuffer as SigilAudioBuffer, AudioFrame } from "../AudioTypes";

import { WaveMath } from "../math/WaveMath";
import { FrequencyMath } from "../math/FrequencyMath";
import { HarmonicMath } from "../math/HarmonicMath";

import { AUDIO } from "../AudioConstants";
import { HARMONICS } from "../HarmonicConstants";

export class AudioRuntime {

    private constructor() {

        // Static utility class only — never instantiated,
        // matching the convention already established by
        // WaveMath, FrequencyMath, and HarmonicMath.

    }

    /* ============================================================
     * Timing
     * ============================================================ */

    static sampleCount(durationSeconds: number, sampleRate: number = AUDIO.SAMPLE_RATE): number {

        if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) {
            throw new Error("AudioRuntime.sampleCount: durationSeconds must be a positive finite number.");
        }

        if (!Number.isFinite(sampleRate) || sampleRate <= 0) {
            throw new Error("AudioRuntime.sampleCount: sampleRate must be a positive finite number.");
        }

        return Math.round(durationSeconds * sampleRate);

    }

    /* ============================================================
     * Oscillator Buffers — WaveMath.sineWave / cosineWave
     * ============================================================ */

    static generateSineBuffer(
        frequency: Frequency,
        amplitude: number,
        phase: number,
        durationSeconds: number,
        sampleRate: number = AUDIO.SAMPLE_RATE
    ): number[] {

        const count = AudioRuntime.sampleCount(durationSeconds, sampleRate);
        const buffer = new Array<number>(count);

        for (let i = 0; i < count; i++) {
            const time = i / sampleRate;
            buffer[i] = WaveMath.sineWave(amplitude, frequency, phase, time);
        }

        return buffer;

    }

    static generateCosineBuffer(
        frequency: Frequency,
        amplitude: number,
        phase: number,
        durationSeconds: number,
        sampleRate: number = AUDIO.SAMPLE_RATE
    ): number[] {

        const count = AudioRuntime.sampleCount(durationSeconds, sampleRate);
        const buffer = new Array<number>(count);

        for (let i = 0; i < count; i++) {
            const time = i / sampleRate;
            buffer[i] = WaveMath.cosineWave(amplitude, frequency, phase, time);
        }

        return buffer;

    }

    /* ============================================================
     * Harmonic Series Synthesis
     * ============================================================ */

    static generateHarmonicSeriesBuffer(
        fundamental: Frequency,
        harmonicCount: number,
        amplitude: number,
        durationSeconds: number,
        sampleRate: number = AUDIO.SAMPLE_RATE
    ): number[] {

        const series = HarmonicMath.generateHarmonicSeries(fundamental, harmonicCount);

        const buffers = series.map(freq =>
            AudioRuntime.generateSineBuffer(
                freq,
                amplitude,
                HARMONICS.DEFAULT_PHASE,
                durationSeconds,
                sampleRate
            )
        );

        return WaveMath.waveSuperposition(buffers);

    }

    /* ============================================================
     * Mixing — WaveMath.waveSuperposition
     * ============================================================ */

    static mixBuffers(buffers: readonly (readonly number[])[]): number[] {

        return WaveMath.waveSuperposition(buffers);

    }

    /* ============================================================
     * Gain — WaveMath.scaleAmplitude
     * ============================================================ */

    static applyGain(buffer: readonly number[], gain: number): number[] {

        const clampedGain = Math.min(AUDIO.MAX_GAIN, Math.max(AUDIO.MIN_GAIN, gain));

        return buffer.map(sample => WaveMath.scaleAmplitude(Math.abs(sample), clampedGain) * Math.sign(sample));

    }

    /* ============================================================
     * Normalization — WaveMath.peakAmplitude + scaleAmplitude
     * ============================================================ */

    static normalizeBuffer(buffer: readonly number[], targetPeak: number = AUDIO.MAX_GAIN): number[] {

        if (!AUDIO.NORMALIZATION) {
            return [...buffer];
        }

        const peak = WaveMath.peakAmplitude(buffer);

        if (peak === 0) {
            return [...buffer];
        }

        const factor = targetPeak / peak;

        return buffer.map(sample => WaveMath.scaleAmplitude(Math.abs(sample), factor) * Math.sign(sample));

    }

    /* ============================================================
     * Analysis passthroughs
     * ============================================================ */

    static measureRms(buffer: readonly number[]): number {

        return WaveMath.rms(buffer);

    }

    static measurePeak(buffer: readonly number[]): number {

        return WaveMath.peakAmplitude(buffer);

    }

    static measureEnergy(buffer: readonly number[]): number {

        return WaveMath.waveEnergy(buffer);

    }

    /* ============================================================
     * Binaural Pair
     * ============================================================ */

    static isValidBinauralBeatFrequency(beatFrequency: number): boolean {

        if (!Number.isFinite(beatFrequency)) {
            return false;
        }

        return (
            beatFrequency >= AUDIO.BINAURAL.MIN_BEAT_FREQUENCY &&
            beatFrequency <= AUDIO.BINAURAL.MAX_BEAT_FREQUENCY
        );

    }

    static generateBinauralPair(
        leftFrequency: Frequency,
        rightFrequency: Frequency,
        amplitude: number,
        durationSeconds: number,
        sampleRate: number = AUDIO.SAMPLE_RATE
    ): { left: number[]; right: number[]; beatFrequency: number; validBeatFrequency: boolean } {

        const beat = FrequencyMath.beatFrequency(leftFrequency, rightFrequency);

        const left = AudioRuntime.generateSineBuffer(
            leftFrequency,
            amplitude,
            HARMONICS.DEFAULT_PHASE,
            durationSeconds,
            sampleRate
        );

        const right = AudioRuntime.generateSineBuffer(
            rightFrequency,
            amplitude,
            HARMONICS.DEFAULT_PHASE,
            durationSeconds,
            sampleRate
        );

        return {
            left,
            right,
            beatFrequency: beat.value,
            validBeatFrequency: AudioRuntime.isValidBinauralBeatFrequency(beat.value)
        };

    }

    /* ============================================================
     * Buffer Assembly
     * ============================================================ */

    static assembleAudioBuffer(
        id: string,
        left: readonly number[],
        right: readonly number[],
        sampleRate: number = AUDIO.SAMPLE_RATE
    ): SigilAudioBuffer {

        if (left.length !== right.length) {
            throw new Error("AudioRuntime.assembleAudioBuffer: left and right must have the same length.");
        }

        const frames: AudioFrame[] = new Array(left.length);

        for (let i = 0; i < left.length; i++) {

            frames[i] = {
                index: i,
                time: i / sampleRate,
                left: left[i],
                right: right[i]
            };

        }

        return {
            id,
            sampleRate,
            channels: AUDIO.CHANNELS,
            frames,
            durationSeconds: left.length / sampleRate
        };

    }

}
