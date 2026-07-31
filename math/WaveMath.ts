/**
 * WaveMath.ts
 *
 * Pure mathematics.
 * No engine logic.
 * No renderer logic.
 * No audio processing.
 * No Three.js.
 * No DOM.
 * No browser APIs.
 *
 * Static utility class only — WaveMath is never
 * instantiated. Every method is a deterministic pure
 * function operating on plain numbers / sample arrays.
 * No FFT, no DSP filters, no WAV generation, no
 * binaural/subliminal logic.
 *
 * Independent of every other engine subsystem except
 * HarmonicTypes.ts.
 */

import type { Frequency } from "./HarmonicTypes";

const TWO_PI = Math.PI * 2;

function assertPositive(value: number, label: string): void {

    if (!(value > 0)) {
        throw new Error(`WaveMath: ${label} must be a positive number.`);
    }

}

function assertNonNegative(value: number, label: string): void {

    if (!(value >= 0)) {
        throw new Error(`WaveMath: ${label} must be a non-negative number.`);
    }

}

function assertFinite(value: number, label: string): void {

    if (!Number.isFinite(value)) {
        throw new Error(`WaveMath: ${label} must be a finite number.`);
    }

}

function assertNonEmpty(samples: readonly number[], label: string): void {

    if (samples.length === 0) {
        throw new Error(`WaveMath: ${label} must not be empty.`);
    }

}

export class WaveMath {

    private constructor() {

        // Static utility class only — never instantiated.

    }

    /* ---------- Sine / Cosine Wave ---------- */

    static sineWave(amplitude: number, frequency: Frequency, phase: number, time: number): number {

        assertNonNegative(amplitude, "amplitude");
        assertPositive(frequency.value, "frequency");
        assertFinite(phase, "phase");
        assertFinite(time, "time");

        return amplitude * Math.sin(TWO_PI * frequency.value * time + phase);

    }

    static cosineWave(amplitude: number, frequency: Frequency, phase: number, time: number): number {

        assertNonNegative(amplitude, "amplitude");
        assertPositive(frequency.value, "frequency");
        assertFinite(phase, "phase");
        assertFinite(time, "time");

        return amplitude * Math.cos(TWO_PI * frequency.value * time + phase);

    }

    /* ---------- Phase Wrapping / Normalization ---------- */

    static wrapPhase(phase: number): number {

        assertFinite(phase, "phase");

        let wrapped = phase % TWO_PI;

        if (wrapped > Math.PI) wrapped -= TWO_PI;
        if (wrapped <= -Math.PI) wrapped += TWO_PI;

        return wrapped;

    }

    static normalizePhase(phase: number): number {

        assertFinite(phase, "phase");

        let normalized = phase % TWO_PI;

        if (normalized < 0) normalized += TWO_PI;

        return normalized;

    }

    /* ---------- Amplitude Scaling ---------- */

    static scaleAmplitude(amplitude: number, factor: number): number {

        assertNonNegative(amplitude, "amplitude");
        assertFinite(factor, "factor");

        return amplitude * factor;

    }

    /* ---------- RMS ---------- */

    static rms(samples: readonly number[]): number {

        assertNonEmpty(samples, "samples");

        let sumSquares = 0;

        for (const s of samples) {
            sumSquares += s * s;
        }

        return Math.sqrt(sumSquares / samples.length);

    }

    /* ---------- Peak Amplitude ---------- */

    static peakAmplitude(samples: readonly number[]): number {

        assertNonEmpty(samples, "samples");

        let peak = 0;

        for (const s of samples) {

            const abs = Math.abs(s);

            if (abs > peak) peak = abs;

        }

        return peak;

    }

    /* ---------- Wave Energy ---------- */

    static waveEnergy(samples: readonly number[]): number {

        assertNonEmpty(samples, "samples");

        let energy = 0;

        for (const s of samples) {
            energy += s * s;
        }

        return energy;

    }

    /* ---------- Wave Superposition ---------- */

    static waveSuperposition(waves: readonly (readonly number[])[]): number[] {

        if (waves.length === 0) {
            throw new Error("WaveMath.waveSuperposition: waves must not be empty.");
        }

        const length = waves[0].length;

        assertNonEmpty(waves[0], "waves[0]");

        for (const w of waves) {

            if (w.length !== length) {
                throw new Error("WaveMath.waveSuperposition: all wave arrays must have the same length.");
            }

        }

        const result = new Array<number>(length).fill(0);

        for (const w of waves) {
            for (let i = 0; i < length; i++) {
                result[i] += w[i];
            }
        }

        return result;

    }

    /* ---------- Wave Correlation ---------- */

    static waveCorrelation(a: readonly number[], b: readonly number[]): number {

        assertNonEmpty(a, "a");
        assertNonEmpty(b, "b");

        if (a.length !== b.length) {
            throw new Error("WaveMath.waveCorrelation: a and b must have the same length.");
        }

        let dot = 0;
        let sumA = 0;
        let sumB = 0;

        for (let i = 0; i < a.length; i++) {
            dot += a[i] * b[i];
            sumA += a[i] * a[i];
            sumB += b[i] * b[i];
        }

        if (sumA === 0 || sumB === 0) {
            throw new Error("WaveMath.waveCorrelation: correlation is undefined for a zero-energy (silent) signal.");
        }

        return dot / Math.sqrt(sumA * sumB);

    }

}
